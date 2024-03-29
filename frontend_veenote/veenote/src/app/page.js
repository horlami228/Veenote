'use client';

import {react, useEffect, useState } from 'react';
import VoiceRecorder from './components/recorder';
import { AuthProvider } from './components/AuthContext';
import SidebarComponent from './components/SideBar';
import TranscriptionEditor from './components/TranscriptionEditor';
import axios from 'axios';
import { notification } from 'antd';
import './globals.css';

export default function Page() {
  const userNotes = Array.from({ length: 120 }, (v, i) => ({
    title: `Note ${i + 1}`,
    content: `Content for Note ${i + 1}`, // Assuming each note has a content property
    id: i + 1
  }));

  const [notes, setNotes] = useState([]);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [error, setError] = useState('');
  const [currentNote, setCurrentNote] = useState({ content: '', title: '' });

  
  // useEffect(() => {
  //   const fetchNotes = async () => {
  //     try {
  //       const response = await axios.get(`http:localhost:8000/api/v1/notes/`);
  //       // Assuming the structure matches your backend response
  //       if (response.data.folders && response.data.folders.length > 0) {
  //         setNotes(response.data.folders[0].notes);
  //       } else {
  //         // Handle case where no notes are found or response structure is different
  //         setNotes([]);
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch notes:', error);
  //       // Handle error, possibly update state to show an error message
  //     }
  //   };
  
  //   fetchNotes();
  // }, []); // Refetch when folderId changes

  // const handleNoteSelect = (note) => {
  //   setSelectedNote({ content: note.content, filename: note.fileName });
  // };

  // const onTranscriptionComplete = (text) => {
  //   setTranscriptionText(text);
  // };

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
      notification.error({
        message: 'Save Error',
        description: 'Failed to save transcription. Please try again.'
      });
    });
  };

  const handleNoteSelect = (note) => {
    setCurrentNote({ content: note.content, title: note.title });
  };

  const handleDeleteNote = (noteId, e) => {
    // Update the state to filter out the deleted note
    e.stopPropagation();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);

    // If you have a backend, send a request to delete the note
    // axios.delete(`http://localhost:8000/api/v1/notes/${noteId}`)
    //   .then(response => {
    //     // Handle the response, if necessary
    //   })
    //   .catch(error => {
    //     console.error('Error deleting the note:', error);
    //   });
  };

  const handleRenameNote = (noteId, newName) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, title: newName };
      }
      return note;
    });
    setNotes(updatedNotes);
  
    // Optionally, send a request to update the backend
    // axios.put(`http://localhost:8000/api/v1/notes/${noteId}`, { title: newName })
    //   .then(response => {
    //     // Handle response
    //   })
    //   .catch(error => {
    //     console.error('Error updating note:', error);
    //   });
  };
  
  return (
    <AuthProvider>
      <div className="flex flex-col justify-center min-h-screen bg-gray-600 p-5">
        <VoiceRecorder />
        <div className="w-full max-w-3xl mx-auto mb-5 justify-center">
          <TranscriptionEditor transcriptionText={currentNote.content} fileName={currentNote.title} onSave={handleTranscriptionSave}/>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
        <SidebarComponent username={'ola'} notes={userNotes} onNoteSelect={handleNoteSelect} onDelete={handleDeleteNote} onRename={handleRenameNote}/>
      </div>
    </AuthProvider>
  );
}

