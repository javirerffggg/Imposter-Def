import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import PlayerAvatar from '../components/PlayerAvatar';
import Modal from '../components/Modal';
import { calculateStats, exportStats } from '../utils/helpers';

const StatsScreen = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const stats = calculateStats(state.players);

  if (state.players.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="title-large mb-4">Sin Estadísticas</h2>
          <p className="text-white/60 mb-8">
            Aún no hay jugadores registrados
          </p>
          <Button variant="primary" onClick={() => navigate('/setup')}>
            Añadir Jugadores
          </Button>
        </div>
      </div>
    );
  }

  const topPlayers = [...state.players]
    .sort((a, b) => b.stats.partidasJugadas - a.stats.partidasJugadas)
    .slice(0, 5);

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <Button
          variant="ghost"
          size="small"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          ← Inicio
        </Button>
        <h1 className="title-large text-center">📊 Estadísticas</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Estadísticas globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Partidas"
              value={stats.totalGames}
              icon="🎮"
              color="blue"
            />
            <StatCard
              label="Total Jugadores"
              value={state.players.length}
              icon="👥"
              color="green"
            />
            <StatCard
              label="Roles de Impostor"
              value={stats.totalImpostorRoles}
              icon="🎭"
              color="red"
            />
            <StatCard
              label="Media por Jugador"
              value={stats.averageGamesPerPlayer}
              icon="📈"
              color="purple"
            />
          </div>

          {/* Jugador más experimentado */}
          {stats.mostExperiencedPlayer && (
            <Card glass>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">🏆 Jugador más Experimentado</h3>
                  <p className="text-white/60 text-sm">
                    Con {stats.mostExperiencedPlayer.stats.partidasJugadas} partidas jugadas
                  </p>
                </div>
                <PlayerAvatar
                  player={stats.mostExperiencedPlayer}
                  index={state.players.findIndex(p => p.id === stats.mostExperiencedPlayer.id)}
                  size="large"
                  showName={true}
                />
              </div>
            </Card>
          )}

          {/* Top 5 jugadores */}
          <Card glass>
            <h3 className="text-lg font-semibold mb-4">🥇 Top Jugadores</h3>
            <div className="space-y-3">
              {topPlayers.map((player, index) => {
                const globalIndex = state.players.findIndex(p => p.id === player.id);
                const impostorRate = player.stats.partidasJugadas > 0
                  ? ((player.stats.vecesImpostor / player.stats.partidasJugadas) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                    key={player.id}
                    className="glass-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-white/40 w-8">
                        #{index + 1}
                      </div>
                      <PlayerAvatar
                        player={player}
                        index={globalIndex}
                        size="small"
                        showName={false}
                      />
                      <div>
                        <h4 className="font-semibold">{player.name}</h4>
                        <p className="text-xs text-white/60">
                          {player.stats.partidasJugadas} partidas • {player.stats.vecesImpostor} veces impostor
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-400">
                        {impostorRate}%
                      </div>
                      <div className="text-xs text-white/50">impostor</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Todos los jugadores */}
          <Card glass>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Todos los Jugadores</h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => exportStats(state.players)}
              >
                💾 Exportar
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.players.map((player, index) => {
                const impostorRate = player.stats.partidasJugadas > 0
                  ? ((player.stats.vecesImpostor / player.stats.partidasJugadas) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                    key={player.id}
                    className="glass-card p-4 text-center cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <PlayerAvatar
                      player={player}
                      index={index}
                      size="medium"
                      showName={false}
                    />
                    <h4 className="font-semibold mt-3 truncate">{player.name}</h4>
                    <div className="mt-2 space-y-1 text-xs text-white/60">
                      <div>🎮 {player.stats.partidasJugadas} partidas</div>
                      <div>🎭 {player.stats.vecesImpostor} impostores</div>
                      <div className="text-red-400 font-semibold">{impostorRate}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

        </div>
      </div>

      {/* Modal de detalle del jugador */}
      <Modal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        title="Estadísticas del Jugador"
      >
        {selectedPlayer && (
          <div className="text-center">
            <PlayerAvatar
              player={selectedPlayer}
              index={state.players.findIndex(p => p.id === selectedPlayer.id)}
              size="large"
              showName={false}
            />
            <h2 className="title-medium mt-4 mb-6">{selectedPlayer.name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">
                  {selectedPlayer.stats.partidasJugadas}
                </div>
                <div className="text-sm text-white/60 mt-1">Partidas Jugadas</div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-400">
                  {selectedPlayer.stats.vecesImpostor}
                </div>
                <div className="text-sm text-white/60 mt-1">Veces Impostor</div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg col-span-2">
                <div className="text-3xl font-bold text-purple-400">
                  {selectedPlayer.stats.partidasJugadas > 0
                    ? ((selectedPlayer.stats.vecesImpostor / selectedPlayer.stats.partidasJugadas) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-white/60 mt-1">Tasa de Impostor</div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">📅 Información</h4>
              <p className="text-sm text-white/60">
                Creado: {new Date(selectedPlayer.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StatsScreen;
