import React, { type DragEvent } from 'react';

import type { Allocation, Module, Task } from '@/models';

import { CreateTaskBox } from './CreateTaskBox';
import { DropBox } from './DropBox';
import { TaskBox } from './TaskBox';

export interface CellBoxProps {
  allocation: Allocation | undefined;
  modules: Module[];
  tasks: Task[];
  addTask: () => void;
  onResize: (e: React.MouseEvent, allocationId: string, direction: 'left' | 'right') => void;
  onDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  isResizing: boolean;
  isDragged: boolean;
  dragged: Allocation | undefined;
  isOver: { enable: boolean; block: boolean; span: number };
}

export const CellBox: React.FC<CellBoxProps> = ({
  allocation,
  modules,
  tasks,
  addTask,
  onResize,
  onDrag,
  isResizing,
  isDragged,
  dragged,
  isOver
}) => {
  const data = [];

  if (isOver.enable) {
    data.push(
      <div className="absolute h-full w-full top-0 left-0">
        <DropBox span={isOver.span} block={isOver.block} />
      </div>
    );
  }

  if (allocation) {
    if (isResizing || !isDragged) {
      data.push(
        <div className="absolute h-full w-full top-0 left-0">
          <TaskBox
            allocation={allocation}
            tasks={tasks}
            modules={modules}
            onResize={onResize}
            onDrag={onDrag}
            isResizing={isResizing}
          />
        </div>
      );
    }
  } else if (!dragged) {
    data.push(
      <div className="absolute h-full w-full top-0 left-0">
        <CreateTaskBox onClick={addTask} />
      </div>
    );
  }

  return <div className="relative h-full w-full ">{data}</div>;
};
