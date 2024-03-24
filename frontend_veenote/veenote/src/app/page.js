'use client';

import { useRef, useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const audioChunksRef = useRef([]); // Use a ref to persist audio chunks

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
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = handleDataAvailable;
          mediaRecorderRef.current.onstop = handleStop;
          mediaRecorderRef.current.start();
          setIsRecording(true);
          console.log('MediaRecorder started.');
          setDuration(0);
          setAudioChunks([]);
          intervalRef.current = setInterval(() => setDuration((prevDuration) => prevDuration + 1), 1000);
        }).catch((error) => {
          console.error('Error accessing the microphone:', error);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="absolute top-5 right-5">
        <Link href="/login" className="text-blue-500 bg-white hover:bg-blue-100 font-bold py-2 px-4 rounded mr-2 shadow">Login</Link>
        <Link href="/signup" className="text-green-500 bg-white hover:bg-blue-100 font-bold py-2 px-4 rounded shadow">Signup</Link>
      </div>
      <p className="text-2xl">{formatDuration(duration)}</p>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`mt-4 p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {isRecording ? <StopIcon className="h-10 w-10" /> : <MicrophoneIcon className="h-10 w-10" />}
      </button>
    </div>
  );
}
