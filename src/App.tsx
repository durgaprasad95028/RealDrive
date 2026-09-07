import React from 'react';
import { GameProvider } from './context/GameContext';
import { AppRoutes } from './app/routes/AppRoutes';

export function App() {
  return (
    <GameProvider>
      <AppRoutes />
    </GameProvider>
  );
}

export default App;
