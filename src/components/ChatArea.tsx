import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoHappyOutline, IoSend } from 'react-icons/io5';

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  participantCount: number;
}

const ChatContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
`;

const ChatHeader = styled.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatTitle = styled.h3`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

const ParticipantCount = styled.span`
  color: #888;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const MessageItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const Username = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const Timestamp = styled.span`
  color: #888;
  font-size: 12px;
`;

const MessageText = styled.p`
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const MessageInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    border-color: #667eea;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.send {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage, participantCount }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>Chat</ChatTitle>
        <ParticipantCount>Participants: {participantCount}</ParticipantCount>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((message) => (
          <MessageItem key={message.id}>
            <Avatar>{message.avatar}</Avatar>
            <MessageContent>
              <MessageHeader>
                <Username>{message.user}</Username>
                <Timestamp>{formatTime(message.timestamp)}</Timestamp>
              </MessageHeader>
              <MessageText>{message.message}</MessageText>
            </MessageContent>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <ActionButton>
          <IoHappyOutline />
        </ActionButton>
        
        <InputWrapper>
          <MessageInput
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputWrapper>
        
        <ActionButton 
          className="send"
          onClick={handleSend}
          disabled={!inputValue.trim()}
        >
          <IoSend />
        </ActionButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatArea; 