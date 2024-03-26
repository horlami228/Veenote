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
        const audioUrl = URL.createObjectURL(audioBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = audioUrl;
        downloadLink.setAttribute('download', 'recording.wav');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.log('No audio data was captured.');
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

  const handleTranscriptionSave = (text, filename) => {
    setError('');  // Clear any previous errors
    console.log('Saving', { text, filename });
      // Initialize the data object with content
    let data = {
      content: text
    };

    // Add fileName to the data object only if filename is not empty
    if (filename !== '') {
      data.fileName = filename;
    }
    // Implement the saving logic here, e.g., API call or localStorage update
    axios.post('http://localhost:8000/api/v1/user/create/note/new', data, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response);
      notification.success({
        message: 'Save Success',
      })
    })
    .catch((error) => {
      console.error('Error saving transcription:', error);
      if (error.response && error.response.status === 403) {
        notification.error({
          message: 'Save Error',
          description: 'You are not authorized to save transcriptions. Please login.'
        });
        router.push('/login');
      } else if (error.response && error.response.status === 403) {
        notification.error({
          message: 'Save Error',
          description: 'Failed to save transcription. Please try again.'
        });
      } else if (error.response && error.response.status === 400) {
        if (error.response.data.errorCode === 'DuplicateFileName') {
          setError('Filename already exists. Please choose a different filename.');
        } else if (error.response.data.errorCode === 'MissingContent') {
          setError('Content is missing. Please ensure all required fields are filled.');
        } else {
          // Fallback error message if the specific error is not recognized
          setError('An error occurred. Please check your input and try again.');
        }
      }
    });
  };

  return (
    <div>
      <div className="w-full max-w-3xl mx-auto mb-5 justify-center">
        <TranscriptionEditor transriptionText={transcriptionText}
        onSave={handleTranscriptionSave}/>
      </div>

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
