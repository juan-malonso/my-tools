import React from 'react';

import { type Task, type Utils } from '@/models';

import { TaskRow } from './TaskRow';

interface TasksSettingsProps {
  tasks: Utils<Task>;
  search: string;
  setSearch: (search: string) => void;
  filteredTasks: Task[];
  defaultBadgeKey: string;
}

export const TasksSettings: React.FC<TasksSettingsProps> = ({
  search,
  setSearch,
  filteredTasks,
  defaultBadgeKey,
  tasks
}) => {
  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Task Management</h3>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-64 bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
        />
      </div>
      <hr className="border-slate-600" />
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            setTask={tasks.set}
            defaultBadgeKey={defaultBadgeKey}
          />
        ))}
      </div>
    </div>
  );
};

