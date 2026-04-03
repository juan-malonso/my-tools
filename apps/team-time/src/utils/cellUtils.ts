/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file cellUtils.ts
 *
 * --- Description -------------------------------------------------------------
 * @description Utilities for styling table cells, providing colors and styles
 * based on date properties.
 *
 * --- Functions ---------------------------------------------------------------
 * - dayColor
 * - weekColor
 * - monthColor
 * ========================================================================= */

import type { ItemDate, ItemMonth, ItemWeek } from '@/models';

import { getWeekNumber } from './dateUtils';

const todayStyle = 'bg-sky-400/30 text-sky-400';
const weekendStyle = 'bg-slate-900/30 text-slate-500';

/**
 * Determines the background and text color for a cell based on the date.
 * It highlights weekends and the current day with different colors.
 *
 * @param {ItemDate} date - The date object for the cell.
 * @returns {string} A string of Tailwind CSS classes for the cell's color.
 */
export const dayColor = (date: ItemDate): string => {
  const today = new Date().toISOString().split('T')[0];

  if (date.label === today) {
    return todayStyle;
  }

  if ([0, 6].includes(date.date.getDay())) {
    return weekendStyle;
  }

  return '';
};

/**
 * Determines the color for a week header, highlighting the current week.
 *
 * @param {ItemWeek} week - The week object to check.
 * @returns {string} A string of Tailwind CSS classes for the week's color.
 */
export const weekColor = (week: ItemWeek): string => {
  const currentWeekLabel = `Week ${getWeekNumber(new Date()).toFixed().padStart(2, '0')}`;

  if (week.label === currentWeekLabel) {
    return todayStyle;
  }

  return '';
};

/**
 * Determines the color for a month header, highlighting the current month.
 *
 * @param {ItemMonth} month - The month object to check.
 * @returns {string} A string of Tailwind CSS classes for the month's color.
 */
export const monthColor = (month: ItemMonth): string => {
  const currentMonthLabel = new Date().toLocaleString('en', { month: 'long', year: 'numeric' });

  if (month.label === currentMonthLabel) {
    return todayStyle;
  }

  return '';
};
