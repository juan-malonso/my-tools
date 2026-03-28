import React from 'react';

export type NavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const NavButton: React.FC<NavButtonProps> = ({ className = '', children, ...props }) => (
  <button
    className={`px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);
