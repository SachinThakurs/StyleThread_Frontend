import React from 'react';

export const TextArea = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div className="inputContainer">
    <label className="inputLabel">{label}:</label>
    <textarea
      className="customInput description"
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    ></textarea>
    <div className="inputUnderline"></div>
  </div>
);

