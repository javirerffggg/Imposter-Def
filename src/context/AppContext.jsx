import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';
import { wordBank } from '../utils/words';

// Cargar estado persistente desde localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('imposterState');
    if (serializedState === null) return undefined;
    const loaded = JSON.parse(serializedState);
    return {
      players: loaded.players || [],
      settings: loaded.settings || undefined
    };
  } catch (e) {
    console.warn("No se pudo cargar el estado", e);
    return undefined;
  }
};

const persistedState = loadState();

// Estado inicial
const initialState = {
  players: [],
  settings: {
    impostors: 1,
    difficulty: 'medium',
    theme: 'theme-dark',
    colorblindMode: false,
    batterySaverMode: false,
    soundEnabled: true,
    hapticsEnabled: true,
    selectedCategories: [],
    activeModes: {
      detective: false,
      troll: false
    }
  },
  game: {
    word: null,
    category: null,
    impostorIds: [],
    detectiveId: null,
    startingPlayerId: null,
    lastImpostorIds: []
  },
  roleReveal: {
    currentPlayerIndex: 0,
    cardFlipped: false
  },
  usedWords: [],
  wordDatabase: wordBank,
  firstVisit: true
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, {
    ...initialState,
    ...persistedState
  });

  // Persistir en localStorage
  useEffect(() => {
    const stateToSave = {
      players: state.players,
      settings: state.settings,
    };
    localStorage.setItem('imposterState', JSON.stringify(stateToSave));
  }, [state.players, state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
