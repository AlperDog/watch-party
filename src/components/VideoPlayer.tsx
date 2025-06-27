import React, { useState } from 'react';
import styled from 'styled-components';
import { IoPlay, IoPause, IoVolumeHigh, IoExpand, IoShare } from 'react-icons/io5';

interface VideoPlayerProps {
  onVideoAction: (action: string, payload: any) => void;
}

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

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${VideoContainer}:hover & {
    opacity: 1;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
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
  background: #667eea;
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
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.1s;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #667eea;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
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

const VideoPlayer: React.FC<VideoPlayerProps> = ({ onVideoAction }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onVideoAction('playPause', { isPlaying: newPlayingState });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    setProgress(newProgress);
    onVideoAction('seek', { progress: newProgress });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    onVideoAction('volume', { volume: newVolume });
  };

  const handleFullscreen = () => {
    onVideoAction('fullscreen', {});
  };

  const handleShare = () => {
    onVideoAction('share', {});
  };

  return (
    <VideoContainer>
      <VideoPlaceholder>
        <VideoTitle>🎬 WatchParty Video Player</VideoTitle>
        <VideoDescription>
          This is a placeholder for the video player. In the full implementation, 
          this would integrate with YouTube API or other video platforms for 
          synchronized playback across all participants.
        </VideoDescription>
      </VideoPlaceholder>
      
      <ControlsOverlay>
        <ControlsContainer>
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
              onChange={handleVolumeChange}
            />
          </VolumeControl>
          
          <ControlButton onClick={handleShare}>
            <IoShare />
          </ControlButton>
          
          <ControlButton onClick={handleFullscreen}>
            <IoExpand />
          </ControlButton>
        </ControlsContainer>
      </ControlsOverlay>
    </VideoContainer>
  );
};

export default VideoPlayer; 