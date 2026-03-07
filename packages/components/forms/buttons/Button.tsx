import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'text-white bg-sky-600 hover:bg-sky-500',
  secondary: 'text-white bg-slate-600 hover:bg-slate-500',
  danger: 'text-white text-red-600 hover:bg-red-500/20',
  ghost: 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};
