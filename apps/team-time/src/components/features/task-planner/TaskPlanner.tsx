import React from 'react';

import type { Config } from '@/models';

import { BackgroundTable } from './components/BackgroundTable';
import { TaskTable } from './components/TaskTable';
import { MONTH_H, WEEK_H, DATE_H } from './utils/handlers';

interface TaskPlannerProps {
  config: Config;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ config }) => {
  const head = MONTH_H + WEEK_H + DATE_H + 6;

  return (
    <div className="h-full w-full p-5 overflow-auto bg-slate-800">
      <div className="h-full relative">
        <div className="h-full absolute">
          <BackgroundTable config={config} />
        </div>
        <div
          className="h-full absolute overflow-y-auto"
          style={{
            top: head,
            height: `calc(100% - ${head.toFixed()}px)`
          }}
        >
          <TaskTable config={config} />
        </div>
      </div>
    </div>
  );
};
