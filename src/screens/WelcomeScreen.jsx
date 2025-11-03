import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Si no es la primera visita y hay jugadores, ir directo a setup
    if (!state.firstVisit && state.players.length > 0) {
      navigate('/setup');
    }
  }, [state.firstVisit, state.players.length, navigate]);

  const handleStart = () => {
    dispatch({ type: 'SET_FIRST_VISIT' });
    navigate('/setup');
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Logo animado */}
      <div className="mb-12 animate-scaleIn">
        <div className="relative">
          <h1 className="title-huge text-center text-gradient mb-4">
            Imposter Who?
          </h1>
          <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full -z-10" />
        </div>
        <p className="text-center text-white/60 text-lg max-w-md mx-auto">
          El juego de deducción social más rápido y elegante
        </p>
      </div>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 w-full max-w-4xl">
        <div className="glass-card p-6 text-center animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="text-4xl mb-2">👥</div>
          <h3 className="text-lg font-semibold mb-2">3-12 Jugadores</h3>
          <p className="text-white/60 text-sm">Multijugador local en un solo dispositivo</p>
        </div>
        
        <div className="glass-card p-6 text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="text-4xl mb-2">⚡</div>
          <h3 className="text-lg font-semibold mb-2">Rápido y Fluido</h3>
          <p className="text-white/60 text-sm">Partidas de 5-15 minutos</p>
        </div>
        
        <div className="glass-card p-6 text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="text-4xl mb-2">🎭</div>
          <h3 className="text-lg font-semibold mb-2">Miles de Palabras</h3>
          <p className="text-white/60 text-sm">10 categorías con 3 niveles de dificultad</p>
        </div>
      </div>

      {/* Botón principal */}
      <div className="w-full max-w-md animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleStart}
        >
          Comenzar Juego
        </Button>

        {state.players.length > 0 && (
          <Button
            variant="ghost"
            size="medium"
            fullWidth
            onClick={() => navigate('/stats')}
            className="mt-4"
          >
            Ver Estadísticas
          </Button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-white/40 text-sm">
        <p>Versión 3.0 • PWA Offline</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
