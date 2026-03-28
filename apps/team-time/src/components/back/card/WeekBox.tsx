import React from 'react';
import { CloseButton } from '@component/forms';
import { DownloadIcon } from '@component/icons';

import type { ItemWeek } from '@/models';
import { WEEK_H, weekColor } from '@/utils';

import { HeaderBox } from './HeaderBox';

export const WeekBox: React.FC<{ week: ItemWeek; onReport: () => void }> = ({ week, onReport }) => {
  const color = weekColor(week);

  return (
    <HeaderBox
      className={`${color} p-2 border-b-2 text-sm text-left group`}
      height={WEEK_H}
      span={week.span}
    >
      <div className="flex w-full">
        <div className="flex justify-between items-center px-2 w-full">
          <div className="sticky left-0">{week.label}</div>
        </div>
        <CloseButton
          className="bg-slate-500 hover:bg-slate-600 text-slate-100"
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
        >
          <DownloadIcon className="w-4 h-4" />
        </CloseButton>
      </div>
    </HeaderBox>
  );
};
