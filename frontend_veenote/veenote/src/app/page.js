'use client';

import react from 'react';
import VoiceRecorder from './components/recorder';
import { AuthProvider } from './components/AuthContext';
import SidebarComponent from './components/SideBar';
import './globals.css';

export default function Page() {
  const userNotes = Array.from({ length: 100 }, (v, i) => ({
    title: `Note ${i + 1}`,
    id: i + 1
  }));
  
  return (
    <AuthProvider>
      <div className="flex flex-col justify-center min-h-screen bg-gray-600 p-5">
        <VoiceRecorder />
        <SidebarComponent username={'ola'} notes={userNotes}/>
      </div>
    </AuthProvider>
  );
}

