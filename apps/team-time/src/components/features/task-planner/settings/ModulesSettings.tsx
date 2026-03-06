import React from 'react';

import { DeleteIcon } from '@/components/common/icons';
import { type Module, type Utils } from '@/models';

interface ModulesSettingsProps {
  modules: Utils<Module>;
}

export const ModulesSettings: React.FC<ModulesSettingsProps> = ({ modules }) => {
  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Module Management</h3>
        <button
          onClick={() => {
            modules.add({
              id: crypto.randomUUID(),
              key: 'N/A',
              name: 'New Module',
              color: '#64748b'
            });
          }}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-sky-900/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Module
        </button>
      </div>
      <hr className="border-slate-600" />
      <div className="space-y-3">
        {modules.values.map((module) => (
          <ModuleRow
            key={module.id}
            module={module}
            setModule={modules.set}
            delModule={modules.del}
          />
        ))}
      </div>
    </div>
  );
};

const ModuleRow: React.FC<{
  module: Module;
  setModule: (m: Module) => void;
  delModule: (m: Module) => void;
}> = ({ module, setModule, delModule }) => {
  const changeColor = () => {
    const colors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
      '#f43f5e'
    ];
    const currentIndex = colors.indexOf(module.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setModule({ ...module, color: colors[nextIndex] });
  };

  return (
    <div className="group flex items-center gap-3 bg-slate-900/30 hover:bg-slate-900/50 p-2 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all duration-200">
      <div
        onClick={changeColor}
        style={{ backgroundColor: module.color }}
        className="w-8 h-8 rounded cursor-pointer shadow-sm transition-transform ring-1 ring-slate-700/50"
        title="Click to change color"
      />
      <div className="flex-1 flex gap-3">
        <div className="flex-1">
          <input
            value={module.name}
            onChange={(e) => {
              setModule({ ...module, name: e.target.value });
            }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
            placeholder="Module name"
          />
        </div>
        <div className="w-20">
          <input
            value={module.key}
            maxLength={3}
            onChange={(e) => {
              setModule({ ...module, key: e.target.value.toUpperCase() });
            }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1.5 text-sm text-slate-300 text-center font-mono uppercase focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all"
            placeholder="KEY"
          />
        </div>
      </div>
      <button
        onClick={() => {
          delModule(module);
        }}
        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        title="Delete module"
      >
        <DeleteIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
