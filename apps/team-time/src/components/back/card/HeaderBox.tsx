import React from 'react';

const borderStyle = 'border-slate-500';
const headerStyle = 'text-slate-100';

interface HeaderBoxProps {
  children: React.ReactNode;
  className: string;
  height?: number;
  span?: number;
}

export function HeaderBox({ children, className, height, span = 1 }: HeaderBoxProps) {
  return (
    <th colSpan={span} style={{ height }} className={`${headerStyle} ${borderStyle} ${className}`}>
      {children}
    </th>
  );
}
