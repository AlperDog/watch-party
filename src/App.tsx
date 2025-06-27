import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WatchParty from './components/WatchParty';
import RoomJoin from './components/RoomJoin';
import { wsService } from './services/websocket';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
`;

interface RoomState {
  roomId: string;
  username: string;
  isConnected: boolean;
}

function App() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    wsService.connect().catch(console.error);

    return () => {
      wsService.disconnect();
    };
  }, []);

  const handleJoinRoom = async (roomId: string, username: string) => {
    setIsConnecting(true);
    
    try {
      // Wait for WebSocket connection if not already connected
      if (!wsService.isConnected()) {
        await wsService.connect();
      }

      // Join the room
      wsService.joinRoom(roomId, username);
      
      setRoomState({
        roomId,
        username,
        isConnected: true
      });
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveRoom = () => {
    wsService.disconnect();
    setRoomState(null);
  };

  if (!roomState) {
    return <RoomJoin onJoin={handleJoinRoom} />;
  }

  return (
    <AppContainer>
      <WatchParty 
        roomId={roomState.roomId}
        username={roomState.username}
        onLeave={handleLeaveRoom}
        wsService={wsService}
      />
    </AppContainer>
  );
}

export default App; 