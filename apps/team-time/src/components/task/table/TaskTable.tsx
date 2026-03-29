import React from 'react';

import { useDrag, useResize } from '@/hooks';
import type { Allocation, Config, ItemDate, Over, Task } from '@/models';
import { getDates } from '@/utils';

import { TaskEdit } from '../modal';

import { TaskRow } from './TaskRow';

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
            return (
              <TaskRow
                key={i}
                member={member}
                dates={dates}
                allocations={allocations}
                absences={member.absences}
                modules={modules.values}
                tasks={tasks.values}
                dragged={dragged}
                resizing={resizing}
                over={over}
                setOver={setOver}
                handleDrop={handleDrop}
                handleDrag={handleDrag}
                setResizing={setResizing}
                onEdit={handleEdit}
                addTask={addTask}
              />
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
        allocations={allocations}
        members={members}
        modules={modules}
        defaultBadgeKey={config.general.defaultBadgeKey}
      />
    </>
  );
};
