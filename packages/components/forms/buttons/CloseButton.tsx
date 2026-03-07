import React from 'react';

import { Button, type ButtonProps } from './Button';

export const CloseButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="secondary" size="sm" {...props}>
      {children}
    </Button>
  );
};
