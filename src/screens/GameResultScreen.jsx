import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import PlayerAvatar from '../components/PlayerAvatar';
import Card from '../components/Card';

const GameResultScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  if (!state.game.word) {
    navigate('/categories');
    return null;
  }

  const impostors = state.players.filter(p => state.game.impostorIds.includes(p.id));
  const civils = state.players.filter(p => !state.game.impostorIds.includes(p.id));
  const detective = state.game.detectiveId 
    ? state.players.find(p => p.id === state.game.detectiveId)
    : null;
  const isAllImpostors = state.game.impostorIds.length === state.players.length;

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/categories');
  };

  const handleBackToMenu = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/setup');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h1 className="title-large text-center">🎭 Revelación Final</h1>
        <p className="text-center text-white/60 mt-2">¿Quién era el impostor?</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* La palabra */}
          <Card glass className="text-center animate-scaleIn">
            <h2 className="text-lg font-semibold mb-3">📖 La palabra era:</h2>
            <div className="bg-white/10 px-8 py-6 rounded-xl inline-block">
              <p className="text-4xl font-bold text-blue-400">{state.game.word}</p>
            </div>
            <p className="text-white/60 text-sm mt-3 capitalize">
              Categoría: {state.game.category}
            </p>
          </Card>

          {/* Modo Troll activado */}
          {isAllImpostors && (
            <Card glass className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 animate-fadeIn">
              <div className="text-center">
                <div className="text-5xl mb-3">⚠️</div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                  ¡MODO TROLL ACTIVADO!
                </h2>
                <p className="text-yellow-400/90">
                  Todos los jugadores eran impostores 🎭
                </p>
              </div>
            </Card>
          )}

          {/* Los Impostores */}
          <Card glass className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎭</span>
              <h2 className="text-xl font-bold text-red-400">
                {impostors.length === 1 ? 'El Impostor' : 'Los Impostores'}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {impostors.map((impostor) => {
                const index = state.players.findIndex(p => p.id === impostor.id);
                return (
                  <div 
                    key={impostor.id}
                    className="bg-red-500/20 p-4 rounded-xl border-2 border-red-500/50 text-center"
                  >
                    <PlayerAvatar
                      player={impostor}
                      index={index}
                      size="medium"
                      showName={false}
                    />
                    <h3 className="font-semibold mt-3 text-red-400">{impostor.name}</h3>
                    <p className="text-xs text-red-300 mt-1">Impostor</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* El Detective (si existe) */}
          {detective && (
            <Card glass className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🕵️</span>
                <h2 className="text-xl font-bold text-blue-400">El Detective</h2>
              </div>
              
              <div className="bg-blue-500/20 p-4 rounded-xl border-2 border-blue-500/50 text-center inline-block">
                <PlayerAvatar
                  player={detective}
                  index={state.players.findIndex(p => p.id === detective.id)}
                  size="medium"
                  showName={false}
                />
                <h3 className="font-semibold mt-3 text-blue-400">{detective.name}</h3>
                <p className="text-xs text-blue-300 mt-1">Detective</p>
              </div>
            </Card>
          )}

          {/* Los Civiles */}
          {!isAllImpostors && civils.length > 0 && (
            <Card glass className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👥</span>
                <h2 className="text-xl font-bold text-green-400">Los Civiles</h2>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {civils.map((civil) => {
                  const index = state.players.findIndex(p => p.id === civil.id);
                  const isDetectivePlayer = detective && detective.id === civil.id;
                  
                  return (
                    <div 
                      key={civil.id}
                      className={`
                        p-3 rounded-xl text-center border-2
                        ${isDetectivePlayer 
                          ? 'bg-blue-500/10 border-blue-500/30' 
                          : 'bg-green-500/10 border-green-500/30'
                        }
                      `}
                    >
                      <PlayerAvatar
                        player={civil}
                        index={index}
                        size="small"
                        showName={false}
                      />
                      <h3 className="font-medium mt-2 text-sm truncate text-green-300">
                        {civil.name}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* Footer con botones */}
      <div className="p-6 border-t border-white/10">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleBackToMenu}
          >
            ← Menú
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handlePlayAgain}
          >
            🎮 Nueva Partida
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameResultScreen;
