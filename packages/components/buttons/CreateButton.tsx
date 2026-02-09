import React from 'react';

export interface CreateButtonProps {
  text: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const color = 'text-white bg-blue-600 hover:bg-blue-500';
const style = 'px-3 py-1 rounded-md text-xs font-medium transition-colors';

export function CreateButton({ text, className = '', onClick }: CreateButtonProps) {
  return (
    <button onClick={onClick} className={`${color} ${style} ${className}`}>
      {text}
    </button>
  );
}
