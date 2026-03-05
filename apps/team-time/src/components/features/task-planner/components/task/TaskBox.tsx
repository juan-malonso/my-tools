import React, { type DragEvent } from 'react';

import { CloneIcon } from '@/components/common/icons';
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
  isResizing: boolean;
}> = ({
  allocation,
  modules,
  tasks,
  onResize,
  onDrag,
  onUpdateAllocation,
  onDuplicate,
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
              <TaskBoxModuleSelector
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

        <TaskBoxActions module={mod} allocation={allocation} onDuplicate={onDuplicate} />

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

const TaskBoxModule: React.FC<{ module?: Module }> = ({ module }) => {
  return (
    <div
      style={{ backgroundColor: module?.color ?? '#9ca3af' }}
      className={`absolute left-0 top-0 bottom-0 w-1.5`}
    />
  );
};

const TaskBoxModuleSelector: React.FC<{
  modules: Module[];
  allocation: Allocation;
  onUpdateAllocation: (allocation: Allocation) => void;
}> = ({ modules, allocation, onUpdateAllocation }) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateAllocation({ ...allocation, moduleId: e.target.value });
  };

  return (
    <select
      className={`bg-white text-slate-800 text-sm
          border border-slate-500 rounded 
          focus:outline-none focus:ring-0 focus:border-slate-300`}
      value={allocation.moduleId}
      onChange={onChange}
    >
      {[{ id: '---', key: '---' } as Module, ...modules].map((mod, i) => (
        <option key={i} value={mod.id} className="text-black">
          {mod.key}
        </option>
      ))}
    </select>
  );
};

const TaskBoxActions: React.FC<{
  module?: Module;
  allocation: Allocation;
  onDuplicate: (allocation: Allocation) => void;
}> = ({ module, allocation, onDuplicate }) => {
  const actions: { onClick: () => void; children: React.ReactNode }[] = [
    {
      onClick: () => {
        onDuplicate(allocation);
      },
      children: <CloneIcon className="h-4 w-4 text-slate-100" />
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
              p-1.5 rounded-lg 
              shadow-sm hover:brightness-110
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
