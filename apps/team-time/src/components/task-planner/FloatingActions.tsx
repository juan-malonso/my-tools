'use client';

import React from 'react';
import { TargetIcon } from '@component/icons';

interface FloatingActionsProps {
  onGoToToday: () => void;
}

function Action({ children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`
          h-12 w-12 flex 
          items-center justify-center rounded-full
          border-2 border-sky-100
          bg-sky-500 text-white outline-none
          hover:bg-sky-600
          transition-all
        `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onGoToToday }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <Action onClick={onGoToToday}>
        <TargetIcon className="h-7 w-7 text-white" />
      </Action>
    </div>
  );
};
