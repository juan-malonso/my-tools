import React from 'react';

import { USER_W } from '@/utils';

import { HeaderBox } from './HeaderBox';

export const MemberBox: React.FC = () => {
  return (
    <HeaderBox className="text-no-wrap uppercase">
      <div style={{ width: USER_W }} />
    </HeaderBox>
  );
};
