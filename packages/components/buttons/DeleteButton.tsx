import React from 'react';

export interface DeleteButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const color = 'text-gray-400 hover:text-red-500 hover:bg-gray-700';
const style = 'p-1 rounded-full transition-colors';

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button onClick={onClick} className={`${color} ${style} m-auto`}>
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
      </svg>
    </button>
  );
}
