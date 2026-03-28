import React from 'react';

export interface SectionHeaderProps {
  title: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, loading, children }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="text-xs font-bold text-slate-500 uppercase">{title}</div>
      {loading && (
        <svg className="animate-spin h-3 w-3 text-slate-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </div>
    {children && <div>{children}</div>}
  </div>
);
