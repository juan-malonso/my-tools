import React from 'react';

import { Select } from '@component/forms';

import type { Allocation, Task } from '@/models';

export const TaskSelector: React.FC<{
  className: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tasks: Task[];
  allocation: Allocation;
  updateAllocation: (allocation: Allocation) => void;
}> = ({ className, size, tasks, allocation, updateAllocation }) => {
  const value = allocation.taskId;
  const options = tasks.map((t) => ({
    value: t.id,
    label: t.title
  }));

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAllocation({ ...allocation, taskId: e.target.value });
  };

  return (
    <Select className={className} size={size} value={value} options={options} onChange={onChange} />
  );
};
