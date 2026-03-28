import React from 'react';

import type { Allocation, Config, Task } from '@/models';

import { type CellMetadata, DateCell, type Over } from './DateCell';
import { useDrag } from '../../hooks/useDrag';
import { useResize } from '../../hooks/useResize';
import { getDates, type ItemDate, CELL_H, CELL_W } from '../../utils';
import { TaskEdit } from '../task';

interface TaskTableProps {
  config: Config;
}

export const TaskTable: React.FC<TaskTableProps> = ({ config }) => {
  const { general, members, allocations, modules, tasks } = config;

  const dates = getDates(general.iniDate, general.endDate);
  const [resizing, setResizing] = useResize(dates, allocations);
  const [handleDrag, handleDrop, dragged] = useDrag(dates, allocations);

  const [over, setOver] = React.useState<Over | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedAllocation, setSelectedAllocation] = React.useState<Allocation | null>(null);

  const handleEdit = (allocation: Allocation) => {
    setSelectedAllocation(allocation);
    setIsEditModalOpen(true);
  };

  const addTask = (memberId: string, date: ItemDate) => () => {
    const task: Task = {
      id: crypto.randomUUID().slice(0, 8),
      title: 'New Task',
      description: 'Default description',
      ticket: []
    };

    const allocation: Allocation = {
      id: crypto.randomUUID().slice(0, 8),

      iniDate: date.label,
      span: 1,

      memberId,
      moduleId: '',
      taskId: task.id
    };

    tasks.add(task);
    allocations.add(allocation);
  };

  return (
    <>
      <table className={`h-full w-full rounded-2xl`}>
        <tbody>
          {members.values.map((member, i) => {
            const memberTasks = allocations.values.filter((a) => a.memberId === member.id);

            let remainingSpan = 0;

            return (
              <tr
                key={i}
                className={`divide-x-2 w-full border-b-2 border-slate-500`}
                style={{ height: CELL_H, width: CELL_W * dates.length }}
              >
                {dates.map((date, j) => {
                  const allocation = memberTasks.find(
                    (a) => dragged?.id !== a.id && a.iniDate === date.label
                  );

                  remainingSpan = Math.max(remainingSpan, allocation?.span ?? 0) - 1;

                  const next = findNextFreeCell(dates, allocations.values, j);

                  const cell: CellMetadata = {
                    member,
                    date,

                    task: allocation?.id,
                    span: remainingSpan + 1,
                    next: next?.label,

                    dragging: !!dragged,
                    resizing: !!resizing
                  };

                  return (
                    <DateCell
                      key={j}
                      index={j}
                      cell={cell}
                      allocation={allocation}
                      addAllocation={allocations.add}
                      setAllocation={allocations.set}
                      modules={modules.values}
                      tasks={tasks.values}
                      addTask={addTask(member.id, date)}
                      over={over}
                      setOver={setOver}
                      handleDrop={handleDrop}
                      handleDrag={handleDrag}
                      setResizing={setResizing}
                      onEdit={handleEdit}
                    />
                  );
                })}
              </tr>
            );
          })}

          <tr />
        </tbody>
      </table>
      <TaskEdit
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        allocation={selectedAllocation}
        tasks={tasks}
        modules={modules}
        onDeleteAllocation={allocations.del}
        defaultBadgeKey={config.general.defaultBadgeKey}
      />
    </>
  );
};

function findNextFreeCell(
  dates: ItemDate[],
  allocations: Allocation[],
  dateOffset: number
): ItemDate | undefined {
  for (let i = dateOffset; i < dates.length; i++) {
    const date = dates[i];
    const allocation = allocations.find((a) => a.iniDate === date.label);

    if (!allocation) return date;
    i += allocation.span - 1;
  }
}
