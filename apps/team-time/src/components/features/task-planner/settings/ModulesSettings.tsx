import React from 'react';

import { ColorPicker, CreateButton, DeleteButton, Input } from '@packages/components';

import { type Module, type Utils } from '@/models';

interface ModulesSettingsProps {
  modules: Utils<Module>;
}

export const ModulesSettings: React.FC<ModulesSettingsProps> = ({ modules }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center m-2">
        <h3 className="text-2xl font-semibold text-white">Module Management</h3>
        <CreateButton
          size="sm"
          onClick={() => {
            modules.add({
              id: crypto.randomUUID(),
              key: 'N/A',
              name: 'New Module',
              color: '#64748b'
            });
          }}
        >
          Add Module
        </CreateButton>
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
  delModule: (m: string) => void;
}> = ({ module, setModule, delModule }) => {
  return (
    <div
      className={`
        group p-3 gap-3 flex items-center 
        bg-slate-900 hover:bg-slate-900/50 
        rounded-lg border border-slate-900 hover:border-slate-600 
        transition-all duration-200
      `}
    >
      <ColorPicker
        value={module.color}
        size="md"
        onChange={(color) => {
          setModule({ ...module, color });
        }}
      />
      <Input
        value={module.name}
        size="sm"
        className="w-full"
        placeholder="Module name"
        onChange={(e) => {
          setModule({ ...module, name: e.target.value });
        }}
      />
      <Input
        value={module.key}
        size="sm"
        className="w-20 text-center font-mono"
        placeholder="KEY"
        onChange={(e) => {
          setModule({ ...module, key: e.target.value.toUpperCase() });
        }}
      />
      <DeleteButton
        onClick={() => {
          delModule(module.id);
        }}
      />
    </div>
  );
};
