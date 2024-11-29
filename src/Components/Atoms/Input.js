import React from 'react';

export const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="inputContainer">
    <label className="inputLabel">{label}:</label>
    <input
      className="customInput"
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
    <div className="inputUnderline"></div>
  </div>
);
