import React from 'react';

import { Button, type ButtonProps } from './Button';
import { DeleteIcon } from '../../icons';

export const DeleteButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="danger" size="sm" {...props}>
      {children ?? <DeleteIcon className="h-4 w-4" />}
    </Button>
  );
};
