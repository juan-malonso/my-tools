import React from 'react';

import { Input } from '@component/forms';

import { type Task, type Utils } from '@/models';

import { TaskSettings } from '../components/task/TaskSettings';

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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white">Task Management</h3>
        <Input
          value={search}
          size="sm"
          className="w-1/3"
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <hr className="border-slate-600" />
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskSettings
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
