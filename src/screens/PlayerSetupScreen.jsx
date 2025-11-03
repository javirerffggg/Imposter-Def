import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Input from '../components/Input';
import PlayerAvatar from '../components/PlayerAvatar';
import Modal from '../components/Modal';
import { generateId, validatePlayerName } from '../utils/helpers';
import audioManager from '../utils/audioManager';
import hapticsManager from '../utils/haptics';

const PlayerSetupScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const handleAddPlayer = () => {
    const validation = validatePlayerName(playerName);
    
    if (!validation.valid) {
      setError(validation.error);
      audioManager.playError();
      hapticsManager.error();
      return;
    }

    // Verificar si ya existe
    const exists = state.players.some(
      p => p.name.toLowerCase() === playerName.trim().toLowerCase()
    );

    if (exists) {
      setError('Ya existe un jugador con ese nombre');
      audioManager.playError();
      hapticsManager.error();
      return;
    }

    if (state.players.length >= 12) {
      setError('Máximo 12 jugadores');
      audioManager.playError();
      hapticsManager.error();
      return;
    }

    const newPlayer = {
      id: generateId(),
      name: playerName.trim(),
      createdAt: Date.now(),
      stats: {
        partidasJugadas: 0,
        vecesImpostor: 0
      }
    };

    dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
    setPlayerName('');
    setError('');
    audioManager.playSuccess();
    hapticsManager.success();
  };

  const handleRemovePlayer = (playerId) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: playerId });
    setShowDeleteModal(null);
    audioManager.playClick();
    hapticsManager.medium();
  };

  const handleContinue = () => {
    if (state.players.length < 3) {
      setError('Se necesitan al menos 3 jugadores');
      audioManager.playError();
      hapticsManager.error();
      return;
    }

    navigate('/categories');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate('/')}
          >
            ← Atrás
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate('/settings')}
          >
            ⚙️ Ajustes
          </Button>
        </div>
        <h1 className="title-large text-center">Jugadores</h1>
        <p className="text-center text-white/60 mt-2">
          {state.players.length}/12 jugadores • Mínimo 3
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Input para añadir jugador */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del jugador"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              onEnter={handleAddPlayer}
              maxLength={20}
              autoFocus
            />
            <Button
              variant="primary"
              onClick={handleAddPlayer}
              disabled={!playerName.trim()}
            >
              Añadir
            </Button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 animate-fadeIn">{error}</p>
          )}
        </div>

        {/* Lista de jugadores */}
        {state.players.length === 0 ? (
          <div className="text-center text-white/40 py-12">
            <div className="text-6xl mb-4">👥</div>
            <p>Añade jugadores para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {state.players.map((player, index) => (
              <div
                key={player.id}
                className="glass-card p-4 text-center relative group animate-fadeIn"
              >
                <button
                  onClick={() => setShowDeleteModal(player)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 rounded-full 
                           text-white text-sm opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200 hover:bg-red-500"
                >
                  ×
                </button>
                
                <PlayerAvatar player={player} index={index} size="medium" showName={false} />
                
                <h3 className="mt-3 font-semibold truncate">{player.name}</h3>
                
                {player.stats.partidasJugadas > 0 && (
                  <p className="text-xs text-white/50 mt-1">
                    {player.stats.partidasJugadas} {player.stats.partidasJugadas === 1 ? 'partida' : 'partidas'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con botón continuar */}
      <div className="p-6 border-t border-white/10">
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={handleContinue}
          disabled={state.players.length < 3}
          className="max-w-md mx-auto"
        >
          Continuar →
        </Button>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Eliminar Jugador"
      >
        <div className="text-center">
          <p className="text-white/80 mb-6">
            ¿Estás seguro de que quieres eliminar a <strong>{showDeleteModal?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowDeleteModal(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => handleRemovePlayer(showDeleteModal.id)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlayerSetupScreen;
