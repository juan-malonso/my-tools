import React from 'react';

export interface BodyContentProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode;
  children?: React.ReactNode;
}

const baseStyle = 'absolute h-full w-full inset-0 flex items-center justify-center';

export const BodyContent = React.forwardRef<HTMLDivElement, BodyContentProps>(({ image = <>

    </>, children = <></>, className = '', ...props }, ref) => {
  return (
    <div ref={ref} style={bodyStyle} className={`h-full w-full relative ${className}`} {...props}>
      <div id="image-background" className={`${baseStyle} pointer-events-none`}>
        {image}
      </div>
      <div id="monitor-background" className={baseStyle}>
        {children}
      </div>
    </div>
  );
});

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
