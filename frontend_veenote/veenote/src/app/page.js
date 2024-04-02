'use client';

import {react, useEffect, useState } from 'react';
import VoiceRecorder from './components/recorder';
import { AuthProvider } from './components/AuthContext';
import SidebarComponent from './components/SideBar';
import TranscriptionEditor from './components/TranscriptionEditor';
import axios from 'axios';
import { notification } from 'antd';
import './globals.css';
import { useRouter } from 'next/navigation';

export default function Page() {
  const userNotes = Array.from({ length: 120 }, (v, i) => ({
    title: `Note ${i + 1}`,
    content: `Content for Note ${i + 1}`, // Assuming each note has a content property
    id: i + 1
  }));

  const [notes, setNotes] = useState([]);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [error, setError] = useState('');
  const [folders, setFolder] = useState([]);
  const [foldersName, setFoldersName] = useState([])
  const [currentNote, setCurrentNote] = useState({ content: '', title: '' });
  const router = useRouter();

  const mockFolders = [
    {
      id: 1,
      name: 'Work',
    },
    {
      id: 2,
      name: 'Personal',
    },
    {
      id: 3,
      name: 'Travel',
    },
    {
      id: 4,
      name: 'Archive',
    }
  ];
  useEffect(() => {
    console.log('fetching folders')
    const fetchFolders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/user/folder/getAll', {
          withCredentials: true,
        });
        console.log('response', response.data.data);
        setFolder(response.data.data);
      } catch (error) {
        console.error('Error fetching folders:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch folders. Please try again.'
        })
      }
    };

    fetchFolders()

    // setFolder(mockFolders);
  }, []);



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
      else {
        notification.error({
          message: 'Save Error',
          description: 'Failed to save transcription. Please try again.'
        });
      }
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

  const handleTranscription = (newTranscription) => {
    setTranscriptionText(newTranscription);
  };

  const handleAddFolder = (newFolder) => {
    setFolder([...folders, newFolder]);
  };
  
  
  return (
    <AuthProvider>
      <div className="flex flex-col justify-center min-h-screen bg-gray-600 p-5">
        <VoiceRecorder onTranscriptionComplete={handleTranscription} />
        <div className="w-full max-w-3xl mx-auto mb-5 justify-center">
          <TranscriptionEditor transcriptionText={transcriptionText || currentNote.content} fileName={currentNote.title} onSave={handleTranscriptionSave}/>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </div>
        <SidebarComponent username={'ola'} 
        notes={userNotes} 
        folders={folders} 
        onNoteSelect={handleNoteSelect} 
        onDelete={handleDeleteNote} 
        onRename={handleRenameNote}
        onAddFolder={handleAddFolder}/>
      </div>
    </AuthProvider>
  );
}

