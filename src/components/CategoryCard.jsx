import React from 'react';

const CategoryCard = ({ category, selected, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        glass-card p-6 text-center transition-all duration-300
        ${selected 
          ? 'border-blue-500 border-2 bg-blue-500/20' 
          : 'border-white/10 hover:border-white/30'
        }
      `}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold capitalize">{category}</h3>
      {selected && (
        <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full mx-auto" />
      )}
    </button>
  );
};

export default CategoryCard;
