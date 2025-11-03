// Generar ID único
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Barajar array (Fisher-Yates)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Formatear fecha
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calcular estadísticas
export const calculateStats = (players) => {
  if (!players || players.length === 0) return null;

  const totalGames = players.reduce((sum, p) => sum + p.stats.partidasJugadas, 0);
  const totalImpostorRoles = players.reduce((sum, p) => sum + p.stats.vecesImpostor, 0);

  return {
    totalGames,
    totalImpostorRoles,
    averageGamesPerPlayer: (totalGames / players.length).toFixed(1),
    mostExperiencedPlayer: players.reduce((prev, current) => 
      (current.stats.partidasJugadas > prev.stats.partidasJugadas) ? current : prev
    )
  };
};

// Validar nombre de jugador
export const validatePlayerName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'El nombre no puede estar vacío' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (name.trim().length > 20) {
    return { valid: false, error: 'El nombre no puede tener más de 20 caracteres' };
  }
  
  return { valid: true, error: null };
};

// Obtener color para jugador
export const getPlayerColor = (index) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52D681'
  ];
  return colors[index % colors.length];
};

// Exportar estadísticas a JSON
export const exportStats = (players) => {
  const data = {
    exportDate: new Date().toISOString(),
    players: players.map(p => ({
      name: p.name,
      stats: p.stats,
      createdAt: p.createdAt
    }))
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imposter-who-stats-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
