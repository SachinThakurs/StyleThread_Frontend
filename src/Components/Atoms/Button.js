// Button.tsx
import React from 'react';
import './Button.css';  // Make sure to create this CSS file

export const Button = ({ type = 'submit', className = 'submitButton', label, onClick }) => (
  <button className={`btn ${className}`} type={type} onClick={onClick}>
    {label}
  </button>
);
