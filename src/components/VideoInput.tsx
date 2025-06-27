import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPlay, IoLink } from 'react-icons/io5';

interface VideoInputProps {
  onVideoChange: (videoId: string) => void;
  currentVideoId?: string;
}

const Container = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 300px;
`;

const Title = styled.h3`
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: #888;
  }

  &:focus {
    border-color: #ff0000;
  }
`;

const Button = styled.button`
  background: #ff0000;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: #cc0000;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const CurrentVideo = styled.div`
  color: #ccc;
  font-size: 12px;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  word-break: break-all;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 8px;
`;

const VideoInput: React.FC<VideoInputProps> = ({ onVideoChange, currentVideoId }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (url: string): string | null => {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  const handleSubmit = () => {
    const videoId = extractVideoId(input.trim());
    
    if (videoId) {
      setError('');
      onVideoChange(videoId);
      setInput('');
    } else {
      setError('Please enter a valid YouTube URL or video ID');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    const videoId = extractVideoId(pastedText);
    
    if (videoId) {
      setInput(videoId);
      setError('');
    }
  };

  return (
    <Container>
      <Title>
        <IoLink />
        Add YouTube Video
      </Title>
      
      <InputGroup>
        <Input
          type="text"
          placeholder="Paste YouTube URL or enter video ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
        />
        <Button onClick={handleSubmit} disabled={!input.trim()}>
          <IoPlay />
          Load
        </Button>
      </InputGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {currentVideoId && (
        <CurrentVideo>
          Current: {currentVideoId}
        </CurrentVideo>
      )}
    </Container>
  );
};

export default VideoInput; 