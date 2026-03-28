import React from 'react';

import type { ItemMonth } from '@/models';
import { MONTH_H, monthColor } from '@/utils';

import { HeaderBox } from './HeaderBox';

export const MonthBox: React.FC<{ month: ItemMonth }> = ({ month }) => {
  const color = monthColor(month);

  return (
    <HeaderBox
      className={`${color} p-2 border-b-2 uppercase text-left`}
      height={MONTH_H}
      span={month.span}
    >
      <div className="flex justify-between items-center px-2 w-full">
        <div className="sticky left-0">{month.label}</div>
      </div>
    </HeaderBox>
  );
};
