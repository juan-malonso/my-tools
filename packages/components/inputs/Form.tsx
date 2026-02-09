import React from 'react';

export interface FormProps {
  className?: string;
  children?: React.ReactNode;
  cols?: number;
}

export function Form({ className = '', cols = 2, children = <></> }: FormProps) {
  return (
    <div
      className={`grid grid-cols-${cols.toFixed(0)} gap-x-4 gap-y-2 text-sm items-center ${className}`}
    >
      {children}
    </div>
  );
}
