import React from "react";

export interface HeaderProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Header({ title, children, className = "" }: HeaderProps) {
  return (
    <header
      className={`bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center shadow-md z-10 ${className}`}
    >
      <div className="flex items-center gap-2">
        {/* Por defecto mostramos el título si es string, o el nodo si es complejo */}
        <div className="text-xl font-bold tracking-tight text-gray-100">
          {title}
        </div>
      </div>
      {/* Área para botones o acciones a la derecha */}
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
