import React from 'react';

import type { Config } from '@/models';

import { BodyBackgroundTable } from './BodyBackgroudTable';
import { BodyTaskTable } from './BodyTaskTable';
import { MONTH_H, WEEK_H, DATE_H } from './utils';

interface BodyProps {
  config: Config;
}

export const Body: React.FC<BodyProps> = ({ config }) => {
  const head = MONTH_H + WEEK_H + DATE_H + 6;

  return (
    <div className="h-full w-full p-5 overflow-auto bg-slate-800">
      <div className="h-full relative">
        <div className="h-full absolute">
          <BodyBackgroundTable config={config} />
        </div>
        <div
          className="h-full absolute overflow-y-auto"
          style={{
            top: head,
            height: `calc(100% - ${head.toFixed()}px)`
          }}
        >
          <BodyTaskTable config={config} />
        </div>
      </div>
    </div>
  );
};
