import React, { useState } from 'react';

import { CloseButton } from '@component/forms';
import { DownloadIcon } from '@component/icons';

import type { Config } from '@/models';

import {
  getDates,
  getWeeks,
  getMonth,
  DATE_H,
  WEEK_H,
  MONTH_H,
  CELL_W,
  type ItemMonth,
  type ItemWeek,
  USER_W,
  type ItemDate
} from '../../utils/handlers';
import { ReportModal, generateWeeklyReport } from '../report';

interface BackgroundTableProps {
  config: Config;
}

const borderStyle = 'border-slate-500';
const headerStyle = 'text-slate-100 p-2';

export const BackgroundTable: React.FC<BackgroundTableProps> = ({ config }) => {
  const { general, members, allocations, tasks, modules } = config;

  const dates = getDates(general.iniDate, general.endDate);
  const months = getMonth(dates);
  const weeks = getWeeks(dates);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleReport = (weekDates: ItemDate[]) => {
    const text = generateWeeklyReport({
      weekDates,
      members: members.values,
      allocations: allocations.values,
      tasks: tasks.values,
      modules: modules.values,
      baseUrl: general.baseUrl
    });
    setReportText(text);
    setIsModalOpen(true);
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
          <tr className={`divide-x-2 ${borderStyle}`}>
            <SpaceBox />
            {months.map((m, i) => (
              <MonthBox key={i} month={m} />
            ))}
          </tr>
          <tr className={`divide-x-2 ${borderStyle}`}>
            <SpaceBox />
            {
              weeks.reduce<{ nodes: React.ReactNode[]; offset: number }>(
                (acc, w, i) => {
                  const weekDates = dates.slice(acc.offset, acc.offset + w.span);
                  acc.nodes.push(
                    <WeekBox
                      key={i}
                      week={w}
                      onReport={() => {
                        handleReport(weekDates);
                      }}
                    />
                  );
                  acc.offset += w.span;
                  return acc;
                },
                { nodes: [], offset: 0 }
              ).nodes
            }
          </tr>
          <tr className={`divide-x-2 ${borderStyle} border-b-2`}>
            <SpaceBox />
            {dates.map((d, i) => (
              <DayBox key={i} date={d} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={`divide-x-2 ${borderStyle} h-full w-full`}>
            <SpaceBox />
            {dates.map((d, i) => {
              return <BackgroundCell key={i} date={d} last={i === dates.length - 1} />;
            })}
          </tr>
        </tbody>
      </table>
      <ReportModal text={reportText} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
};

const SpaceBox: React.FC = () => {
  return (
    <th className="text-no-wrap uppercase">
      <div style={{ width: USER_W }}></div>
    </th>
  );
};

const MonthBox: React.FC<{ month: ItemMonth }> = ({ month }) => {
  return (
    <th
      colSpan={month.span}
      style={{ height: MONTH_H }}
      className={`${headerStyle} ${borderStyle} border-b-2 uppercase text-left`}
    >
      <span className="sticky left-0 px-2">{month.label}</span>
    </th>
  );
};

const WeekBox: React.FC<{ week: ItemWeek; onReport: () => void }> = ({ week, onReport }) => {
  return (
    <th
      colSpan={week.span}
      style={{ height: WEEK_H }}
      className={`${headerStyle} ${borderStyle} border-b-2 text-sm text-left group `}
    >
      <div className="flex w-full">
        <div className="flex justify-between items-center px-2 w-full">
          <div className="sticky left-0">{week.label}</div>
        </div>
        <CloseButton
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
          className="transition-opacity p-1 hover:bg-slate-600 rounded text-slate-300 hover:text-white"
        >
          <DownloadIcon className="w-4 h-4" />
        </CloseButton>
      </div>
    </th>
  );
};

const DayBox: React.FC<{ date: ItemDate }> = ({ date }) => {
  const color = cellColor(date, 't');

  return (
    <th
      style={{ height: DATE_H }}
      className={`bg-slate-700 ${headerStyle} ${borderStyle} ${color} border-b-2 text-sm`}
    >
      <div className={`flex flex-col justify-center items-center text-lg`}>
        <div className="text-slate-400">
          {date.date.toLocaleString('en-US', { weekday: 'narrow' })}
        </div>
        <div className="">{date.label.slice(8, 10)}</div>
      </div>
    </th>
  );
};

export const BackgroundCell: React.FC<{ date: ItemDate; last: boolean }> = ({ date, last }) => {
  const color = cellColor(date, 'b');
  const round = last ? 'rounded-br-2xl' : '';

  return (
    <td style={{ width: CELL_W }} className={`${borderStyle} ${color} ${round}`}>
      <div style={{ width: CELL_W }} className={`h-full`}></div>
    </td>
  );
};

const today = new Date().toISOString().split('T')[0];

function cellColor({ label, date }: ItemDate, dir: 't' | 'b' = 'b'): string {
  const weekDay = date.toLocaleString('en-US', { weekday: 'narrow' });

  const color = ['S', 'D'].includes(weekDay) ? 'bg-slate-700' : 'bg-slate-800';

  if (today === label) {
    return `${color}
        shadow-[inset_0_${dir == 'b' ? '-' : ''}5px_20px]
        shadow-blue-300/40
      `;
  }

  return color;
}
