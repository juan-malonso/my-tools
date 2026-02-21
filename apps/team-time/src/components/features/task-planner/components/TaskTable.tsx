import React from 'react';

import type { Allocation, Config, Member, Task } from '@/models';

import { useDrag } from '../hooks/useDrag';
import { useResize } from '../hooks/useResize';
import { CreateMemberBox } from './CreateMemberBox';
import { MemberBox } from './MemberBox';
import { DateCell, type Over } from './DateCell';
import { getDates, type ItemDate, CELL_H, DATE_H, CELL_W } from '../utils/handlers';

interface TaskTableProps {
  config: Config;
}

export const TaskTable: React.FC<TaskTableProps> = ({ config }) => {
  const { general, members, allocations, modules, tasks } = config;

  const dates = getDates(general.iniDate, general.endDate);
  const [resizing, setResizing] = useResize(dates, allocations);
  const [handleDrag, handleDrop, dragged] = useDrag(dates, allocations);

  const [isOver, setIsOver] = React.useState<Over | null>(null);

  const addTask = (memberId: string, date: ItemDate) => () => {
    const task: Task = {
      id: Math.random().toString(16).slice(2, 10),
      title: 'Nueva Tarea',
      description: 'Descripción por defecto',
      ticket: []
    };

    const allocation: Allocation = {
      id: Math.random().toString(16).slice(2, 10),

      iniDate: date.label,
      span: 1,

      memberId,
      moduleId: '',
      taskId: task.id
    };

    tasks.add(task);
    allocations.add(allocation);

    console.log('addTask', memberId, date);
  };

  const addMember = () => {
    const member: Member = {
      id: Math.random().toString(16).slice(2, 10),
      name: 'New Member'
    };
    members.add(member);
  };

  return (
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
              <MemberBox key={i} member={member} />
              {dates.map((date, j) => {
                const allocation = memberTasks.find((a) => a.iniDate === date.label);
                const allocationSpan = allocation?.span ?? 0;

                // This logic determines if a cell should be empty because it is "spanned over"
                // by a task from a previous day. `remainingSpan` is a countdown of days
                // covered by a task. If a task has a span > 1, this will be > 0 for
                // the next cells in the row.
                remainingSpan = Math.max(remainingSpan, allocationSpan) - 1;

                return (
                  <DateCell
                    key={j}
                    member={member}
                    date={date}
                    dates={dates}
                    allocations={allocations.values}
                    resizing={resizing}
                    dragged={dragged}
                    isOver={isOver}
                    setIsOver={setIsOver}
                    memberTasks={memberTasks}
                    remainingSpan={remainingSpan}
                    modules={modules.values}
                    tasks={tasks.values}
                    handleDrop={handleDrop}
                    handleDrag={handleDrag}
                    addTask={addTask}
                    setResizing={setResizing}
                    dateIndex={j}
                  />
                );
              })}
            </tr>
          );
        })}

        <tr className={`w-full`} style={{ height: DATE_H }}>
          <CreateMemberBox onClick={addMember} />
          <td colSpan={1 + dates.length} />
        </tr>

        <tr />
      </tbody>
    </table>
  );
};
