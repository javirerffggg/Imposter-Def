import React from 'react';

const Input = ({ 
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onEnter,
  className = '',
  maxLength,
  autoFocus = false,
  ...props 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <input
      type={type}
      className={`input ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      maxLength={maxLength}
      autoFocus={autoFocus}
      {...props}
    />
  );
};

export default Input;
