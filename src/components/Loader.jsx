import React from 'react';

const Loader = ({ size = 'medium', text = '' }) => {
  const sizes = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`loader ${sizes[size]}`} />
      {text && <p className="text-white/60 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
