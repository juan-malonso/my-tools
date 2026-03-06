import React from 'react';

import type { Allocation, Module } from '@/models';

export const ModuleSelector: React.FC<{
  className?: string;
  modules: Module[];
  allocation: Allocation;
  onUpdateAllocation: (allocation: Allocation) => void;
}> = ({ className = '', modules, allocation, onUpdateAllocation }) => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateAllocation({ ...allocation, moduleId: e.target.value });
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
      value={allocation.moduleId}
      onChange={onChange}
    >
      {[{ id: '---', key: '---' } as Module, ...modules].map((mod, i) => (
        <option key={i} value={mod.id} className="text-black bg-slate-200">
          {mod.key}
        </option>
      ))}
    </select>
  );
};
