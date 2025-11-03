import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import PlayerSetupScreen from './screens/PlayerSetupScreen';
import CategorySelectionScreen from './screens/CategorySelectionScreen';
import SettingsScreen from './screens/SettingsScreen';
import RoleRevealScreen from './screens/RoleRevealScreen';
import GameActiveScreen from './screens/GameActiveScreen';
import StatsScreen from './screens/StatsScreen';

// Inicializar managers
import audioManager from './utils/audioManager';
import hapticsManager from './utils/haptics';

function App() {
  useEffect(() => {
    // Inicializar audio
    audioManager.init();

    // Registrar service worker manualmente si es necesario
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('SW registration failed:', error);
      });
    }

    // Prevenir comportamiento por defecto en móviles
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('gesturestart', (e) => e.preventDefault());
      document.removeEventListener('gesturechange', (e) => e.preventDefault());
      document.removeEventListener('gestureend', (e) => e.preventDefault());
    };
  }, []);

  return (
    <AppProvider>
      <Router>
        <div className="h-full w-full overflow-hidden">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/setup" element={<PlayerSetupScreen />} />
            <Route path="/categories" element={<CategorySelectionScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/reveal" element={<RoleRevealScreen />} />
            <Route path="/game" element={<GameActiveScreen />} />
            <Route path="/stats" element={<StatsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
