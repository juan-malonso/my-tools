import React from 'react';

import type { Allocation, Task } from '@/models';

export const TaskSelector: React.FC<{
  className: string;
  tasks: Task[];
  allocation: Allocation;
  onUpdateAllocation: (allocation: Allocation) => void;
}> = ({ className, tasks, allocation, onUpdateAllocation }) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateAllocation({ ...allocation, taskId: e.target.value });
  };

  return (
    <select
      className={` 
          w-full px-2 py-1 
          bg-slate-900/50
          border border-slate-600 rounded-lg focus:border-sky-500
          focus:ring-1 focus:ring-sky-500 outline-none transition-all
          text-white ${className}
        `}
      value={allocation.taskId}
      onChange={onChange}
    >
      {tasks.map((task) => (
        <option key={task.id} value={task.id} className="text-black bg-slate-200">
          {task.title}
        </option>
      ))}
    </select>
  );
};
