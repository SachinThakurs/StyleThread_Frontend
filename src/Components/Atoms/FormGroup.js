import React from 'react';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Select } from './Select';

export const FormGroup = ({ label, type, name, value, onChange, placeholder, required, options, optionId, optionName }) => {
  switch (type) {
    case 'text':
    case 'number':
      return <Input label={label} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />;
    case 'textarea':
      return <TextArea label={label} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} />;
    case 'select':
      return <Select label={label} name={name} value={value} onChange={onChange} options={options} optionId={optionId} optionName={optionName} />;
    default:
      return null;
  }
};
