import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPlay, IoPause, IoVolumeHigh, IoExpand, IoShare } from 'react-icons/io5';

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 16px;
`;

const VideoTitle = styled.h2`
  color: #fff;
  font-size: 24px;
  margin-bottom: 8px;
  text-align: center;
`;

const VideoDescription = styled.p`
  color: #ccc;
  font-size: 14px;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${VideoContainer}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SeekBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const SeekProgress = styled.div<{ progress: number }>`
  height: 100%;
  background: #ff0000;
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s;
`;

const SeekHandle = styled.div<{ progress: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.progress}%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #ff0000;
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.1s;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const VideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [volume, setVolume] = useState(80);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, newProgress)));
  };

  return (
    <VideoContainer>
      <VideoPlaceholder>
        <VideoTitle>🎬 Sample Movie Title</VideoTitle>
        <VideoDescription>
          This is a placeholder for the video player. In the real app, 
          this would be an embedded YouTube video or other streaming content.
        </VideoDescription>
      </VideoPlaceholder>
      
      <Controls>
        <PlayButton onClick={handlePlayPause}>
          {isPlaying ? <IoPause /> : <IoPlay />}
        </PlayButton>
        
        <SeekBar onClick={handleSeek}>
          <SeekProgress progress={progress} />
          <SeekHandle progress={progress} />
        </SeekBar>
        
        <VolumeControl>
          <IoVolumeHigh />
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </VolumeControl>
        
        <ControlButton>
          <IoShare />
        </ControlButton>
        
        <ControlButton>
          <IoExpand />
        </ControlButton>
      </Controls>
    </VideoContainer>
  );
};

export default VideoPlayer; 