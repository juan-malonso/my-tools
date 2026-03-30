import React, { type DragEvent, useMemo } from 'react';

import type { Resize } from '@/hooks';
import type { Allocation, ItemDate, Member, Module, Over, Task, TaskMetadata } from '@/models';
import { calculateNextFreeDate, CELL_H, CELL_W } from '@/utils';

import { TaskCell } from './TaskCell';

interface TaskRowProps {
  member: Member;
  dates: ItemDate[];
  allocations: {
    values: Allocation[];
    add: (a: Allocation) => void;
    set: (a: Allocation) => void;
  };
  absences: string[];
  modules: Module[];
  tasks: Task[];
  dragged: Allocation | undefined;
  resizing: Resize | undefined;
  over: Over | undefined;
  setOver: (over: Over | undefined) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, memberId: string, date: string) => void;
  handleDrag: (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void;
  setResizing: (resize: Resize) => void;
  onEdit: (allocation: Allocation) => void;
  addTask: (memberId: string, date: ItemDate) => () => void;
  badgeUrl: string;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  member,
  dates,
  allocations,
  absences,
  modules,
  tasks,
  dragged,
  resizing,
  over,
  setOver,
  handleDrop,
  handleDrag,
  setResizing,
  onEdit,
  addTask,
  badgeUrl
}) => {
  const memberTasks = useMemo(
    () => allocations.values.filter((a) => a.memberId === member.id),
    [allocations.values, member.id]
  );

  const cells = useMemo(() => {
    let currentSpan = 0;

    return dates.map((date, j) => {
      const allocation = memberTasks.find((a) => dragged?.id !== a.id && a.iniDate === date.label);

      currentSpan = Math.max(currentSpan, allocation?.span ?? 0);

      const next = calculateNextFreeDate(dates, memberTasks, j);

      const cell: TaskMetadata = {
        member,
        date,
        task: allocation?.id,
        span: currentSpan,
        next: next?.label,
        dragging: !!dragged,
        resizing: !!resizing
      };

      if (currentSpan > 0) currentSpan--;

      return { cell, allocation };
    });
  }, [dates, memberTasks, member, dragged, resizing]);

  return (
    <tr
      className={`divide-x-2 w-full border-b-2 border-slate-500`}
      style={{ height: CELL_H, width: CELL_W * dates.length }}
    >
      {cells.map(({ cell, allocation }, j) => (
        <TaskCell
          key={j}
          index={j}
          cell={cell}
          allocation={allocation}
          addAllocation={allocations.add}
          setAllocation={allocations.set}
          isAbsence={absences.includes(cell.date.label)}
          modules={modules}
          tasks={tasks}
          addTask={addTask(member.id, cell.date)}
          over={over}
          setOver={setOver}
          handleDrop={handleDrop}
          handleDrag={handleDrag}
          setResizing={setResizing}
          onEdit={onEdit}
          badgeUrl={badgeUrl}
        />
      ))}
    </tr>
  );
};
