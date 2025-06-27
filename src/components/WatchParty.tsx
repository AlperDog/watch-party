import React, { useState } from 'react';
import styled from 'styled-components';
import { IoArrowBack, IoShareOutline } from 'react-icons/io5';
import VideoPlayer from './VideoPlayer';
import ChatArea from './ChatArea';

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

const WatchParty: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Alex',
      avatar: '👤',
      message: 'Hello everyone! This movie is great!',
      timestamp: new Date()
    },
    {
      id: 2,
      user: 'Sarah',
      avatar: '👤',
      message: 'Agreed! What\'s your favorite part so far?',
      timestamp: new Date()
    },
    {
      id: 3,
      user: 'Mike',
      avatar: '👤',
      message: 'Haha, the scene with the cat! 🤣',
      timestamp: new Date()
    },
    {
      id: 4,
      user: 'Alex',
      avatar: '👤',
      message: 'Mine too! 🐱',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      avatar: '👤',
      message,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
  };

  const handleInvite = () => {
    // In a real app, this would open a share sheet
    navigator.clipboard.writeText('https://watchparty.app/join/abc123');
    alert('Invite link copied to clipboard!');
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton>
            <IoArrowBack />
          </BackButton>
          <PartyName>Friday Movie Night</PartyName>
        </HeaderLeft>
        <InviteButton onClick={handleInvite}>
          <IoShareOutline />
          Invite
        </InviteButton>
      </Header>
      
      <MainContent>
        <VideoSection>
          <VideoPlayer />
        </VideoSection>
        
        <ChatSection>
          <ChatArea 
            messages={messages}
            onSendMessage={handleSendMessage}
            participantCount={5}
          />
        </ChatSection>
      </MainContent>
    </Container>
  );
};

export default WatchParty; 