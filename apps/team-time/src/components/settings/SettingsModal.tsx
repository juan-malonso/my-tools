import React, { useState } from 'react';
import { CloseButton } from '@component/forms';
import { Modal } from '@component/surfaces';

import { CloudIcon, ModuleIcon, PageIcon, SettingIcon } from '@/components/icons';
import { type Config } from '@/models';

import {
  GeneralSettings,
  ModulesSettings,
  RemoteSettings,
  TasksSettings,
  UserSettings
} from './sections';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: number;
  setVersion: (version: number) => void;
  config: Config;
  onConfigChange: (newConfig: Config) => void;
  onConfigExport: () => { payload: string; version: number };
  iniDate: Date;
  setIniDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  defaultBadgeKey: string;
  setDefaultBadgeKey: (key: string) => void;
  baseUrl?: string;
  setBaseUrl: (url: string) => void;
}

type Section = 'general' | 'modules' | 'remote' | 'tasks' | 'users';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  version,
  setVersion,
  config,
  onConfigChange,
  onConfigExport,
  iniDate,
  setIniDate,
  endDate,
  setEndDate,
  defaultBadgeKey,
  setDefaultBadgeKey,
  baseUrl,
  setBaseUrl
}) => {
  const [activeSection, setActiveSection] = useState<Section>('general');
  const [search, setSearch] = useState('');

  const { allocations, members, tasks, modules } = config;

  if (!isOpen) return null;

  const filteredTasks = tasks.values.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.ticket.some((t) => t.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        sidenav={
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>

            <nav className="flex-1 space-y-2">
              <SidebarItem
                label="General"
                isActive={activeSection === 'general'}
                onClick={() => {
                  setActiveSection('general');
                }}
                icon={<SettingIcon className="h-5 w-5" />}
              />
              <SidebarItem
                label="Users"
                isActive={activeSection === 'users'}
                onClick={() => {
                  setActiveSection('users');
                }}
                icon={<PageIcon className="h-5 w-5" />}
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
              <SidebarItem
                label="Remote"
                isActive={activeSection === 'remote'}
                onClick={() => {
                  setActiveSection('remote');
                }}
                icon={<CloudIcon className="h-5 w-5" />}
              />
            </nav>
          </div>
        }
        footer={
          <div className="flex justify-end items-center">
            <CloseButton size="md" onClick={onClose}>
              Close
            </CloseButton>
          </div>
        }
        body={
          <div className="flex flex-col">
            {activeSection === 'general' && (
              <GeneralSettings
                iniDate={iniDate}
                setIniDate={setIniDate}
                endDate={endDate}
                setEndDate={setEndDate}
                defaultBadgeKey={defaultBadgeKey}
                setDefaultBadgeKey={setDefaultBadgeKey}
                baseUrl={baseUrl}
                setBaseUrl={setBaseUrl}
              />
            )}

            {activeSection === 'users' && <UserSettings members={members} />}

            {activeSection === 'modules' && <ModulesSettings modules={modules} />}

            {activeSection === 'tasks' && (
              <TasksSettings
                tasks={tasks}
                allocations={allocations}
                members={members}
                modules={modules}
                search={search}
                setSearch={setSearch}
                filteredTasks={filteredTasks}
                defaultBadgeKey={defaultBadgeKey}
              />
            )}

            {activeSection === 'remote' && (
              <RemoteSettings
                version={version}
                setVersion={setVersion}
                onConfigChange={onConfigChange}
                onConfigExport={onConfigExport}
              />
            )}
          </div>
        }
      />
    </>
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
