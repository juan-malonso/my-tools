import React from "react";

export interface FormProps {
  className: string;
  children?: React.ReactNode;
}

const style = "grid grid-cols-2 gap-x-4 gap-y-2 text-sm items-center";

export function Form({ className, children = <></> }: FormProps) {
  return <div className={`${style} ${className}`}>{children}</div>;
}
