import React from "react";

export interface CreateButtonProps {
  children: React.ReactNode;
  onClick: (e: any) => void;
}

const color = "text-white bg-blue-600 hover:bg-blue-500";
const style = "px-3 py-1 rounded-md text-xs font-medium transition-colors";

export function CreateButton({ children, onClick }: CreateButtonProps) {
  return (
    <button onClick={onClick} className={`${color} ${style}`}>
      {children}
    </button>
  );
}
