import React from "react";

export interface BodyProps {
  children: React.ReactNode;
}

export function Body({ children }: BodyProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      {children}
    </div>
  );
}
