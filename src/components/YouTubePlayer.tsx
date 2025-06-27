import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import { IoPlay, IoPause, IoVolumeHigh, IoExpand, IoShare } from 'react-icons/io5';

interface YouTubePlayerProps {
  videoId: string;
  onVideoAction: (action: string, payload: any) => void;
  onVideoStateChange?: (state: any) => void;
  isHost?: boolean;
}

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const YouTubeWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  iframe {
    width: 100%;
    height: 100%;
  }
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
  
  ${PlayerContainer}:hover & {
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
    background: #ff0000;
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

const VideoInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  color: white;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s;
  
  ${PlayerContainer}:hover & {
    opacity: 1;
  }
`;

const VideoTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const VideoDescription = styled.p`
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`;

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId, 
  onVideoAction, 
  onVideoStateChange,
  isHost = true 
}) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0, // Hide default controls
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 0, // Disable fullscreen button
      cc_load_policy: 0,
      disablekb: 1, // Disable keyboard controls
    },
  };

  useEffect(() => {
    // Update progress every second
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          const progress = (currentTime / duration) * 100;
          setProgress(progress);
          setCurrentTime(currentTime);
          setDuration(duration);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const onReady = (event: any) => {
    playerRef.current = event.target;
    setVolume(50);
    event.target.setVolume(50);
    
    // Get video info
    if (event.target.getVideoData) {
      const data = event.target.getVideoData();
      setVideoTitle(data.title);
      setVideoDescription(`Duration: ${Math.floor(data.lengthSeconds / 60)}:${(data.lengthSeconds % 60).toString().padStart(2, '0')}`);
    }
  };

  const onStateChange = (event: any) => {
    const state = event.data;
    const player = event.target;
    
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (state === 1) {
      setIsPlaying(true);
      if (isHost) {
        onVideoAction('play', { 
          currentTime: player.getCurrentTime(),
          timestamp: Date.now()
        });
      }
    } else if (state === 2) {
      setIsPlaying(false);
      if (isHost) {
        onVideoAction('pause', { 
          currentTime: player.getCurrentTime(),
          timestamp: Date.now()
        });
      }
    }

    if (onVideoStateChange) {
      onVideoStateChange({ state, player });
    }
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !isHost) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;
    
    setProgress(newProgress);
    playerRef.current.seekTo(newTime);
    
    onVideoAction('seek', { 
      time: newTime,
      progress: newProgress,
      timestamp: Date.now()
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
    
    if (isHost) {
      onVideoAction('volume', { volume: newVolume });
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      playerRef.current.requestFullscreen();
    }
  };

  const handleShare = () => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(videoUrl);
    alert('Video URL copied to clipboard!');
  };

  // Handle incoming video sync commands
  useEffect(() => {
    const handleVideoSync = (action: string, payload: any) => {
      if (!playerRef.current || !isHost) return;

      switch (action) {
        case 'play':
          playerRef.current.seekTo(payload.currentTime);
          playerRef.current.playVideo();
          break;
        case 'pause':
          playerRef.current.seekTo(payload.currentTime);
          playerRef.current.pauseVideo();
          break;
        case 'seek':
          playerRef.current.seekTo(payload.time);
          break;
        case 'volume':
          playerRef.current.setVolume(payload.volume);
          setVolume(payload.volume);
          break;
      }
    };

    // This would be called from the parent component when receiving WebSocket messages
    // For now, we'll handle it through the onVideoAction callback
  }, [isHost]);

  if (!videoId) {
    return (
      <PlayerContainer>
        <VideoInfo>
          <VideoTitle>🎬 No Video Selected</VideoTitle>
          <VideoDescription>Enter a YouTube video ID to start watching together</VideoDescription>
        </VideoInfo>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <YouTubeWrapper>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </YouTubeWrapper>
      
      <VideoInfo>
        <VideoTitle>{videoTitle || 'Loading...'}</VideoTitle>
        <VideoDescription>{videoDescription}</VideoDescription>
      </VideoInfo>
      
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
    </PlayerContainer>
  );
};

export default YouTubePlayer; 