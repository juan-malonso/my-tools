import React from 'react';

import { DeleteButton } from '../buttons';

export interface ModalProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ onClose, className = '', children, title }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-8 ${className}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-full h-full"
      >
        <div className={`bg-gray-800 rounded-lg h-full w-full flex flex-col`}>
          <div className={`border-b-2 border-gray-700 flex justify-between items-center p-3`}>
            <h2 className="flex gap-2 tracking-wider items-center w-full">{title}</h2>
            <DeleteButton onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
