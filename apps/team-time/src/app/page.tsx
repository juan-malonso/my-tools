'use client';

import React, { useMemo, useState } from 'react';

import { BodyGrid } from '@packages/layout';
import Script from 'next/script';

import { PageIcon, SettingIcon } from '@/components/common/icons';
import { SettingsModal, TaskPlanner } from '@/components/features/task-planner';
import {
  type Allocation,
  type Member,
  type Module,
  type Task,
  type Config,
  type External,
  type Utils
} from '@/models';

function getDate(date: Date, period: 'day' | 'week' | 'month', diff: number) {
  const newDate = new Date(date);

  switch (period) {
    case 'day':
      newDate.setDate(newDate.getDate() + diff);
      break;
    case 'week':
      newDate.setDate(newDate.getDate() + diff * 7);
      break;
    case 'month':
      newDate.setMonth(newDate.getMonth() + diff);
      break;
  }

  return newDate;
}

export default function Page() {
  const date = new Date();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [iniDate, setIniDate] = useState<Date>(getDate(date, 'day', -2));
  const [endDate, setEndDate] = useState<Date>(getDate(date, 'month', 2));
  const [defaultBadgeKey, setDefaultBadgeKey] = useState<string>('TSK-001');
  const [baseUrl, setBaseUrl] = useState<string>('');

  const config = useConfig({
    general: {
      iniDate: iniDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      defaultBadgeKey,
      baseUrl
    },
    members: [
      {
        id: '-',
        name: '',
        title: '',
        color: '',
        schedule: [8, 8, 8, 8, 8, 0, 0]
      }
    ],
    modules: [],
    tasks: [],
    allocations: []
  });

  const handleExport = () => {
    const data = {
      general: {
        iniDate: config.general.iniDate.toISOString().slice(0, 10),
        endDate: config.general.endDate.toISOString().slice(0, 10),
        defaultBadgeKey: config.general.defaultBadgeKey,
        baseUrl: config.general.baseUrl
      },
      members: config.members.values,
      modules: config.modules.values,
      tasks: config.tasks.values,
      allocations: config.allocations.values
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team-time-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as unknown as External;
        setIniDate(new Date(data.general.iniDate));
        setEndDate(new Date(data.general.endDate));
        setDefaultBadgeKey(data.general.defaultBadgeKey);
        setBaseUrl(data.general.baseUrl ?? '');
        config.members.raw(data.members);
        config.modules.raw(data.modules);
        config.tasks.raw(data.tasks);
        config.allocations.raw(data.allocations);
      } catch (error) {
        console.error('Error importing file', error);
        alert('Error importing file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <BodyGrid
      headName="Screen Wall"
      headIcon="/favicon.ico"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center justify-between w-full p-3">
          <div className="flex items-center gap-2">
            <PageIcon />
            <h1 className="text-xl font-bold tracking-tight">
              Team<span className="text-sky-500"> Time</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-sky-600 text-white rounded text-sm hover:bg-sky-500 cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <span className="px-2" />
            <button
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              className="px-1 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              <SettingIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      }
    >
      <TaskPlanner config={config} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
        }}
        config={config}
        iniDate={iniDate}
        setIniDate={setIniDate}
        endDate={endDate}
        setEndDate={setEndDate}
        defaultBadgeKey={defaultBadgeKey}
        setDefaultBadgeKey={setDefaultBadgeKey}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
      />
    </BodyGrid>
  );
}

function useConfig(external: External) {
  const members = useCustomState<Member>(external.members);
  const modules = useCustomState<Module>(external.modules);
  const tasks = useCustomState<Task>(external.tasks);

  const allocations = useCustomState<Allocation>(external.allocations);

  const config = useMemo<Config>(() => {
    return {
      general: {
        iniDate: new Date(external.general.iniDate),
        endDate: new Date(external.general.endDate),
        defaultBadgeKey: external.general.defaultBadgeKey,
        baseUrl: external.general.baseUrl ?? ''
      },

      members,
      modules,
      tasks,

      allocations
    };
  }, [external.general, members, modules, tasks, allocations]);

  return config;
}

function useCustomState<T extends { id: string }>(value: T[]): Utils<T> {
  const [values, setValues] = useState<T[]>(value);

  return {
    values,
    add: (value: T) => {
      setValues([...values, value]);
    },
    set: (value: T) => {
      setValues(values.map((m) => (m.id === value.id ? value : m)));
    },
    del: (id: string) => {
      setValues(values.filter((m) => m.id !== id));
    },
    raw: (values: T[]) => {
      setValues(values);
    }
  };
}
