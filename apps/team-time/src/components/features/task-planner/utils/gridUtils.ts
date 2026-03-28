/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file gridUtils.ts
 *
 * --- Description -------------------------------------------------------------
 * @description Utilities for calculating grid dimensions and resolving collisions.
 *
 * --- Functions ---------------------------------------------------------------
 * - calculateCellWidth
 * - checkIsCellOccupied
 * ========================================================================= */

import type { Allocation } from '@/models';

import { getSpanDates, type ItemDate } from './dateUtils';

/**
 * Calculates the CSS width string for a grid element based on its column span.
 *
 * @param {number} spans - The number of columns the element spans.
 * @param {number} width - The standard width of a single column.
 * @param {number} border - The border width to account for.
 * @param {number} [margin=0] - Optional margin to subtract.
 * @returns {string} The calculated width as a Tailwind arbitrary class string.
 */
export function calculateCellWidth(
  spans: number,
  width: number,
  border: number,
  margin = 0
): string {
  const spansWidth = spans * width;
  const crossBorder = (spans - 1) * border - margin;
  return `w-[${(spansWidth + crossBorder).toFixed()}px]`;
}

/**
 * Checks if a specific grid cell area is already occupied by another allocation.
 *
 * @param {ItemDate[]} dates - The full array of available dates.
 * @param {Allocation[]} allocations - The list of all current task allocations.
 * @param {Object} allocation - The allocation being tested for collision.
 * @returns {boolean} True if the area is occupied, false otherwise.
 */
export const checkIsCellOccupied = (
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
