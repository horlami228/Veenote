import webSocket, { WebSocket } from 'ws';
import http from 'http';
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import client from '../aws/streamingConfig.js';
import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';


// Function to encode audio data to PCM format
const pcmEncode = (input: Float32Array): ArrayBuffer => {
    try {
        if (!input) {
            throw new Error('No input data');
        }
        const buffer = new ArrayBuffer(input.length * 2);
        const view = new DataView(buffer);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        }
        console.log('PCM encoding successful');
        return buffer;
    } catch (error) {
        console.error('Error encoding audio data:', error);
        throw new Error('Error encoding audio data');
    }
};



// Initializes a WebSocket server to handle real-time audio transcription.
const initializeWebSocketServer = (server: http.Server): void => {
    // Event listener for new WebSocket connections.
    const wss = new webSocket.Server({ server });
    console.log('WebSocket server started');

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');
        let transcriptBuffer: string = '';

        // Stream for incoming audio data.
        const audioStream = new Readable({ read() {} });
        // Stream to hold processed audio data for transcription
        const audioTransformStream = new PassThrough();

        // // Using FFmpeg to convert incoming audio to a pcm format for AWS Transcribe.
        // ffmpeg(audioStream)
        //     .inputFormat('webm')
        //     .audioCodec('pcm_s16le')
        //     .audioFrequency(48000)
        //     .audioChannels(1)
        //     .format('s16le')
        //     .on('error', (err: Error) => {
        //         console.error('Error in FFmpeg processing:', err.message);
        //         ws.send(JSON.stringify({ type: 'error', message: 'FFmpeg processing error' }));
        //     })
        //     .on('end', () => {
        //         console.log('FFmpeg processing ended.');
        //         ffmpegStream.end();
        //     })
        //     .pipe(ffmpegStream);
            
        audioStream.pipe(audioTransformStream);

            // Handling incoming WebSocket messages.
            ws.on('message', (data: webSocket.Data) => {
                if (typeof data === 'string') {
                    // Parse the message to check its type
                    const message = JSON.parse(data);
                    if (message.type === 'endOfAudio') {
                        console.log('End of audio received');
                        // Check if there are still ongoing transcriptions before sending the final one
                        if (transcriptBuffer.length > 0) {
                            sendFinalTranscript();
                        }
                    }
                } else if (data instanceof Buffer) {
                    console.log(`Received audio chunk with size: ${data.length} bytes`);
                    const uint8Array = new Uint8Array(data);
                    console.log(`Received audio chunk with size: ${uint8Array.length} bytes`);
                    const pcmChunk = pcmEncode(new Float32Array(uint8Array));
                    if (pcmChunk !== null) {
                        console.log(`Encoded audio chunk with size: ${pcmChunk.byteLength} bytes`);
                        console.log(`the type of pcmChunk is ${typeof pcmChunk}`);
                        audioStream.push(Buffer.from(pcmChunk));

                        // After pushing data to the audioStream
                        console.log(`Pushed PCM encoded audio chunk to audioStream`);
                    } else {
                        console.error('Error encoding audio chunk');
                        ws.send(JSON.stringify({ type: 'error', message: 'Error encoding audio chunk' }));
                    }
                } else {
                    console.error('Invalid WebSocket message received');
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid WebSocket message' }));
                }
            });
            // Sends the final transcription to the client.
            const sendFinalTranscript = () => {
                if (transcriptBuffer.trim().length > 0) {
                    ws.send(JSON.stringify({ type: 'finalTranscript', message: transcriptBuffer }));
                      // Clear the buffer after sending
                        transcriptBuffer = '';
                }
            };
            // Event listener for WebSocket connection close.
        ws.on('close', () => {
            console.log('Client disconnected');
            audioStream.push(null); // End the audio stream
            
        });
        // Event listener for WebSocket errors.
        ws.on('error', (err: Error) => {
            console.error('WebSocket error:', err.message);
            ws.send(JSON.stringify({ type: 'error', message: 'WebSocket error' }));
        });

        // Generator function to transcribe audio stream.
        const transcribeAudioStream = async function* (): AsyncGenerator<{ AudioEvent: { AudioChunk: Uint8Array } }, void, unknown> {
            console.log(`Waiting for data from audioTransformStream`);
            try {
                for await (const chunk of audioTransformStream) {
                    console.log(`Received chunk from audioTransformStream`);
                    console.log(`Yielding processed audio chunk of size: ${chunk.length}`);
                    yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };
                    console.log("Yielded audio chunk of size:", chunk.length);
                }
            } catch (error) {
                console.error('Error in transcribeAudioStream:', error);
            }
            console.log(`Finished yielding data from audioTransformStream`);
        };
        
        console.log('Sending transcription');
        
        // Configuring and sending the transcription command to AWS Transcribe.
        const command = new StartStreamTranscriptionCommand({
            LanguageCode: 'en-US',
            MediaSampleRateHertz: 48000,
            MediaEncoding: 'pcm',
            AudioStream: transcribeAudioStream(),
        });

        
        client.send(command).then(async (response) => {
            console.log('AWS Transcribe response received');
        
            try {
           if (response.TranscriptResultStream) {
                // Process the transcription results
                    for await (const event of response.TranscriptResultStream) {
                        const transcriptEvent = event;
                        if (transcriptEvent.TranscriptEvent && transcriptEvent.TranscriptEvent.Transcript && transcriptEvent.TranscriptEvent.Transcript.Results) {
                            for (const result of transcriptEvent.TranscriptEvent.Transcript.Results) {
                                if (!result.IsPartial && result.Alternatives && result.Alternatives.length > 0 && result.Alternatives[0].Transcript) {
                                    const transcript = result.Alternatives[0].Transcript.trim();
                                    console.log(`Transcription: ${transcript}`);
                                    console.log(`Appending transcription: ${transcript}`);
                                    transcriptBuffer += transcript + ' ';
                                }
                            }

                        }
                    }
                }
            } catch (error) {
                console.error('Error processing transcription results:', error);
                ws.send(JSON.stringify({ type: 'error', message: 'Error processing transcription results' }));
            }
        }).catch(error => {
            console.error('Error sending transcription request to AWS Transcribe:', error);
            ws.send(JSON.stringify({ type: 'error', message: 'Error with transcription service' }));
        });
        
    });
};

export default initializeWebSocketServer;
