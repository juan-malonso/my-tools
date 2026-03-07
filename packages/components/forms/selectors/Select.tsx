import React from 'react';

type SelectVariant = 'primary' | 'secondary' | 'ghost';
type SelectSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: SelectVariant;
  size?: SelectSize;
  options: SelectOption[];
  placeholder?: string;
}

const baseStyles =
  'inline-block rounded-lg border-transparent transition-all appearance-none focus:outline-none cursor-pointer';

const variantStyles: Record<SelectVariant, string> = {
  primary: 'text-white bg-slate-900 border border-slate-700 hover:bg-slate-700',
  secondary: 'text-slate-200 bg-slate-700 border-slate-600 hover:bg-slate-600',
  ghost: 'text-slate-400 bg-transparent border-slate-700 hover:bg-slate-800'
};

const sizeStyles: Record<SelectSize, string> = {
  xs: 'px-2 py-0.5 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
};

export const Select: React.FC<SelectProps> = ({
  variant = 'primary',
  size = 'md',
  options,
  placeholder,
  className = '',
  ...props
}) => {
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <select className={styles} {...props}>
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="bg-slate-800 text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};
