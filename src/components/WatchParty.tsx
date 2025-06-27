import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Split from 'react-split';
import { IoArrowBack, IoShareOutline, IoList } from 'react-icons/io5';
import YouTubePlayer, { YouTubePlayerRef } from './YouTubePlayer';
import VideoInput from './VideoInput';
import ChatArea from './ChatArea';
import { WebSocketService } from '../services/websocket';
import PlaylistSidebar from './PlaylistSidebar';

interface WatchPartyProps {
  roomId: string;
  username: string;
  onLeave: () => void;
  wsService: WebSocketService;
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PartyName = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const InviteButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const PlaylistButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s;
  margin-left: 12px;
  &:hover {
    transform: translateY(-1px);
  }
`;

const MainContentWrapper = styled.div<{ sidebarOpen: boolean }>`
  transition: margin-right 0.3s, width 0.3s;
  width: ${({ sidebarOpen }) => (sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%')};
  margin-right: ${({ sidebarOpen }) => (sidebarOpen ? `${SIDEBAR_WIDTH}px` : '0')};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

const SplitContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const VideoSection = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
`;

const ChatSection = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  overflow: auto;
  flex: 1;
  min-height: 0;
`;

const SIDEBAR_WIDTH = 340;

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

// Add a helper for system messages
const addSystemMessage = (setMessages: any, text: string) => {
  setMessages((prev: any[]) => [
    ...prev,
    {
      id: prev.length + 1,
      user: 'System',
      avatar: 'ℹ️',
      message: text,
      timestamp: new Date()
    }
  ]);
};

// Helper to extract YouTube video ID from URL or ID
const extractVideoId = (input: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const WatchParty: React.FC<WatchPartyProps> = ({ roomId, username, onLeave, wsService }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isHost, setIsHost] = useState(true); // First user to join becomes host
  const playerRef = useRef<YouTubePlayerRef>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    addSystemMessage(setMessages, `Welcome to WatchParty!\n\nAvailable commands:\n/help — Show this help\n/info — Show room and video info\n/vote-skip — Start a vote to skip the current video\n/add [YouTube URL or ID] — Add a video to the playlist`);
  }, [roomId]);

  useEffect(() => {
    // Set up WebSocket message handlers
    wsService.onMessage('init', (data) => {
      if (data.chatHistory) {
        const formattedMessages = data.chatHistory.map((msg: any, index: number) => ({
          id: index + 1,
          user: msg.username,
          avatar: '👤',
          message: msg.message,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      }
      
      // Set current video if room has one
      if (data.videoState && data.videoState.videoId) {
        setCurrentVideoId(data.videoState.videoId);
      }
      
      // Set host status based on participant count
      setIsHost(data.participants === 1);
    });

    wsService.onMessage('chat', (data) => {
      const newMessage = {
        id: messages.length + 1,
        user: data.username,
        avatar: '👤',
        message: data.message,
        timestamp: new Date(data.timestamp)
      };
      setMessages(prev => [...prev, newMessage]);
    });

    wsService.onMessage('user-joined', (data) => {
      setParticipantCount(data.participants);
      const joinMessage = {
        id: messages.length + 1,
        user: 'System',
        avatar: '🎉',
        message: `${data.username} joined the party!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, joinMessage]);
    });

    wsService.onMessage('user-left', (data) => {
      setParticipantCount(data.participants);
      const leaveMessage = {
        id: messages.length + 1,
        user: 'System',
        avatar: '👋',
        message: `${data.username} left the party.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, leaveMessage]);
    });

    wsService.onMessage('video', (data) => {
      // Handle video sync messages
      console.log('Video sync:', data);
      
      if (data.action === 'changeVideo') {
        setCurrentVideoId(data.payload.videoId);
        const videoMessage = {
          id: messages.length + 1,
          user: 'System',
          avatar: '🎬',
          message: `${data.username} changed the video to: ${data.payload.videoId}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, videoMessage]);
      } else if (data.action === 'play' || data.action === 'pause' || data.action === 'seek' || data.action === 'volume') {
        // Sync video state to non-host players
        if (playerRef.current && data.username !== username) {
          playerRef.current.handleVideoSync(data.action, data.payload);
        }
      }
    });

    wsService.onMessage('playlist', (data) => {
      if (data.action === 'update') {
        setPlaylist(data.playlist);
      }
    });
  }, [wsService, messages.length, username]);

  const handleSendMessage = (message: string) => {
    if (message.startsWith('/')) {
      const cmd = message.trim().toLowerCase();
      if (cmd === '/help') {
        addSystemMessage(setMessages, `Available commands:\n/help — Show this help\n/info — Show room and video info\n/vote-skip — Start a vote to skip the current video\n/add [YouTube URL or ID] — Add a video to the playlist`);
      } else if (cmd === '/info') {
        addSystemMessage(setMessages, `Room: ${roomId}\nParticipants: ${participantCount}\nCurrent video: ${currentVideoId || 'None'}\nPlaylist length: ${playlist.length}`);
      } else if (cmd === '/vote-skip') {
        wsService.send({ type: 'vote-skip' });
        addSystemMessage(setMessages, 'You started a vote to skip the current video.');
      } else if (cmd.startsWith('/add ')) {
        const input = message.slice(5).trim();
        const videoId = extractVideoId(input);
        if (videoId) {
          wsService.send({ type: 'playlist', action: 'add', payload: { videoId, title: videoId } });
          addSystemMessage(setMessages, `Added video to playlist: ${videoId}`);
        } else {
          addSystemMessage(setMessages, 'Invalid YouTube URL or video ID.');
        }
      } else {
        addSystemMessage(setMessages, `Unknown command: ${cmd}`);
      }
      return;
    }
    wsService.sendChatMessage(message);
  };

  const handleVideoAction = (action: string, payload: any) => {
    wsService.sendVideoAction(action, payload);
  };

  const handleVideoChange = (videoId: string) => {
    setCurrentVideoId(videoId);
    wsService.sendVideoAction('changeVideo', { videoId });
  };

  const handleInvite = () => {
    const inviteUrl = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    alert('Invite link copied to clipboard!');
  };

  const handleRemoveFromPlaylist = (index: number) => {
    wsService.send({ type: 'playlist', action: 'remove', payload: { index } });
  };

  const handleReorderPlaylist = (sourceIndex: number, destIndex: number) => {
    wsService.send({ type: 'playlist', action: 'reorder', payload: { sourceIndex, destinationIndex: destIndex } });
  };

  return (
    <Container>
      <MainContentWrapper sidebarOpen={showPlaylist}>
        <Header>
          <HeaderLeft>
            <BackButton onClick={onLeave}>
              <IoArrowBack />
            </BackButton>
            <PartyName>Room: {roomId}</PartyName>
          </HeaderLeft>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <InviteButton onClick={handleInvite}>
              <IoShareOutline />
              Invite
            </InviteButton>
            <PlaylistButton onClick={() => setShowPlaylist(true)}>
              <IoList />
              Playlist
            </PlaylistButton>
          </div>
        </Header>
        
        <MainContent>
          <SplitContainer>
            <Split
              direction="vertical"
              sizes={[70, 30]} // default: 70% video, 30% chat
              minSize={100}
              gutterSize={8}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <VideoSection>
                <VideoInput 
                  onVideoChange={handleVideoChange}
                  currentVideoId={currentVideoId}
                />
                <YouTubePlayer 
                  ref={playerRef}
                  videoId={currentVideoId}
                  onVideoAction={handleVideoAction}
                  isHost={isHost}
                />
              </VideoSection>
              <ChatSection>
                <ChatArea 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  participantCount={participantCount}
                />
              </ChatSection>
            </Split>
          </SplitContainer>
        </MainContent>
      </MainContentWrapper>
      {showPlaylist && (
        <PlaylistSidebar
          playlist={playlist}
          username={username}
          onClose={() => setShowPlaylist(false)}
          onRemove={handleRemoveFromPlaylist}
          onReorder={handleReorderPlaylist}
        />
      )}
    </Container>
  );
};

export default WatchParty; 