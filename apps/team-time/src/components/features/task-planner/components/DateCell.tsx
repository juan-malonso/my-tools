import React, { type DragEvent } from 'react';

import type { Allocation, Member, Module, Task } from '@/models';

import type { Resize } from '../hooks/useResize';
import { type ItemDate, CELL_H, CELL_W } from '../utils/handlers';

import { CellBox, type CellBoxProps } from './CellBox';
import { handleDragEnter, handleDragOver, handleDropEvent, onResize } from '../utils/dnd-handlers';

export interface Over {
  memberId: string;
  dateLabel: string;
  isOccupied: boolean;
  span: number;
}

interface DateCellProps {
  member: Member;
  date: ItemDate;
  dates: ItemDate[];
  allocations: Allocation[];
  resizing: Resize | null;
  dragged: Allocation | undefined;
  isOver: Over | null;
  setIsOver: (over: Over | null) => void;
  memberTasks: Allocation[];
  remainingSpan: number;
  modules: Module[];
  tasks: Task[];
  handleDrop: (e: DragEvent<HTMLDivElement>, memberId: string, date: string) => void;
  handleDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  addTask: (memberId: string, date: ItemDate) => () => void;
  setResizing: (resize: Resize) => void;
  dateIndex: number;
}

const getRenderState = (options: {
  resizing: Resize | null;
  allocationSpan: number;
  remainingSpan: number;
  dragged: Allocation | undefined;
  allocation: Allocation | undefined;
}) => {
  const { resizing, allocationSpan, remainingSpan, dragged, allocation } = options;
  const hasTask = allocationSpan > 0;
  const isResizing = !!resizing;
  const isDragged = allocation?.id === dragged?.id;
  const isSpannedByAllocation = allocationSpan !== remainingSpan + 1 && dragged === undefined;

  return { hasTask, isResizing, isDragged, isSpannedByAllocation };
};

const renderCellBox = (
  isResizing: boolean,
  isSpannedByAllocation: boolean,
  hasTask: boolean,
  props: CellBoxProps
) => {
  if (!(isResizing || isSpannedByAllocation) || hasTask) {
    return <CellBox {...props} />;
  }
  return <></>;
};

export const DateCell: React.FC<DateCellProps> = ({
  member,
  date,
  dates,
  allocations,
  resizing,
  dragged,
  isOver,
  setIsOver,
  memberTasks,
  remainingSpan,
  modules,
  tasks,
  handleDrop,
  handleDrag,
  addTask,
  setResizing,
  dateIndex
}) => {
  const allocation = memberTasks.find((a) => a.iniDate === date.label);
  const allocationSpan = allocation?.span ?? 0;

  const { hasTask, isResizing, isDragged, isSpannedByAllocation } = getRenderState({
    resizing,
    allocationSpan,
    remainingSpan,
    dragged,
    allocation
  });

  return (
    <td
      className={`border-transparent`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter({
        member,
        date,
        dates,
        allocations,
        isOver,
        setIsOver,
        dragged
      })}
      onDrop={handleDropEvent(member, date, setIsOver, handleDrop)}
    >
      <div style={{ height: CELL_H, width: CELL_W }}>
        {renderCellBox(isResizing, isSpannedByAllocation, hasTask, {
          allocation,
          modules,
          tasks,
          addTask: addTask(member.id, date),
          onDrag: handleDrag,
          onResize: onResize(allocation, dateIndex, setResizing),
          isResizing,
          isDragged,
          dragged,
          isOver: {
            enable: member.id === isOver?.memberId && date.label === isOver.dateLabel,
            block: isOver?.isOccupied ?? false,
            span: isOver?.span ?? 0
          }
        })}
      </div>
    </td>
  );
};
