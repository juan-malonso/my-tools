import type { ItemDate } from './handlers';
import type { Resize } from '../hooks/useResize';

import type { DragEvent, MouseEvent } from 'react';

import type { Over } from '@/components/features/task-planner/components/table/DateCell';
import type { Allocation, Member } from '@/models';

export const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

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

export const onResize =
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
