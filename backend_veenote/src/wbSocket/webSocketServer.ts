import webSocket, { WebSocket } from 'ws';
import http from 'http';
import { StartStreamTranscriptionCommand, TranscribeStreamingClient, TranscriptEvent as AWSTranscriptEvent } from "@aws-sdk/client-transcribe-streaming";
import client from '../aws/streamingConfig.js';
import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';
import fs from 'fs';

const initializeWebSocketServer = (server: http.Server): void => {
    const wss = new webSocket.Server({ server });
    console.log('WebSocket server started');
    let isAudioEnded = false;

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');
        let transcriptBuffer: string = '';

        const audioStream = new Readable({ read() {} });
        const ffmpegStream = new PassThrough();

        // const outputFile = '/output.pcm'; // Output file path
        // const fileWriteStream = fs.createWriteStream(outputFile);

        ffmpeg(audioStream)
            .inputFormat('webm')
            .audioCodec('pcm_s16le')
            .audioFrequency(48000)
            .audioChannels(1)
            .format('s16le')
            .on('error', (err: Error) => {
                console.error('Error in FFmpeg processing:', err.message);
                ws.send(JSON.stringify({ type: 'error', message: 'FFmpeg processing error' }));
            })
            .on('end', () => {
                console.log('FFmpeg processing ended.');
                ffmpegStream.end();
            })
            .pipe(ffmpegStream);
            

            ws.on('message', (data: webSocket.Data) => {
                if (typeof data === 'string') {
                    // Parse the message to check its type
                    const message = JSON.parse(data);
                    if (message.type === 'endOfAudio') {
                        console.log('End of audio received');
                        isAudioEnded = true;
                        // Check if there are still ongoing transcriptions before sending the final one
                        if (transcriptBuffer.length > 0) {
                            sendFinalTranscript();
                        }
                    }
                } else if (Buffer.isBuffer(data)) {
                    console.log(`Received audio chunk with size: ${data.length} bytes`);
                    audioStream.push(data);
                }
            });
            
            const sendFinalTranscript = () => {
                if (transcriptBuffer.trim().length > 0) {
                    ws.send(JSON.stringify({ type: 'finalTranscript', message: transcriptBuffer }));
                      // Clear the buffer after sending
                        transcriptBuffer = '';
                }
            };

        ws.on('close', () => {
            console.log('Client disconnected');
            audioStream.push(null); // End the audio stream
            
        });

        ws.on('error', (err: Error) => {
            console.error('WebSocket error:', err.message);
            ws.send(JSON.stringify({ type: 'error', message: 'WebSocket error' }));
        });

        const transcribeAudioStream = async function* (): AsyncGenerator<{ AudioEvent: { AudioChunk: Uint8Array } }, void, unknown> {
            for await (const chunk of ffmpegStream) {
                console.log(`Yielding processed audio chunk of size: ${chunk.length}`);
                yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };
            }
        };

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

                            // Send the transcription to the client if it's not empty
                            if (transcriptBuffer.trim().length > 0 && isAudioEnded) {
                                sendFinalTranscript();
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
