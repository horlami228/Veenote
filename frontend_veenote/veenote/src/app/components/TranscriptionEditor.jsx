'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, notification } from 'antd';

const TranscriptionEditor = ({ transcriptionText, onSave }) => {
  const [text, setText] = useState(transcriptionText || '');
  const [filename, setFilename] = useState('');
  const [error, setError] = useState('');
  
  const isSaveDisabled = !text || !text.trim();

  // useEffect(() => {
  //   // Reset error when text or transcriptionText changes
  //   setError('');
  //   if (transcriptionText !== undefined) {
  //     setText(transcriptionText);
  //   } else {
  //     setText('');
  //     setError('Transcription text is undefined.');
  //   }
  // }, [transcriptionText]);

  const handleSave = () => {
    if (!text.trim()) {
      notification.error({
        message: 'Error',
        description: 'Text is empty',
      });
      return; // Exit early if there's an error
    }

  //   if (!filename.trim()) {
  //     notification.error({
  //       message: 'Error',
  //       description: 'Filename is empty',
  //     });
  //     return; // Exit early if there's an error
  // };

  onSave(text, filename);
  setText('');
  setFilename('');
}

  return (
    <div className="p-4">
      <div className="mb-5 mt-10">
        <Input.TextArea
          rows={15}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: '16px' }}
        />
      </div>
      <div className="mb-5">
        <Input
          placeholder="Enter file name"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="custom-placeholder" 
        />
      </div>
      
      <Button
        onClick={handleSave}
        disabled={isSaveDisabled}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150 text-lg leading-none"
        >
          Save
      </Button>
      {error && <p className="text-red-500 text-center text-xl">{error}</p>}
    </div>
  );
};

export default TranscriptionEditor;
