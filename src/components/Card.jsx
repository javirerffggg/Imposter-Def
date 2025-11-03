import React from 'react';

const Card = ({ children, className = '', glass = false, hover = true }) => {
  const classes = `
    ${glass ? 'glass-card' : 'card'}
    ${hover ? 'hover:shadow-xl' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
