import React from 'react';

export const Select = ({ label, name, value, onChange, options, optionId, optionName }) => (
  <div className="inputContainer">
    <label className="inputLabel">{label}:</label>
    <select
      className="customInput"
      name={name}
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option[optionId]} value={option[optionId]}>
          {option[optionName]}
        </option>
      ))}
    </select>
    <div className="inputUnderline"></div>
  </div>
);
