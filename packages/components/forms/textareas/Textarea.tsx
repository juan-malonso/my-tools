import React from 'react';

type TextareaVariant = 'primary' | 'secondary' | 'ghost';
type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  size?: TextareaSize;
}

const baseStyles =
  'block w-full rounded-lg border transition-all focus:outline-none placeholder-slate-500 resize-y';

const variantStyles: Record<TextareaVariant, string> = {
  primary:
    'text-white bg-slate-800 border-slate-700 hover:bg-slate-700 focus:ring-sky-500 focus:border-sky-500',
  secondary: 'text-slate-200 bg-slate-700 border-slate-600 hover:bg-slate-600 focus:ring-slate-400',
  ghost: 'text-slate-400 bg-transparent border-slate-700 hover:bg-slate-800 focus:ring-slate-500'
};

const sizeStyles: Record<TextareaSize, string> = {
  sm: 'px-2 py-1.5 text-xs min-h-[80px]',
  md: 'px-2 py-2 text-sm min-h-[120px]',
  lg: 'px-2 py-3 text-base min-h-[160px]'
};

export const Textarea: React.FC<TextareaProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <textarea className={styles} {...props} />;
};
