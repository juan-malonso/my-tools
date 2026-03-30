import React from 'react';

import { DeleteIcon } from '../../icons';

import { Button, type ButtonProps } from './Button';

export const DeleteButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button variant="danger" size="sm" {...props}>
      {children ?? <DeleteIcon className="h-4 w-4" />}
    </Button>
  );
};
