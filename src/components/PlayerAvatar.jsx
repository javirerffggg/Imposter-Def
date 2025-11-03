import React from 'react';
import { getPlayerColor } from '../utils/helpers';

const PlayerAvatar = ({ player, index, size = 'medium', showName = true }) => {
  const sizes = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-16 h-16 text-xl',
    large: 'w-24 h-24 text-3xl'
  };

  const initial = player.name.charAt(0).toUpperCase();
  const color = getPlayerColor(index);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          ${sizes[size]} rounded-full flex items-center justify-center
          font-bold text-white shadow-lg
        `}
        style={{ 
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          boxShadow: `0 4px 12px ${color}40`
        }}
      >
        {initial}
      </div>
      {showName && (
        <span className="text-sm font-medium text-white/80 truncate max-w-[80px]">
          {player.name}
        </span>
      )}
    </div>
  );
};

export default PlayerAvatar;
