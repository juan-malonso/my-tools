import React from 'react';

import { HeaderBox } from './HeaderBox';

export const EmptyBox: React.FC = () => {
  return (
    <HeaderBox className="text-no-wrap uppercase">
      <div />
    </HeaderBox>
  );
};
