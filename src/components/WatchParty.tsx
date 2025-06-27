import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoArrowBack, IoShareOutline } from 'react-icons/io5';
import VideoPlayer from './VideoPlayer';
import ChatArea from './ChatArea';
import { WebSocketService } from '../services/websocket';

interface WatchPartyProps {
  roomId: string;
  username: string;
  onLeave: () => void;
  wsService: WebSocketService;
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
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

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const VideoSection = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;

const ChatSection = styled.div`
  height: 300px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
`;

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

const WatchParty: React.FC<WatchPartyProps> = ({ roomId, username, onLeave, wsService }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participantCount, setParticipantCount] = useState(1);

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
    });
  }, [wsService, messages.length]);

  const handleSendMessage = (message: string) => {
    wsService.sendChatMessage(message);
  };

  const handleVideoAction = (action: string, payload: any) => {
    wsService.sendVideoAction(action, payload);
  };

  const handleInvite = () => {
    const inviteUrl = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    alert('Invite link copied to clipboard!');
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={onLeave}>
            <IoArrowBack />
          </BackButton>
          <PartyName>Room: {roomId}</PartyName>
        </HeaderLeft>
        <InviteButton onClick={handleInvite}>
          <IoShareOutline />
          Invite
        </InviteButton>
      </Header>
      
      <MainContent>
        <VideoSection>
          <VideoPlayer onVideoAction={handleVideoAction} />
        </VideoSection>
        
        <ChatSection>
          <ChatArea 
            messages={messages}
            onSendMessage={handleSendMessage}
            participantCount={participantCount}
          />
        </ChatSection>
      </MainContent>
    </Container>
  );
};

export default WatchParty; 