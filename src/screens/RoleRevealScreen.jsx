import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import audioManager from '../utils/audioManager';
import hapticsManager from '../utils/haptics';

const RoleRevealScreen = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    // Si no hay juego iniciado, volver
    if (!state.game.word) {
      navigate('/categories');
    }
  }, [state.game.word, navigate]);

  const currentPlayer = state.players[currentIndex];
  const isImpostor = state.game.impostorIds.includes(currentPlayer?.id);
  const isDetective = state.game.detectiveId === currentPlayer?.id;
  const isAllImpostors = state.game.impostorIds.length === state.players.length;

  const handleFlip = () => {
    if (isFlipped) return;
    
    setIsFlipped(true);
    audioManager.playCardFlip();
    hapticsManager.medium();
    
    setTimeout(() => {
      setShowRole(true);
      audioManager.playReveal();
      hapticsManager.heavy();
    }, 300);
  };

  const handleNext = () => {
    if (currentIndex < state.players.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowRole(false);
      audioManager.playClick();
      hapticsManager.light();
    } else {
      // Todos han visto su rol
      navigate('/game');
    }
  };

  if (!currentPlayer) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Progreso */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between text-sm text-white/60 mb-2">
          <span>Jugador {currentIndex + 1} de {state.players.length}</span>
          <span>{Math.round((currentIndex / state.players.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / state.players.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Avatar del jugador actual */}
      <div className="mb-8 animate-scaleIn">
        <PlayerAvatar 
          player={currentPlayer} 
          index={currentIndex} 
          size="large" 
          showName={true}
        />
      </div>

      {/* Carta de rol - MEJORADA CON FONDO MÁS OSCURO */}
      <div className="mb-8 perspective-1000">
        <div 
          className={`
            relative w-80 h-96 cursor-pointer transition-all duration-500
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
          }}
          onClick={handleFlip}
        >
          {/* Parte delantera */}
          <div 
            className="absolute inset-0 glass-card flex flex-col items-center justify-center"
            style={{ 
              backfaceVisibility: 'hidden',
              backgroundColor: 'rgba(28, 28, 30, 0.95)' // Fondo más sólido
            }}
          >
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="title-medium text-center mb-2">Tu Rol</h2>
            <p className="text-white/60 text-center">Toca para revelar</p>
          </div>

          {/* Parte trasera - FONDO MÁS OSCURO Y OPACO */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-3xl border border-white/20"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              backgroundColor: 'rgba(15, 15, 17, 0.98)', // Fondo casi negro y muy opaco
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)'
            }}
          >
            {showRole && (
              <div className="animate-fadeIn text-center">
                {/* Rol */}
                <div className={`
                  text-6xl mb-4 p-4 rounded-full inline-block
                  ${isImpostor ? 'bg-red-500/30' : isDetective ? 'bg-blue-500/30' : 'bg-green-500/30'}
                `}>
                  {isImpostor ? '🎭' : isDetective ? '🕵️' : '👤'}
                </div>
                
                <h2 className={`
                  title-large mb-4 font-bold
                  ${isImpostor ? 'text-red-400' : isDetective ? 'text-blue-400' : 'text-green-400'}
                `}>
                  {isImpostor ? 'IMPOSTOR' : isDetective ? 'DETECTIVE' : 'CIVIL'}
                </h2>

                {/* Palabra o información */}
                {isImpostor && !isAllImpostors ? (
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <p className="text-white/90 mb-2 font-semibold">No conoces la palabra</p>
                <p className="text-sm text-white/70">
                  Debes descubrir la palabra sin revelar tu identidad
                </p>
              </div>
              ) : (
              // ... resto del código
                  <div>
                    <p className="text-white/70 text-sm mb-2 font-medium">
                      {isDetective ? 'Conoces la palabra y puedes ayudar' : 'La palabra es:'}
                    </p>
                    <div className="bg-black/50 px-6 py-4 rounded-xl border-2 border-white/20">
                      <p className="text-3xl font-bold text-white">{state.game.word}</p>
                    </div>
                    <p className="text-sm text-white/60 mt-3">
                      Categoría: <span className="capitalize font-semibold">{state.game.category}</span>
                    </p>
                  </div>
                )}

                {isAllImpostors && (
                  <div className="mt-4 p-3 bg-yellow-500/30 rounded-xl border border-yellow-500/50">
                    <p className="text-yellow-400 text-sm font-bold">
                      ⚠️ ¡MODO TROLL ACTIVADO!
                    </p>
                    <p className="text-yellow-400/90 text-xs mt-1">
                      Todos sois impostores
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      {!isFlipped && (
        <p className="text-white/60 text-center max-w-md mb-8 animate-pulse">
          👆 {currentPlayer.name}, toca la carta para ver tu rol
        </p>
      )}

      {/* Botón siguiente */}
      {showRole && (
        <div className="w-full max-w-md animate-fadeIn">
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={handleNext}
          >
            {currentIndex < state.players.length - 1 
              ? `Siguiente Jugador →` 
              : '🎮 Comenzar Juego'
            }
          </Button>
        </div>
      )}

      {/* Advertencia */}
      {showRole && (
        <p className="text-white/40 text-xs text-center max-w-md mt-4">
          ⚠️ Asegúrate de que solo {currentPlayer.name} vea esta pantalla
        </p>
      )}
    </div>
  );
};

export default RoleRevealScreen;
