import React from 'react';
import audioManager from '../utils/audioManager';
import hapticsManager from '../utils/haptics';

const Toggle = ({ checked, onChange, label, disabled = false }) => {
  const handleToggle = () => {
    if (disabled) return;
    audioManager.playClick();
    hapticsManager.light();
    onChange(!checked);
  };

  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-base text-white/90">{label}</span>
      <div
        className={`
          relative w-14 h-8 rounded-full transition-all duration-300
          ${checked ? 'bg-blue-500' : 'bg-white/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleToggle}
      >
        <div
          className={`
            absolute top-1 left-1 w-6 h-6 bg-white rounded-full
            transition-transform duration-300 shadow-lg
            ${checked ? 'transform translate-x-6' : ''}
          `}
        />
      </div>
    </label>
  );
};

export default Toggle;
