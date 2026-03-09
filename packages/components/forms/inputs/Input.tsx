import React from 'react';

type InputVariant = 'primary' | 'secondary' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
}

const baseStyles =
  'block w-full rounded-lg border transition-all focus:outline-none placeholder-slate-500';

const variantStyles: Record<InputVariant, string> = {
  primary:
    'text-white bg-slate-800 border-slate-700 hover:bg-slate-700 focus:ring-sky-500 focus:border-sky-500',
  secondary: 'text-slate-200 bg-slate-700 border-slate-600 hover:bg-slate-600 focus:ring-slate-400',
  ghost: 'text-slate-400 bg-transparent border-slate-700 hover:bg-slate-800 focus:ring-slate-500'
};

const sizeStyles: Record<InputSize, string> = {
  sm: 'px-1 py-1.5 text-xs',
  md: 'px-1 py-2 text-sm',
  lg: 'px-1 py-3 text-base'
};

export const Input: React.FC<InputProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <input className={styles} {...props} />;
};
