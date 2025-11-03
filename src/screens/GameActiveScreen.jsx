import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import PlayerAvatar from '../components/PlayerAvatar';

const GameActiveScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [timer, setTimer] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);

  useEffect(() => {
    // Si no hay juego, volver
    if (!state.game.word) {
      navigate('/categories');
      return;
    }

    // Timer
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.game.word, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startingPlayer = state.players.find(p => p.id === state.game.startingPlayerId);

  const handleEndGame = () => {
    // En lugar de resetear, navegar a resultados
    navigate('/result');
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/categories');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Header con info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⏱️</div>
            <div>
              <div className="text-2xl font-bold font-mono">{formatTime(timer)}</div>
              <div className="text-xs text-white/50">Tiempo transcurrido</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">{state.players.length}</div>
            <div className="text-xs text-white/50">Jugadores</div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-white/50 mb-1">Categoría</div>
              <div className="font-semibold capitalize">{state.game.category}</div>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowWordModal(true)}
            >
              👁️ Ver Palabra
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Jugador inicial */}
          {startingPlayer && (
            <div className="glass-card p-6 mb-6 text-center animate-fadeIn">
              <h3 className="text-lg font-semibold mb-4">🎲 Empieza la ronda</h3>
              <PlayerAvatar 
                player={startingPlayer} 
                index={state.players.findIndex(p => p.id === startingPlayer.id)}
                size="large"
                showName={true}
              />
              <p className="text-white/60 text-sm mt-4">
                {startingPlayer.name} hace la primera pregunta
              </p>
            </div>
          )}

          {/* Información del juego */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">👥</span>
                <h3 className="font-semibold">Civiles</h3>
              </div>
              <p className="text-white/70 text-sm">
                Conocen la palabra. Deben descubrir al impostor haciendo preguntas.
              </p>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎭</span>
                <h3 className="font-semibold">
                  {state.game.impostorIds.length === 1 ? 'Impostor' : 'Impostores'}
                </h3>
              </div>
              <p className="text-white/70 text-sm">
                {state.game.impostorIds.length === state.players.length
                  ? '⚠️ TODOS son impostores (Modo Troll)'
                  : `No conocen la palabra. Deben pasar desapercibidos. (${state.game.impostorIds.length})`
                }
              </p>
            </div>

            {state.game.detectiveId && (
              <div className="glass-card p-4 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🕵️</span>
                  <h3 className="font-semibold">Detective</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Un civil conoce la palabra y puede ayudar revelando pistas.
                </p>
              </div>
            )}
          </div>

          {/* Reglas */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">📋 Reglas del Juego</h3>
            <ol className="space-y-2 text-white/80 text-sm list-decimal list-inside">
              <li>Cada jugador hace una pregunta por turno</li>
              <li>Las preguntas deben ser sobre la palabra (sin mencionarla)</li>
              <li>Los civiles intentan identificar al impostor</li>
              <li>El impostor intenta adivinar la palabra o pasar desapercibido</li>
              <li>Después de las rondas, se vota quién es el impostor</li>
              <li>Si aciertan, ganan los civiles. Si fallan, gana el impostor</li>
            </ol>
          </div>

          {/* Todos los jugadores */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Jugadores en Partida</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {state.players.map((player, index) => (
                <div key={player.id} className="animate-fadeIn">
                  <PlayerAvatar 
                    player={player} 
                    index={index} 
                    size="medium"
                    showName={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="p-6 border-t border-white/10">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowEndModal(true)}
          >
            Terminar Juego
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handlePlayAgain}
          >
            Nueva Partida
          </Button>
        </div>
      </div>

      {/* Modal ver palabra */}
      <Modal
        isOpen={showWordModal}
        onClose={() => setShowWordModal(false)}
        title="🔐 Palabra Secreta"
      >
        <div className="text-center py-6">
          <div className="bg-white/10 px-8 py-6 rounded-lg mb-4">
            <p className="text-4xl font-bold mb-2">{state.game.word}</p>
            <p className="text-white/60 text-sm capitalize">
              Categoría: {state.game.category}
            </p>
          </div>
          <p className="text-white/60 text-sm">
            ⚠️ No muestres esto a los jugadores durante la partida
          </p>
        </div>
      </Modal>

        {/* Modal terminar juego */}
        <Modal
          isOpen={showEndModal}
          onClose={() => setShowEndModal(false)}
          title="Terminar Ronda"
        >
          <div className="text-center">
            <p className="text-white/80 mb-6">
              ¿Terminar la ronda y revelar quiénes eran los impostores?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowEndModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="success"
                fullWidth
                onClick={handleEndGame}
              >
                Ver Resultados
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default GameActiveScreen;
