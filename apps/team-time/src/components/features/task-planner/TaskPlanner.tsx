import React, { useEffect, useRef } from 'react';

import type { Config } from '@/models';

import { BackgroundTable } from './components/table/BackgroundTable';
import { TaskTable } from './components/table/TaskTable';
import { CELL_W, DATE_H, getDates, MONTH_H, USER_W, WEEK_H } from './utils/handlers';

interface TaskPlannerProps {
  config: Config;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ config }) => {
  const head = MONTH_H + WEEK_H + DATE_H + 11;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const dates = getDates(config.general.iniDate, config.general.endDate);
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = dates.findIndex((d) => d.label === today);

    if (todayIndex !== -1) {
      const containerWidth = container.offsetWidth;
      // Calculate the scroll position to center today's column
      const todayPosition = USER_W + todayIndex * CELL_W;
      const scrollLeft = todayPosition + CELL_W / 2 - containerWidth / 2;

      // Ensure scroll is within bounds
      const maxScrollLeft = container.scrollWidth - containerWidth;
      container.scrollLeft = Math.max(0, Math.min(scrollLeft, maxScrollLeft));
    }
  }, [config]);

  return (
    <div ref={scrollContainerRef} className="h-full w-full p-5 overflow-auto bg-slate-800">
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
