import type { Allocation } from '@/models';

export const DATE_H = 40;
export interface ItemDate {
  label: string;
  date: Date;
}

export const WEEK_H = 40;
export interface ItemWeek {
  label: string;
  span: number;
}

export const MONTH_H = 50;
export interface ItemMonth {
  label: string;
  span: number;
}

export const CELL_H = 120;
export const CELL_W = 150;

export const USER_W = 250;

export const cellHSize = 70;
export const cellStyle = `'h-[${cellHSize.toFixed()}] w-[${CELL_W.toFixed()}px] border-2 border-gray-200 text-center`;

export function getDates(iniDate: Date, endDate: Date): ItemDate[] {
  const arr: ItemDate[] = [];
  const start = iniDate.getTime();
  const end = endDate.getTime();

  for (let d = start; d < end; d += 24 * 60 * 60 * 1000) {
    const date = new Date(d);
    arr.push({ label: date.toISOString().split('T')[0], date });
  }

  return arr;
}

export function getWeeks(dates: ItemDate[]): ItemWeek[] {
  const groups: ItemWeek[] = [];
  let current: ItemWeek | undefined;
  const getWeek = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `Week ${weekNumber.toFixed().padStart(2, '0')}`;
  };
  dates.forEach(({ date }) => {
    const label = getWeek(date);
    if (label !== current?.label) {
      if (current) groups.push(current);
      current = { label, span: 0 };
    }
    current.span++;
  });
  if (current && current.span > 0) groups.push(current);
  return groups;
}

export function getMonth(dates: ItemDate[]): ItemMonth[] {
  const groups: ItemMonth[] = [];
  let current: ItemMonth | undefined;
  dates.forEach(({ date }) => {
    const label = date.toLocaleString('en', { month: 'long', year: 'numeric' });
    if (label !== current?.label) {
      if (current) groups.push(current);
      current = { label, span: 0 };
    }
    current.span++;
  });
  if (current && current.span > 0) groups.push(current);
  return groups;
}

export function calWidth(spans: number, width: number, border: number, margin = 0): string {
  const spansWidth = spans * width;
  const crossBorder = (spans - 1) * border - margin;
  return `w-[${(spansWidth + crossBorder).toFixed()}px]`;
}

export const getSpanDates = (dates: ItemDate[], date: string, span: number) => {
  const dateIndex = dates.findIndex((d) => d.label === date);
  return dates.slice(dateIndex, dateIndex + span);
};

export const isCellOccupied = (
  dates: ItemDate[],
  allocations: Allocation[],
  allocation: { id: string; memberId: string; iniDate: string; span: number }
) => {
  const draggedDates = getSpanDates(dates, allocation.iniDate, allocation.span);

  return allocations.some((a) => {
    if (a.memberId !== allocation.memberId || a.id === allocation.id) return false;
    const aDates = getSpanDates(dates, a.iniDate, a.span);
    return draggedDates.some((d) => aDates.includes(d));
  });
};
