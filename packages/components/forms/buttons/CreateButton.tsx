import React from 'react';

import { Button, type ButtonProps } from './Button';
import { AddIcon } from '../../icons';

export const CreateButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props}>
      <div className="flex items-center gap-2">
        <AddIcon className="h-4 w-4" />
        {children}
      </div>
    </Button>
  );
};
