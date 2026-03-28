/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file gridConstants.ts
 *
 * --- Description -------------------------------------------------------------
 * @description Defines layout dimensions and styling constants for the grid.
 *
 * --- Constants ---------------------------------------------------------------
 * - DATE_H, WEEK_H, MONTH_H, CELL_H, CELL_W, USER_W, cellHSize, cellStyle
 * ========================================================================= */

export const DATE_H = 40;
export const WEEK_H = 40;
export const MONTH_H = 40;

export const CELL_H = 120;
export const CELL_W = 150;
export const USER_H = CELL_H;
export const USER_W = 250;

export const cellHSize = 70;
export const cellStyle = `'h-[${cellHSize.toFixed()}] w-[${CELL_W.toFixed()}px] border-2 border-gray-200 text-center`;
