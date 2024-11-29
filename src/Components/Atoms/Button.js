import React from 'react';

export const Button = ({ type = 'submit',className = "submitButton", label, onClick }) => (
  <button className={className} type={type} onClick={onClick}>
    {label}
  </button>
);
