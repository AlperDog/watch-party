import React from 'react';
import styled from 'styled-components';
import WatchParty from './components/WatchParty';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <AppContainer>
      <WatchParty />
    </AppContainer>
  );
}

export default App; 