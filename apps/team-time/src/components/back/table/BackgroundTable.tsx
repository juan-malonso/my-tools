import React, { useMemo, useState } from 'react';

import { ReportModal } from '@/components/report';
import type { Config } from '@/models';
import { generateWeeklyReport, getDates, getMonths, getWeeks } from '@/utils';

import { DayBox, EmptyBox, MemberBox, MonthBox, WeekBox } from '../card';

import { BackgroundCell } from './BackgroundCell';

interface BackgroundTableProps {
  config: Config;
}

const borderStyle = 'border-slate-500';

export const BackgroundTable: React.FC<BackgroundTableProps> = ({ config }) => {
  const { general, members, allocations, tasks, modules } = config;

  const dates = useMemo(
    () => getDates(general.iniDate, general.endDate),
    [general.iniDate, general.endDate]
  );
  const months = useMemo(() => getMonths(dates), [dates]);
  const weeks = useMemo(() => getWeeks(dates), [dates]);

  const [currentWeekIndex, setCurrentWeekIndex] = useState<number | null>(null);

  const handleReport = (weekIndex: number) => {
    setCurrentWeekIndex(weekIndex);
  };

  const reportText = useMemo(() => {
    if (currentWeekIndex === null || !weeks[currentWeekIndex]) return '';

    const weekInfo = weeks[currentWeekIndex];

    let offset = 0;
    for (let i = 0; i < currentWeekIndex; i++) {
      offset += weeks[i].span;
    }

    const weekDates = dates.slice(offset, offset + weekInfo.span);

    return generateWeeklyReport({
      weekDates,
      members: members.values,
      allocations: allocations.values,
      tasks: tasks.values,
      modules: modules.values,
      baseUrl: general.baseUrl
    });
  }, [
    currentWeekIndex,
    weeks,
    dates,
    members.values,
    allocations.values,
    tasks.values,
    modules.values,
    general.baseUrl
  ]);

  const handlePrevWeek = () => {
    if (currentWeekIndex !== null && currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex !== null && currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  return (
    <>
      <table
        className={`
          h-full w-full rounded-2xl 
          bg-slate-700 text-slate-100
          shadow-[10px_10px_20px]
          shadow-slate-900/80
        `}
      >
        <thead>
          <tr className={`divide-x-2`}>
            <EmptyBox />
            {months.map((m, i) => (
              <MonthBox key={i} month={m} />
            ))}
          </tr>
          <tr className={`divide-x-2`}>
            <EmptyBox />
            {weeks.map((w, i) => (
              <WeekBox
                key={i}
                week={w}
                onReport={() => {
                  handleReport(i);
                }}
              />
            ))}
          </tr>
          <tr className={`divide-x-2 border-b-2 ${borderStyle}`}>
            <EmptyBox />
            {dates.map((d, i) => (
              <DayBox key={i} date={d} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={`divide-x-2 h-full w-full`}>
            <MemberBox />
            {dates.map((d, i) => (
              <BackgroundCell key={i} date={d} />
            ))}
          </tr>
        </tbody>
      </table>

      <ReportModal
        text={reportText}
        isModalOpen={currentWeekIndex !== null}
        setIsModalOpen={(isOpen) => {
          if (!isOpen) setCurrentWeekIndex(null);
        }}
        onPrev={handlePrevWeek}
        onNext={handleNextWeek}
        canGoPrev={currentWeekIndex !== null && currentWeekIndex > 0}
        canGoNext={currentWeekIndex !== null && currentWeekIndex < weeks.length - 1}
      />
    </>
  );
};
