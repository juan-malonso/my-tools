import React, { type DragEvent } from 'react';
import { CloneIcon, PencilIcon } from '@component/icons';

import type { Allocation, Module, Task } from '@/models';
import { CELL_W } from '@/utils';

import { TaskBoxActions, TaskBoxContent, TaskBoxModule, TaskBoxResize } from './sections';

function calcWidth(span: number, margin = 5, border = 2) {
  return CELL_W * span - margin * 2 + (span - 1) * border + 3;
}

export const TaskBox: React.FC<{
  allocation: Allocation;
  modules: Module[];
  tasks: Task[];
  onResize: (e: React.MouseEvent, allocationId: string, direction: 'left' | 'right') => void;
  onDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  updateAllocation: (allocation: Allocation) => void;
  onDuplicate: (allocation: Allocation) => void;
  onEdit: (allocation: Allocation) => void;
  isResizing: boolean;
}> = ({
  allocation,
  modules,
  tasks,
  onResize,
  onDrag,
  updateAllocation,
  onDuplicate,
  onEdit,
  isResizing
}) => {
  const task = tasks.find((t) => t.id === allocation.taskId);
  const mod = modules.find((m) => m.id === allocation.moduleId);

  if (!task) {
    return (
      <div className="p-2 h-full w-full">
        <div className="h-full p-2 bg-red-800 rounded-lg text-slate-100">Error!!</div>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isResizing) {
      e.stopPropagation();
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (isResizing) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    onDrag(e, allocation);
  };

  const actions: { onClick: () => void; children: React.ReactNode }[] = [
    {
      onClick: () => {
        onDuplicate(allocation);
      },
      children: <CloneIcon className="h-3.5 w-3.5" />
    },
    {
      onClick: () => {
        onEdit(allocation);
      },
      children: <PencilIcon className="h-3.5 w-3.5" />
    }
  ];

  return (
    <div className="h-full w-full p-[5px] overflow-visible" onClick={handleClick}>
      <div
        draggable={!isResizing}
        onDrag={handleDrag}
        style={{ width: calcWidth(allocation.span, 5, 2) }}
        className={`h-full group
          border border-slate-300/50 rounded-lg
          bg-white/25 text-white
          overflow-hidden relative
          shadow-lg shadow-black/60
          transition-colors duration-200
        `}
      >
        <TaskBoxModule module={mod} />

        <TaskBoxResize
          position="left"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onResize(e, allocation.id, 'left');
          }}
        />
        <TaskBoxResize
          position="right"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onResize(e, allocation.id, 'right');
          }}
        />

        <TaskBoxContent
          allocation={allocation}
          task={task}
          module={mod}
          modules={modules}
          actions={actions}
          updateAllocation={updateAllocation}
        />
        <TaskBoxActions module={mod} actions={actions} />
      </div>
    </div>
  );
};
