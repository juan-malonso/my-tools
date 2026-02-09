import React from 'react';

export interface BodyContentProps {
  children?: React.ReactNode;
}

export function BodyContent({ children = <></> }: BodyContentProps) {
  return (
    <div style={bodyStyle} className="h-full w-full relative overflow-auto">
      <div className="p-4 flex space-x-2">{children}</div>
    </div>
  );
}

BodyContent.displayName = 'BodyContent';

const bodyStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, #1f2937 25%, transparent 25%),
    linear-gradient(-45deg, #1f2937 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1f2937 75%),
    linear-gradient(-45deg, transparent 75%, #1f2937 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: `
    0 0,
    0 10px,
    10px -10px,
    -10px 0px
  `,
  touchAction: 'none',
  userSelect: 'none'
};
