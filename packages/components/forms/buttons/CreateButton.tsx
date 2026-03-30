import React from 'react';

import { AddIcon } from '../../icons';

import { Button, type ButtonProps } from './Button';

export const CreateButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props}>
      <div className="flex items-center gap-2">
        {typeof children === 'string' ? (
          <>
            <AddIcon className="h-4 w-4" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </div>
    </Button>
  );
};
