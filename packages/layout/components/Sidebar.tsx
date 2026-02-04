import React from "react";

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className = "" }: SidebarProps) {
  return (
    <aside
      className={`w-80 bg-gray-900 border-r border-gray-800 flex flex-col z-10 shadow-lg ${className}`}
    >
      <div className="flex-grow p-6 space-y-8 overflow-y-auto">{children}</div>
    </aside>
  );
}
