import React from 'react';

import { CreateButton, Input } from '@component/forms';

import { PageIcon } from '@/components/common/icons';
import { type Module, type Allocation, type Member, type Task, type Utils } from '@/models';

import { AllocationSettings } from '../components/allocation/AllocationSettings';

interface TasksSettingsProps {
  tasks: Utils<Task>;
  allocations: Utils<Allocation>;
  members: Utils<Member>;
  modules: Utils<Module>;
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
  tasks,
  allocations,
  members,
  modules
}) => {
  const addTask = () => {
    tasks.add({
      id: crypto.randomUUID().slice(0, 8),
      title: 'New Task',
      description: 'Default description',
      ticket: []
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
          <PageIcon className="w-6 h-6 text-sky-500" />
          Task Management
        </h3>
        <div className="flex gap-2 items-center w-1/2 justify-end">
          <Input
            value={search}
            size="sm"
            className="w-full"
            placeholder="Search..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <CreateButton size="sm" onClick={addTask} className="text-nowrap">
            Add Task
          </CreateButton>
        </div>
      </div>
      <hr className="border-slate-600" />
      <div className="space-y-3">
        {filteredTasks.map((task, index) => {
          return (
            <AllocationSettings
              key={index}
              task={task}
              tasks={tasks}
              allocations={allocations}
              modules={modules}
              members={members}
              defaultBadgeKey={defaultBadgeKey}
            />
          );
        })}
      </div>
    </div>
  );
};
