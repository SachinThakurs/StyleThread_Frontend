import React from 'react';

export const Checkbox = ({ label, name, checked, onChange }) => (
  <div className="inputContainer">
    <label className="inputLabel">{label}:</label>
    <input
      className="customInput"
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
    />
  </div>
);
