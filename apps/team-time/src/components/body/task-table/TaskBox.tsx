import React, { type DragEvent } from 'react';

import type { Allocation, Module, Task } from '@/models';

import { CELL_W } from '../utils';

function calcWidth(span: number, margin = 5, border = 2) {
  return CELL_W * span - margin * 2 + (span - 1) * border;
}

export const TaskBox: React.FC<{
  allocation: Allocation;
  modules: Module[];
  tasks: Task[];
  onResize: (e: React.MouseEvent, allocationId: string, direction: 'left' | 'right') => void;
  onDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  isResizing: boolean;
}> = ({ allocation, modules, tasks, onResize, onDrag, isResizing }) => {
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

  return (
    <div className="h-full w-full p-[5px] overflow-visible" onClick={handleClick}>
      <div
        draggable
        onDrag={handleDrag}
        style={{ width: calcWidth(allocation.span, 5, 2) }}
        className={`h-full 
            border border-slate-600 rounded-lg
            bg-slate-500 text-slate-200
            overflow-hidden relative
            shadow-[0_0_5px] shadow-slate-900
          `}
      >
        <TaskBoxResize
          position="left"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            onResize(e, allocation.id, 'left');
          }}
        />
        <TaskBoxModule module={mod} />
        <div className="p-1 pl-4 flex flex-col">
          <div className="text-md text-left">{task.title}</div>
          <div className="text-sm text-left text-gray-900">
            <div>{task.description}</div>
            <div>{mod?.name}</div>
          </div>
        </div>
        <TaskBoxResize
          position="right"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            onResize(e, allocation.id, 'right');
          }}
        />
      </div>
    </div>
  );
};

const TaskBoxModule: React.FC<{ module?: Module }> = ({ module }) => {
  return (
    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${module?.color ?? 'bg-gray-400'}`} />
  );
};

const TaskBoxResize: React.FC<{
  position: 'left' | 'right';
  onResize: (e: React.MouseEvent) => void;
}> = ({ position, onResize }) => {
  return (
    <div
      className={`absolute 
          w-8 ${position}-0 top-0 bottom-0 
          cursor-ew-resize z-20
          opacity-0 hover:opacity-100
          flex ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}
        `}
      onMouseDown={onResize}
    >
      <div className={`top-0 bottom-0 w-2.5 bg-gray-700/50`} />
    </div>
  );
};
