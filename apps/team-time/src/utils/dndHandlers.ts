/** ============================================================================
 * --- Name --------------------------------------------------------------------
 * @file dndHandlers.ts
 *
 * --- Description -------------------------------------------------------------
 * @description Provides event handlers for drag-and-drop and resizing interactions
 * within the Task Planner grid cells.
 *
 * --- Functions ---------------------------------------------------------------
 * - handleDragOver
 * - handleDragEnter
 * - handleDropEvent
 * - handleResizeStart
 * ========================================================================= */

import type { DragEvent, MouseEvent } from 'react';

import type { Resize } from '@/hooks';
import type { Allocation, ItemDate, Member, Over } from '@/models';

/**
 * Handles the dragOver event to allow elements to be dropped inside the cell.
 *
 * @param {DragEvent<HTMLDivElement>} e - The React drag event.
 */
export const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

/**
 * Creates a handler for the dragEnter event to update the visual drop indicator (Over state).
 *
 * @param {Object} params - The configuration for the drag enter event.
 * @param {string} params.member - The ID of the member row being entered.
 * @param {string} params.date - The date label of the cell being entered.
 * @param {number} params.span - The width/span of the dragged item.
 * @param {Over | undefined} params.over - The current drop target state.
 * @param {Function} params.setOver - State setter for the drop target.
 * @returns {(e: DragEvent<HTMLDivElement>) => void} The dragEnter event handler.
 */
export const handleDragEnter =
  ({
    member,
    date,
    span,
    over,
    setOver
  }: {
    member: string;
    date: string;
    span: number;
    over: Over | undefined;
    setOver: (over: Over | undefined) => void;
  }) =>
  (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (member !== over?.memberId || date !== over.dateLabel) {
      setOver({
        memberId: member,
        dateLabel: date,
        span: over ? over.span : span
      });
    }
  };

/**
 * Creates a handler for the drop event, clearing the target state and triggering the main drop logic.
 *
 * @param {Member} member - The member row where the item is dropped.
 * @param {ItemDate} date - The date cell where the item is dropped.
 * @param {Function} setOver - State setter to clear the drop target indicator.
 * @param {Function} handleDrop - The main drop logic callback.
 * @returns {(e: DragEvent<HTMLDivElement>) => void} The drop event handler.
 */
export const handleDropEvent =
  (
    member: Member,
    date: ItemDate,
    setOver: (over: Over | undefined) => void,
    handleDrop: (e: DragEvent<HTMLDivElement>, memberId: string, date: string) => void
  ) =>
  (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOver(undefined);
    handleDrop(e, member.id, date.label);
  };

/**
 * Creates a handler to initiate the resizing of an allocation block.
 *
 * @param {Allocation | undefined} allocation - The allocation being resized.
 * @param {number} dateIndex - The starting grid index of the allocation.
 * @param {Function} setResizing - State setter to initialize the resize state.
 * @returns {(e: MouseEvent, allocationId: string, direction: 'left' | 'right') => void} The resize start handler.
 */
export const handleResizeStart =
  (allocation: Allocation | undefined, dateIndex: number, setResizing: (resize: Resize) => void) =>
  (e: MouseEvent, allocationId: string, direction: 'left' | 'right') => {
    if (allocation) {
      setResizing({
        allocationId,
        direction,
        startX: e.clientX,
        initialSpan: allocation.span,
        initialDateIndex: dateIndex
      });
    }
  };
