import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import Card from '../components/Card';
import audioManager from '../utils/audioManager';
import hapticsManager from '../utils/haptics';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
    
    // Aplicar cambios inmediatos
    if (key === 'soundEnabled') {
      audioManager.setEnabled(value);
    }
    if (key === 'hapticsEnabled') {
      hapticsManager.setEnabled(value);
    }
  };

  const updateMode = (mode, value) => {
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      payload: { 
        activeModes: { 
          ...state.settings.activeModes, 
          [mode]: value 
        } 
      } 
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <Button
          variant="ghost"
          size="small"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Atrás
        </Button>
        <h1 className="title-large text-center">Ajustes</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Configuración de Juego */}
          <Card glass>
            <h2 className="title-small mb-4">⚙️ Configuración de Juego</h2>
            
            <div className="space-y-4">
              {/* Número de impostores */}
              <div>
                <label className="block text-white/90 mb-2 font-medium">
                  Número de Impostores
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => updateSetting('impostors', num)}
                      className={`
                        flex-1 py-3 rounded-lg font-semibold transition-all
                        ${state.settings.impostors === num
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }
                      `}
                      disabled={state.players.length < num + 2}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Requiere al menos {state.settings.impostors + 2} jugadores
                </p>
              </div>

              {/* Dificultad */}
              <div>
                <label className="block text-white/90 mb-2 font-medium">
                  Dificultad
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['easy', 'medium', 'hard', 'random'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => updateSetting('difficulty', diff)}
                      className={`
                        py-3 rounded-lg font-semibold transition-all capitalize
                        ${state.settings.difficulty === diff
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }
                      `}
                    >
                      {diff === 'easy' && '😊'}
                      {diff === 'medium' && '😐'}
                      {diff === 'hard' && '😰'}
                      {diff === 'random' && '🎲'}
                      <div className="text-xs mt-1">
                        {diff === 'easy' && 'Fácil'}
                        {diff === 'medium' && 'Media'}
                        {diff === 'hard' && 'Difícil'}
                        {diff === 'random' && 'Aleatoria'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Modos de Juego */}
          <Card glass>
            <h2 className="title-small mb-4">🎮 Modos de Juego</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <Toggle
                  checked={state.settings.activeModes.detective}
                  onChange={(value) => updateMode('detective', value)}
                  label="🕵️ Modo Detective"
                  disabled={state.players.length < 4}
                />
                <p className="text-xs text-white/50 mt-2">
                  Un civil conoce la palabra y puede ayudar. Requiere al menos 4 jugadores.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <Toggle
                  checked={state.settings.activeModes.troll}
                  onChange={(value) => updateMode('troll', value)}
                  label="🎭 Modo Troll"
                />
                <p className="text-xs text-white/50 mt-2">
                  15% de probabilidad de que todos sean impostores.
                </p>
              </div>
            </div>
          </Card>

          {/* Accesibilidad */}
          <Card glass>
            <h2 className="title-small mb-4">♿ Accesibilidad</h2>
            
            <div className="space-y-4">
              <Toggle
                checked={state.settings.soundEnabled}
                onChange={(value) => updateSetting('soundEnabled', value)}
                label="🔊 Sonido"
              />
              
              <Toggle
                checked={state.settings.hapticsEnabled}
                onChange={(value) => updateSetting('hapticsEnabled', value)}
                label="📳 Vibración"
              />
              
              <Toggle
                checked={state.settings.colorblindMode}
                onChange={(value) => updateSetting('colorblindMode', value)}
                label="👁️ Modo Daltónico"
              />
              
              <Toggle
                checked={state.settings.batterySaverMode}
                onChange={(value) => updateSetting('batterySaverMode', value)}
                label="🔋 Ahorro de Batería"
              />
            </div>
          </Card>

          {/* Datos */}
          <Card glass>
            <h2 className="title-small mb-4">💾 Datos</h2>
            
            <div className="space-y-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                🗑️ Borrar Todos los Datos
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
