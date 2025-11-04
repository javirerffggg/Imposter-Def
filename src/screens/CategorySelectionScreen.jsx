import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import audioManager from '../utils/audioManager';
import hapticsManager from '../utils/haptics';

const CategorySelectionScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const categories = {
  // Originales
  animales: '🦁',
  profesiones: '👨‍⚕️',
  países: '🌍',
  comida: '🍕',
  deportes: '⚽',
  películas: '🎬',
  música: '🎵',
  tecnología: '💻',
  objetos: '🔑',
  lugares: '🏛️',
  ciencia: '🔬',
  
  // Nuevas (45 categorías)
  instrumentos: '🎸',
  colores: '🎨',
  emociones: '😊',
  vehículos: '🚗',
  flores: '🌸',
  frutas: '🍎',
  verduras: '🥦',
  postres: '🍰',
  bebidas: '☕',
  ropa: '👕',
  muebles: '🛋️',
  electrodomésticos: '🧊',
  herramientas: '🔨',
  superhéroes: '🦸',
  villanos: '🦹',
  personajes_disney: '🏰',
  anime: '⛩️',
  manga: '📖',
  libros: '📚',
  escritores: '✍️',
  pintores: '🖼️',
  escultores: '🗿',
  monumentos: '🗼',
  ciudades: '🏙️',
  ríos: '🌊',
  montañas: '⛰️',
  planetas: '🪐',
  constelaciones: '✨',
  elementos_químicos: '⚗️',
  partes_del_cuerpo: '🫀',
  enfermedades: '🏥',
  medicamentos: '💊',
  idiomas: '🗣️',
  monedas: '💰',
  oficios_antiguos: '🏺',
  mitología: '⚡',
  religiones: '🕉️',
  festividades: '🎉',
  juegos_de_mesa: '🎲',
  cartas: '🃏',
  aplicaciones: '📱',
  redes_sociales: '💬',
  programación: '👨‍💻',
  empresas_tech: '🖥️',
  youtubers: '📹',
  streamers: '🎥',
  memes: '😂'
  famosos_españoles: '🇪🇸'
};


  useEffect(() => {
    // Si no hay jugadores, volver a setup
    if (state.players.length < 3) {
      navigate('/setup');
    }
  }, [state.players.length, navigate]);

  const handleToggleCategory = (category) => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: category });
    audioManager.playClick();
    hapticsManager.light();
  };

  const handleSelectAll = () => {
    dispatch({ type: 'SELECT_ALL_CATEGORIES' });
    audioManager.playSuccess();
    hapticsManager.medium();
  };

  const handleSelectRandom = () => {
    dispatch({ type: 'SELECT_RANDOM_CATEGORY' });
    audioManager.playSuccess();
    hapticsManager.medium();
  };

  const handleStartGame = () => {
    if (state.settings.selectedCategories.length === 0) {
      audioManager.playError();
      hapticsManager.error();
      return;
    }

    // Asignar roles y comenzar
    dispatch({ type: 'ASSIGN_ROLES' });
    navigate('/reveal');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigate('/setup')}
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
        <h1 className="title-large text-center">Categorías</h1>
        <p className="text-center text-white/60 mt-2">
          {state.settings.selectedCategories.length} {state.settings.selectedCategories.length === 1 ? 'seleccionada' : 'seleccionadas'}
        </p>
      </div>

      {/* Botones de selección rápida */}
      <div className="p-6 flex gap-3">
        <Button
          variant="ghost"
          size="small"
          fullWidth
          onClick={handleSelectAll}
        >
          Seleccionar Todas
        </Button>
        <Button
          variant="ghost"
          size="small"
          fullWidth
          onClick={handleSelectRandom}
        >
          🎲 Aleatoria
        </Button>
      </div>

      {/* Grid de categorías */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {Object.entries(categories).map(([category, icon]) => (
            <CategoryCard
              key={category}
              category={category}
              icon={icon}
              selected={state.settings.selectedCategories.includes(category)}
              onClick={() => handleToggleCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10">
        <Button
          variant="success"
          size="large"
          fullWidth
          onClick={handleStartGame}
          disabled={state.settings.selectedCategories.length === 0}
          className="max-w-md mx-auto"
        >
          🎮 Iniciar Partida
        </Button>
      </div>
    </div>
  );
};

export default CategorySelectionScreen;
