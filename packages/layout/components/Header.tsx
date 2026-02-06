import React from 'react';

export interface HeaderProps {
  title?: React.ReactNode;
  topnav?: React.ReactNode;
  actions?: React.ReactNode;
}

const style = 'bg-gray-900 shadow-lg';
const border = 'border-gray-800';

export function Header({ title = <></>, topnav = <></>, actions = <></> }: HeaderProps) {
  return (
    <div
      className={`w-full h-full ${style} border-b ${border} flex justify-between items-center shadow-lg z-50`}
    >
      {title}
      {topnav}
      {actions}
    </div>
  );
}
