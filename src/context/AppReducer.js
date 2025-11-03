// Función auxiliar para obtener palabra offline
function getOfflineWord(difficulty, selectedCategories, usedWords, wordDatabase) {
  if (!selectedCategories || selectedCategories.length === 0) {
    return null;
  }

  // Seleccionar categoría aleatoria de las seleccionadas
  const category = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
  
  if (!wordDatabase[category]) {
    return null;
  }

  // Determinar dificultad real
  let actualDifficulty = difficulty;
  if (difficulty === 'random') {
    const difficulties = ['easy', 'medium', 'hard'];
    actualDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  }

  // Obtener palabras de esa categoría y dificultad
  const wordsInCategory = wordDatabase[category][actualDifficulty] || [];
  
  // Filtrar palabras no usadas
  const availableWords = wordsInCategory.filter(word => !usedWords.includes(word));
  
  // Si no hay palabras disponibles, resetear usedWords para esta categoría
  if (availableWords.length === 0) {
    return {
      word: wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)],
      category: category
    };
  }

  return {
    word: availableWords[Math.floor(Math.random() * availableWords.length)],
    category: category
  };
}

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const newPlayer = action.payload;
      
      // Verificar duplicados (insensible a mayúsculas)
      const isDuplicate = state.players.some(
        p => p.name.toLowerCase() === newPlayer.name.toLowerCase()
      );
      
      if (isDuplicate) {
        return state;
      }

      return {
        ...state,
        players: [...state.players, newPlayer]
      };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.payload)
      };

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'TOGGLE_CATEGORY': {
      const category = action.payload;
      const currentCategories = state.settings.selectedCategories || [];
      const isSelected = currentCategories.includes(category);

      return {
        ...state,
        settings: {
          ...state.settings,
          selectedCategories: isSelected
            ? currentCategories.filter(c => c !== category)
            : [...currentCategories, category]
        }
      };
    }

    case 'SELECT_ALL_CATEGORIES':
      return {
        ...state,
        settings: {
          ...state.settings,
          selectedCategories: Object.keys(state.wordDatabase)
        }
      };

    case 'SELECT_RANDOM_CATEGORY':
      const categories = Object.keys(state.wordDatabase);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      return {
        ...state,
        settings: {
          ...state.settings,
          selectedCategories: [randomCategory]
        }
      };

    case 'ASSIGN_ROLES': {
      const { players, settings, game, wordDatabase } = state;

      // Validación
      if (players.length < 3) return state;
      if (settings.activeModes.detective && players.length < 4) return state;
      if (!settings.selectedCategories || settings.selectedCategories.length === 0) return state;

      // Obtener palabra
      const wordData = getOfflineWord(
        settings.difficulty,
        settings.selectedCategories,
        state.usedWords,
        wordDatabase
      );

      if (!wordData || !wordData.word) {
        console.error('No se pudieron cargar palabras.');
        return state;
      }

      let impostorIds = [];
      let detectiveId = null;

      // Asignación justa
      let eligiblePlayers = players.filter(
        p => !game.lastImpostorIds.includes(p.id)
      );
      
      if (eligiblePlayers.length < settings.impostors) {
        eligiblePlayers = [...players];
      }

      // Modo Troll
      if (settings.activeModes.troll && Math.random() < 0.15) {
        impostorIds = players.map(p => p.id);
      } else {
        const shuffledEligible = [...eligiblePlayers].sort(() => 0.5 - Math.random());
        impostorIds = shuffledEligible.slice(0, settings.impostors).map(p => p.id);
      }

      // Modo Detective
      if (settings.activeModes.detective) {
        const eligibleCivilians = players.filter(p => !impostorIds.includes(p.id));
        if (eligibleCivilians.length > 0) {
          detectiveId = eligibleCivilians[Math.floor(Math.random() * eligibleCivilians.length)].id;
        }
      }

      // Seleccionar jugador inicial
      const startingPlayerId = players[Math.floor(Math.random() * players.length)].id;

      // Actualizar estadísticas
      const updatedPlayers = players.map(player => ({
        ...player,
        stats: {
          ...player.stats,
          partidasJugadas: player.stats.partidasJugadas + 1,
          vecesImpostor: impostorIds.includes(player.id)
            ? player.stats.vecesImpostor + 1
            : player.stats.vecesImpostor
        }
      }));

      return {
        ...state,
        players: updatedPlayers,
        game: {
          word: wordData.word,
          category: wordData.category,
          impostorIds: impostorIds,
          detectiveId: detectiveId,
          startingPlayerId: startingPlayerId,
          lastImpostorIds: [...impostorIds]
        },
        roleReveal: {
          currentPlayerIndex: 0,
          cardFlipped: false
        },
        usedWords: [...state.usedWords, wordData.word]
      };
    }

    case 'RESET_GAME':
      return {
        ...state,
        game: {
          word: null,
          category: null,
          impostorIds: [],
          detectiveId: null,
          startingPlayerId: null,
          lastImpostorIds: state.game.lastImpostorIds
        },
        roleReveal: {
          currentPlayerIndex: 0,
          cardFlipped: false
        }
      };

    case 'SET_FIRST_VISIT':
      return {
        ...state,
        firstVisit: false
      };

    default:
      return state;
  }
};

export default AppReducer;
