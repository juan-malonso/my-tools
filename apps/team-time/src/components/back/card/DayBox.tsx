import React from 'react';

import type { ItemDate } from '@/models';
import { DATE_H, dayColor } from '@/utils';

import { HeaderBox } from './HeaderBox';

export const DayBox: React.FC<{ date: ItemDate }> = ({ date }) => {
  const color = dayColor(date);

  return (
    <HeaderBox className={`p-2 ${color} border-b-2 text-sm`} height={DATE_H}>
      <div className={`flex justify-center items-center gap-2`}>
        <div className="text-lg">{date.label.slice(8, 10)}</div>
        <div className="text-slate-400 text-md">
          {date.date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}
        </div>
      </div>
    </HeaderBox>
  );
};
