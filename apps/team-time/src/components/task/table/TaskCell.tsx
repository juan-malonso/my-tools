import React, { type DragEvent } from 'react';

import type { Resize } from '@/hooks';
import type { Allocation, Module, Over, Task, TaskMetadata } from '@/models';
import {
  CELL_H,
  CELL_W,
  handleDragEnter,
  handleDragOver,
  handleDropEvent,
  handleResizeStart
} from '@/utils';

import { DropBox, HolderBox, TaskBox } from '../card';

interface TaskCellProps {
  index: number;
  cell: TaskMetadata;
  allocation?: Allocation;
  addAllocation: (allocation: Allocation) => void;
  setAllocation: (allocation: Allocation) => void;
  modules: Module[];
  tasks: Task[];
  addTask: () => void;
  over: Over | undefined;
  setOver: (over: Over | undefined) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, memberId: string, date: string) => void;
  handleDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  setResizing: (resize: Resize) => void;
  onEdit: (allocation: Allocation) => void;
  badgeUrl: string;
}

export const TaskCell: React.FC<TaskCellProps> = ({
  index,
  cell,
  allocation,
  addAllocation,
  setAllocation,
  modules,
  tasks,
  addTask,
  over,
  setOver,
  handleDrop,
  handleDrag,
  setResizing,
  onEdit,
  badgeUrl
}) => {
  const { isResizing, isOver, isTask, showHolder, bgColor } = getRenderState(
    cell,
    over,
    allocation
  );

  const onDuplicate = (a: Allocation) => {
    if (cell.next) {
      addAllocation({
        id: crypto.randomUUID().slice(0, 8),
        iniDate: cell.next,
        span: 1,
        memberId: a.memberId,
        moduleId: a.moduleId,
        taskId: a.taskId
      });
    }
  };

  const onDragEnter = handleDragEnter({
    member: cell.member.id,
    date: cell.date.label,
    span: cell.span,
    over,
    setOver
  });

  const onDragDrop = handleDropEvent(cell.member, cell.date, setOver, handleDrop);

  let children = <></>;

  if (isTask && !!allocation) {
    children = (
      <div className="relative h-full w-full z-10">
        <div key="taskbox" className="absolute h-full w-full top-0 left-0">
          <TaskBox
            allocation={allocation}
            tasks={tasks}
            modules={modules}
            onResize={handleResizeStart(allocation, index, setResizing)}
            onDrag={handleDrag}
            updateAllocation={setAllocation}
            onDuplicate={onDuplicate}
            onEdit={onEdit}
            isResizing={isResizing}
            badgeUrl={badgeUrl}
          />
        </div>
      </div>
    );
  } else if (isOver) {
    children = (
      <div className="relative h-full w-full ">
        <div className="absolute h-full w-full top-0 left-0">
          <DropBox span={over?.span ?? 0} block={false} />
        </div>
      </div>
    );
  } else if (showHolder) {
    children = (
      <div className="relative h-full w-full ">
        <div key="createbox" className="absolute h-full w-full top-0 left-0">
          <HolderBox onClick={addTask} />
        </div>
      </div>
    );
  }

  return (
    <td
      className={`border-2 border-slate-500 relative ${bgColor}`}
      onDragOver={handleDragOver}
      onDragEnter={onDragEnter}
      onDrop={onDragDrop}
    >
      <div style={{ height: CELL_H, width: CELL_W }}>{children}</div>
    </td>
  );
};

const getRenderState = (cell: TaskMetadata, over?: Over, allocation?: Allocation) => {
  const isOver = over?.memberId === cell.member.id && over.dateLabel === cell.date.label;
  const isTask = !!cell.task && allocation?.id === cell.task;

  const isResizing = cell.resizing;
  const isDragging = cell.dragging;
  const isTaskExtension = cell.span > 0;
  const showHolder = !isTaskExtension && !isResizing && !isDragging;

  let bgColor = '';
  switch (true) {
    case cell.isAbsence:
      bgColor = 'bg-yellow-600/30';
      break;
    case !cell.workingDay:
      bgColor = 'bg-[rgba(0,0,0,0.3)]';
      break;
    default:
      break;
  }

  return { isOver, isTask, isResizing, isTaskExtension, showHolder, bgColor };
};
