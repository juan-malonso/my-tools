import React from 'react';
import { CreateButton, DeleteButton, Input, Select } from '@component/forms';

import { ModuleSelector, TaskSettings } from '@/components';
import { type Allocation, type Member, type Module, type Task, type Utils } from '@/models';

export const AllocationSettings: React.FC<{
  task: Task;
  tasks: Utils<Task>;
  allocation?: Allocation;
  allocations: Utils<Allocation>;
  modules: Utils<Module>;
  members: Utils<Member>;
  defaultBadgeKey: string;
}> = ({ task, tasks, allocation, allocations, modules, members, defaultBadgeKey }) => {
  const memberOptions = members.values.map((m) => ({ value: m.id, label: m.name }));

  const taskAllocations = allocations.values.filter((a) => a.taskId === task.id);
  const totalHours = taskAllocations.reduce((acc, curr) => {
    const member = members.values.find((m) => m.id === curr.memberId);
    if (!member) return acc;
    return acc + curr.span * (member.schedule.find((_, i) => i < 5) ?? 0);
  }, 0);

  const hasCollision = (current: Allocation) => {
    if (!current.memberId) return false;

    const day = 24 * 60 * 60 * 1000;
    const cStart = new Date(current.iniDate).getTime();
    const cEnd = cStart + current.span * day;

    return allocations.values.some((other) => {
      if (other.id === current.id) return false;
      if (other.memberId !== current.memberId) return false;

      const oStart = new Date(other.iniDate).getTime();
      const oEnd = oStart + other.span * day;

      return cStart < oEnd && oStart < cEnd;
    });
  };

  const handleDeleteTask = () => {
    const newAllocations = allocations.values.filter((a) => a.taskId !== task.id);
    allocations.raw(newAllocations);
    tasks.del(task.id);
  };

  return (
    <div key={task.id} className=" bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
      <div className="grid grid-cols-2 grid-cols-[auto_300px] gap-4">
        <TaskSettings task={task} setTask={tasks.set} defaultBadgeKey={defaultBadgeKey} />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <DeleteButton size="sm" onClick={handleDeleteTask} />
              <Input
                variant="secondary"
                disabled={true}
                type="text"
                value={`${totalHours.toString()}h`}
                size="sm"
                className="w-12 text-center"
              />
              <CreateButton
                size="sm"
                onClick={() => {
                  allocations.add({
                    id: crypto.randomUUID().slice(0, 8),
                    iniDate: new Date().toISOString().split('T')[0],
                    span: 1,
                    memberId: '',
                    moduleId: '',
                    taskId: task.id
                  });
                }}
              >
                Allocation
              </CreateButton>
            </div>
          </div>
          {taskAllocations
            .sort((a, b) => new Date(a.iniDate).getTime() - new Date(b.iniDate).getTime())
            .map((all, index) => {
              const isCurrent = all.id === allocation?.id;

              const member = members.values.find((m) => m.id === all.memberId);
              const memberHours = member
                ? all.span * (member.schedule.find((_, i) => i < 5) ?? 0)
                : 0;

              const isCollision = hasCollision(all);

              return (
                <div
                  key={index}
                  className={isCurrent ? 'rounded-lg border border-blue-500 bg-blue-400' : ''}
                >
                  {isCurrent && <span className="text-sm p-1">Current</span>}
                  <div
                    className={`
                      space-y-2 p-2 bg-slate-800 
                      rounded-lg border border-slate-700/50
                    `}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <Select
                        options={memberOptions}
                        value={all.memberId}
                        onChange={(e) => {
                          allocations.set({ ...all, memberId: e.target.value });
                        }}
                        size="sm"
                        className="w-full"
                        placeholder="---"
                      />
                      <ModuleSelector
                        size="sm"
                        modules={modules.values}
                        allocation={all}
                        updateAllocation={(a) => {
                          allocations.set(a);
                        }}
                      />

                      <DeleteButton
                        size="sm"
                        onClick={() => {
                          allocations.del(all.id);
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <Input
                        type="date"
                        value={all.iniDate}
                        className={`w-1/2 ${isCollision ? '!border-red-500 !text-red-500' : ''}`}
                        onChange={(e) => {
                          allocations.set({ ...all, iniDate: e.target.value });
                        }}
                        size="sm"
                      />
                      <Input
                        type="number"
                        value={all.span}
                        className="w-1/4"
                        onChange={(e) => {
                          allocations.set({ ...all, span: parseInt(e.target.value, 10) });
                        }}
                        size="sm"
                        min={1}
                      />
                      <Input
                        variant="secondary"
                        className="w-1/4"
                        disabled={true}
                        type="text"
                        value={`${memberHours.toString()}h`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
