import type { ItemDate } from './handlers';
import type { Over } from '../components/DateCell';
import type { Resize } from '../hooks/useResize';

import type { DragEvent, MouseEvent } from 'react';

import type { Allocation, Member } from '@/models';

import { isCellOccupied } from './handlers';

export const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

export const handleDragEnter =
  (options: {
    member: Member;
    date: ItemDate;
    dates: ItemDate[];
    allocations: Allocation[];
    isOver: Over | null;
    setIsOver: (over: Over | null) => void;
    dragged: Allocation | undefined;
  }) =>
  (e: DragEvent<HTMLDivElement>) => {
    const { member, date, dates, allocations, isOver, setIsOver, dragged } = options;
    e.preventDefault();
    if (member.id !== isOver?.memberId || date.label !== isOver.dateLabel) {
      setIsOver({
        memberId: member.id,
        dateLabel: date.label,
        span: dragged?.span ?? 0,
        isOccupied: isCellOccupied(dates, allocations, {
          id: dragged?.id ?? '',
          memberId: member.id,
          iniDate: date.label,
          span: dragged?.span ?? 0
        })
      });
    }
  };

export const handleDropEvent =
  (
    member: Member,
    date: ItemDate,
    setIsOver: (over: Over | null) => void,
    handleDrop: (e: DragEvent<HTMLDivElement>, memberId: string, date: string) => void
  ) =>
  (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(null);
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
