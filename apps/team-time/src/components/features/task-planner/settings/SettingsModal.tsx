import React, { useState } from 'react';

import { ModuleIcon, PageIcon, SettingIcon } from '@/components/common/icons';
import { type Module, type Task, type Utils } from '@/models';

import { GeneralSettings } from './GeneralSettings';
import { ModulesSettings } from './ModulesSettings';
import { TasksSettings } from './TasksSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: Utils<Module>;
  tasks: Utils<Task>;
  iniDate: Date;
  setIniDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  defaultBadgeKey: string;
  setDefaultBadgeKey: (key: string) => void;
}

type Section = 'general' | 'modules' | 'tasks';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  modules,
  tasks,
  iniDate,
  setIniDate,
  endDate,
  setEndDate,
  defaultBadgeKey,
  setDefaultBadgeKey
}) => {
  const [activeSection, setActiveSection] = useState<Section>('general');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredTasks = tasks.values.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.ticket.some((t) => t.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 w-[80%] h-[80%] max-w-6xl rounded-2xl shadow-2xl flex overflow-hidden border border-slate-600"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Sidebar */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-700 flex flex-col">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem
              label="General"
              isActive={activeSection === 'general'}
              onClick={() => {
                setActiveSection('general');
              }}
              icon={<SettingIcon className="h-5 w-5" />}
            />
            <SidebarItem
              label="Modules"
              isActive={activeSection === 'modules'}
              onClick={() => {
                setActiveSection('modules');
              }}
              icon={<ModuleIcon className="h-5 w-5" />}
            />
            <SidebarItem
              label="Tasks"
              isActive={activeSection === 'tasks'}
              onClick={() => {
                setActiveSection('tasks');
              }}
              icon={<PageIcon className="h-5 w-5" />}
            />
          </nav>
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-800 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-8">
            {activeSection === 'general' && (
              <GeneralSettings
                iniDate={iniDate}
                setIniDate={setIniDate}
                endDate={endDate}
                setEndDate={setEndDate}
                defaultBadgeKey={defaultBadgeKey}
                setDefaultBadgeKey={setDefaultBadgeKey}
              />
            )}

            {activeSection === 'modules' && <ModulesSettings modules={modules} />}

            {activeSection === 'tasks' && (
              <TasksSettings
                tasks={tasks}
                search={search}
                setSearch={setSearch}
                filteredTasks={filteredTasks}
                defaultBadgeKey={defaultBadgeKey}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);
