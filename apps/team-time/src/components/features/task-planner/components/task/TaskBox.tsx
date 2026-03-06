import React, { type DragEvent } from 'react';

import { CloneIcon, PencilIcon } from '@/components/common/icons';
import { CELL_W } from '@/components/features/task-planner';
import type { Allocation, Module, Task } from '@/models';

function calcWidth(span: number, margin = 5, border = 2) {
  return CELL_W * span - margin * 2 + (span - 1) * border;
}

export const TaskBox: React.FC<{
  allocation: Allocation;
  modules: Module[];
  tasks: Task[];
  onResize: (e: React.MouseEvent, allocationId: string, direction: 'left' | 'right') => void;
  onDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  onUpdateAllocation: (allocation: Allocation) => void;
  onDuplicate: (allocation: Allocation) => void;
  onEdit: (allocation: Allocation) => void;
  isResizing: boolean;
}> = ({
  allocation,
  modules,
  tasks,
  onResize,
  onDrag,
  onUpdateAllocation,
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
        <TaskBoxResize
          position="left"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onResize(e, allocation.id, 'left');
          }}
        />

        <TaskBoxModule module={mod} />

        <div className="p-1 pl-3 flex flex-col gap-1">
          <div className="text-sm line-clamp-2 leading-tight">
            <div className="inline-block align-middle mr-1.5 h-full">
              <ModuleSelector
                modules={modules}
                allocation={allocation}
                onUpdateAllocation={onUpdateAllocation}
              />
            </div>

            <span className="text-md font-medium">{task.title}</span>
          </div>

          <div className="text-xs text-slate-300 truncate w-full" title={task.description}>
            {task.description}
          </div>

          <div className="flex gap-1 flex-wrap mt-1">
            {task.ticket.map((t, i) => (
              <TaskBoxBadget key={i} module={mod}>
                {t.id}
              </TaskBoxBadget>
            ))}
          </div>
        </div>

        <TaskBoxActions
          module={mod}
          allocation={allocation}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
        />

        <TaskBoxResize
          position="right"
          onResize={(e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            onResize(e, allocation.id, 'right');
          }}
        />
      </div>
    </div>
  );
};

const TaskBoxBadget: React.FC<{ module?: Module; children: React.ReactNode }> = ({
  module,
  children
}) => {
  return (
    <div
      style={{ backgroundColor: module?.color ?? '#9ca3af' }}
      className={`px-1 py-0.5 rounded text-nowrap
      text-slate-50 text-xs
    `}
    >
      {children}
    </div>
  );
};

import { ModuleSelector } from '../selectors/ModuleSelector';

const TaskBoxModule: React.FC<{ module?: Module }> = ({ module }) => {
  return (
    <div
      style={{ backgroundColor: module?.color ?? '#9ca3af' }}
      className={`absolute left-0 top-0 bottom-0 w-1.5`}
    />
  );
};

const TaskBoxActions: React.FC<{
  module?: Module;
  allocation: Allocation;
  onDuplicate: (allocation: Allocation) => void;
  onEdit: (allocation: Allocation) => void;
}> = ({ module, allocation, onDuplicate, onEdit }) => {
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
    <div
      className={`
          absolute bottom-1 right-1 flex gap-1 z-30 
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        `}
    >
      {actions.map(({ onClick, children }, i) => (
        <button
          key={i}
          style={{ backgroundColor: module?.color ?? '#9ca3af' }}
          className={`
              p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700
              shadow-sm hover:brightness-125 border border-slate-50
            `}
          onClick={onClick}
        >
          {children}
        </button>
      ))}
    </div>
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
