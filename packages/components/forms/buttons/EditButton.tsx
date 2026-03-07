import React from 'react';

import { Button, type ButtonProps } from './Button';
import { PencilIcon } from '../../icons';

export const EditButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="secondary" size="sm" {...props}>
      {children ?? <PencilIcon className="h-4 w-4" />}
    </Button>
  );
};
