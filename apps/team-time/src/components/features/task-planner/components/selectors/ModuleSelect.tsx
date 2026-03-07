import React from 'react';

import { Select } from '@component/forms';

import type { Allocation, Module } from '@/models';

export const ModuleSelector: React.FC<{
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  modules: Module[];
  allocation: Allocation;
  updateAllocation: (allocation: Allocation) => void;
}> = ({ className = '', size, modules, allocation, updateAllocation }) => {
  const value = allocation.moduleId;
  const options = [{ id: '---', key: '---' } as Module, ...modules].map((m) => ({
    value: m.id,
    label: m.key
  }));

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAllocation({ ...allocation, moduleId: e.target.value });
  };

  return (
    <Select
      className={`${className} font-mono`}
      size={size}
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
