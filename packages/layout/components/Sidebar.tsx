import React from 'react';

export interface SidebarProps {
  children: React.ReactNode;
  instructions?: React.ReactNode;
}

const style = 'bg-gray-900 shadow-lg';
const border = 'border-gray-800';

const section = 'p-6';

export function Sidebar({ children, instructions }: SidebarProps) {
  const leyend =
    instructions !== undefined ? (
      <div className={`${section} border-t ${border}`}>{instructions}</div>
    ) : (
      <></>
    );

  return (
    <div className={`w-full h-full ${style} border-r ${border} flex flex-col`}>
      <div className={`${section} h-full overflow-y-auto`}>{children}</div>
      {leyend}
    </div>
  );
}
