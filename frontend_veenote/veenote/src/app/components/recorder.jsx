'use client';

import { useRef, useState, useEffect} from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import { notification } from 'antd';
import Link from 'next/link';
import TranscriptionEditor from './TranscriptionEditor';
import { useAuth } from './AuthContext';
import axios from 'axios';
import LogoutButton from './LogoutComponent';
import {useRouter} from 'next/navigation';

function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const audioChunksRef = useRef([]); // Use a ref to persist audio chunks
  const [transcriptionText, setTranscriptionText] = useState('');
  const [error, setError] = useState('');
  const { state } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setTranscriptionText(transcriptionText);
  }, [transcriptionText]);

  const handleDataAvailable = (event) => {
    console.log('Data available from recording...');
    if (event.data.size > 0) {
      console.log(`Data size: ${event.data.size}`);
      audioChunksRef.current.push(event.data);
    } else {
      console.log('Data chunk size is 0.');
    }
  };

  const handleStop = () => {
    console.log('Recording stopped.');
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      console.log(`Final audio blob size: ${audioBlob.size}`);
      if (audioBlob.size > 0) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
  
        // Replace 'YOUR_BACKEND_ENDPOINT' with your actual endpoint URL
        axios.post('http://localhost:8000/api/v1/aws/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log('Success:', response.data);
          console.log('s3Uri', response.data.s3Uri);
          notification.success({
            message: 'Recording Uploaded',
            description: 'Your recording has been uploaded successfully.'
          })
        })
        .catch((error) => {
          console.error('Error:', error);
          notification.error({
            message: 'Upload Error',
            description: 'Failed to upload the recording. Please try again.'
          });
        });
      } else {
        console.log('No audio data was captured.');
        notification.error({
          message: 'Recording Error',
          description: 'No audio data was captured. Please try again.'
        });
      }
    } else {
      console.log('No audio chunks were captured.');
    }
    audioChunksRef.current = [];
  };

  const startRecording = () => {
    if (!isRecording) {
        console.log('Starting recording...');
        const constraints = {
            audio: {
                noiseSuppression: true, // Enable noise suppression
                echoCancellation: true, // Enable echo cancellation
                echoCancellationType: 'browser' // Use browser echo cancellation
            }
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                mediaRecorderRef.current.onstop = handleStop;
                mediaRecorderRef.current.start();
                setIsRecording(true);
                console.log('MediaRecorder started.');
                setDuration(0);
                setError('');  // Clear any previous errors
                setAudioChunks([]);
                intervalRef.current = setInterval(() => setDuration((prevDuration) => prevDuration + 1), 1000);
            }).catch((error) => {
                console.error('Error accessing the microphone:', error);
                setError('Error accessing the microphone.');
                notification.error({
                  message: 'Recording Error',
                  description: 'There was an error accessing the microphone. Please try again.'
                });
            });
    }
};

  const stopRecording = () => {
    if (isRecording && mediaRecorderRef.current) {
      console.log('Stopping recording...');
      mediaRecorderRef.current.stop();
      clearInterval(intervalRef.current);
      setIsRecording(false);
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // useEffect(() => {
  //   // Simulate fetching data from an API
  //   const fetchTranscription = async () => {
  //     try {
  //       const response = await fetch('https://api.example.com/transcription');
  //       const data = await response.json();
  //       setTranscriptionText(data.text);
  //     } catch (error) {
  //       notification.error({
  //         message: 'Fetch Error',
  //         description: 'Failed to fetch transcription data. Please try again.'
  //       });
  //     }
  //   };

  //   fetchTranscription();
  // }, []);


  return (
    <div>
      {!state.isAuthenticated && (
      <div className="absolute top-5 right-5">
        <Link href="/login" className="text-blue-500 bg-white hover:bg-blue-100 font-bold py-2 px-4 rounded mr-2 shadow">Login</Link>
        <Link href="/register" className="text-green-500 bg-white hover:bg-blue-100 font-bold py-2 px-4 rounded shadow">Signup</Link>
      </div>
      )}

      {state.isAuthenticated && (
      <div className="absolute top-5 right-5">
        <LogoutButton />
      </div>
      )}

      {console.log('State:', state)}
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="text-center mt-20 ">
        <p className="text-2xl mb-4 text-white">{formatDuration(duration)}</p>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`inline-block p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isRecording ? <StopIcon className="h-10 w-10" /> : <MicrophoneIcon className="h-10 w-10" />}
        </button>
      </div>
    </div>
  );
  
}

export default VoiceRecorder;
