import React from 'react';

import { Input } from './Input';

export interface TextInputProps {
  label: React.ReactNode;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}

const style = 'bg-gray-900 border border-gray-700 w-full rounded-md px-2 py-1';

export function TextInput({
  label,
  placeholder,
  className = '',
  defaultValue,
  onChange
}: TextInputProps) {
  return (
    <Input label={label}>
      <input
        type="text"
        className={`${style} ${className}`}
        placeholder={placeholder}
        value={defaultValue}
        onChange={onChange}
      />
    </Input>
  );
}
