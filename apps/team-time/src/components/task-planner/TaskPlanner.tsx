import React, { useEffect, useRef, useState } from 'react';

import { BackgroundTable } from '@/components/back';
import { MemberTable } from '@/components/member';
import { TaskTable } from '@/components/task';
import type { Config } from '@/models';
import { CELL_W, DATE_H, getDates, MONTH_H, USER_W, WEEK_H } from '@/utils';

interface TaskPlannerProps {
  config: Config;
  imports: number;
}

export const TaskPlanner: React.FC<TaskPlannerProps> = ({ config, imports }) => {
  const head = MONTH_H + WEEK_H + DATE_H + 13;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imports]);

  const [scrollAmount, setScrollAmount] = useState(0);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollAmount(e.currentTarget.scrollLeft);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-full w-full p-3 overflow-x-auto overflow-y-hidden bg-slate-800"
      onScroll={handleScroll}
    >
      <div className="h-full w-max min-w-full relative">
        <div className="h-full w-full absolute inset-0">
          <BackgroundTable config={config} />
        </div>

        <div
          className="absolute left-0 flex flex-row w-max min-w-full overflow-y-auto overflow-x-hidden"
          style={{ top: head, height: `calc(100% - ${head.toString()}px)` }}
        >
          <div
            className="relative z-10"
            style={{
              width: USER_W,
              transform: `translateX(${Math.max(0, scrollAmount - 13).toString()}px)`,
              transition: 'transform 0s'
            }}
          >
            <MemberTable config={config} scrollAmount={scrollAmount} />
          </div>

          <div className="relative flex-1">
            <TaskTable config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};
