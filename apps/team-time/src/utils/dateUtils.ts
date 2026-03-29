/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file dateUtils.ts
 *
 * --- Description -------------------------------------------------------------
 * @description General date manipulation and calculation utilities. Exports
 * functions to offset dates, retrieve ISO week numbers, and generate date
 * arrays.
 *
 * --- Functions ---------------------------------------------------------------
 * - Dates and Offsets:
 *    - calculateDateOffset
 *    - getWeekNumber
 *    - getSpanDates
 * - Time Groupers:
 *    - getDates
 *    - getWeeks
 *    - getMonths
 * ========================================================================= */

import type { Allocation, ItemDate, ItemMonth, ItemWeek } from '@/models';

/** ----------------------------------------------------------------------------
  Dates and Offsets: 
  - calculateDateOffset
  - getWeekNumber
  - getSpanDates
---------------------------------------------------------------------------- **/

/**
 * Calculates a new date by adding or subtracting a specified amount of time.
 *
 * @param {Date} date - The starting date.
 * @param {'day' | 'week' | 'month'} period - The unit of time to add/subtract.
 * @param {number} diff - The amount of time to add (positive) or subtract (negative).
 * @returns {Date} A new Date object with the applied offset.
 */
export function calculateDateOffset(date: Date, period: 'day' | 'month' | 'week', diff: number) {
  const newDate = new Date(date);

  switch (period) {
    case 'day':
      newDate.setDate(newDate.getDate() + diff);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + diff * 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + diff);
      break;
  }

  return newDate;
}

/**
 * Generates an array of date strings for a given starting date and span.
 *
 * @param {string} date - The starting date string (YYYY-MM-DD).
 * @param {number} span - The number of days in the range.
 * @returns {string[]} An array of date strings.
 */
export function calculateDateRange(date: string, span: number): string[] {
  const startDate = new Date(date);
  const dates: string[] = [];
  for (let i = 0; i < span; i++) {
    const currentDate = new Date(startDate);
    currentDate.setUTCDate(currentDate.getUTCDate() + i);
    dates.push(currentDate.toISOString().slice(0, 10));
  }
  return dates;
}

/**
 * Finds the next available date in a member's row that is not occupied by an allocation.
 *
 * @param {ItemDate[]} dates - The array of all dates in the timeline.
 * @param {Allocation[]} memberAllocations - The allocations for a specific member.
 * @param {number} startIndex - The index from which to start searching in the dates array.
 * @returns {ItemDate | undefined} The first free date object found, or undefined if none are available.
 */
export function calculateNextFreeDate(
  dates: ItemDate[],
  memberAllocations: Allocation[],
  startIndex: number
): ItemDate | undefined {
  for (let i = startIndex + 1; i < dates.length; i++) {
    const date = dates[i];
    const isOccupied = memberAllocations.some((alloc) =>
      calculateDateRange(alloc.iniDate, alloc.span).includes(date.label)
    );
    if (!isOccupied) {
      return date;
    }
  }
  return undefined;
}

/**
 * Calculates the ISO week number for a given date.
 *
 * @param {Date} date - The date to calculate the week number for.
 * @returns {number} The ISO week number (1-53).
 */
export function getWeekNumber(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Retrieves a subset of dates starting from a specific date label.
 *
 * @param {ItemDate[]} dates - The full array of available dates.
 * @param {string} date - The starting date label (YYYY-MM-DD).
 * @param {number} span - The number of days to retrieve.
 * @returns {ItemDate[]} The sliced array of dates.
 */
export const getSpanDates = (dates: ItemDate[], date: string, span: number) => {
  const dateIndex = dates.findIndex((d) => d.label === date);
  return dates.slice(dateIndex, dateIndex + span);
};

/** ----------------------------------------------------------------------------
  Time Groupers: getDates, getWeeks, getMonths
---------------------------------------------------------------------------- **/

/**
 * Generates an array of daily date objects between a start and end date.
 *
 * @param {Date} iniDate - The starting date.
 * @param {Date} endDate - The ending date.
 * @returns {ItemDate[]} An array of date objects representing each day.
 */
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

/**
 * Groups an array of daily dates into week blocks.
 *
 * @param {ItemDate[]} dates - The array of daily dates to group.
 * @returns {ItemWeek[]} An array representing weeks and their span (number of days).
 */
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

/**
 * Groups an array of daily dates into month blocks.
 *
 * @param {ItemDate[]} dates - The array of daily dates to group.
 * @returns {ItemMonth[]} An array representing months and their span (number of days).
 */
export function getMonths(dates: ItemDate[]): ItemMonth[] {
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
