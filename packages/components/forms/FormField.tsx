import React from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  id?: string;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  children,
  id,
  required,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">{children}</div>

      {hint && !error && <p className="text-xs text-slate-500 italic">{hint}</p>}

      {error && (
        <p className="text-xs text-red-400 font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
