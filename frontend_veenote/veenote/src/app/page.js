'use client';

import react from 'react';
import VoiceRecorder from './components/recorder';
import { AuthProvider } from './components/AuthContext';
import './globals.css';

export default function Page() {
  return (
    <AuthProvider>
      <div className="flex flex-col justify-center min-h-screen bg-gray-600 p-5">
        <VoiceRecorder />
      </div>
    </AuthProvider>
  );
}

