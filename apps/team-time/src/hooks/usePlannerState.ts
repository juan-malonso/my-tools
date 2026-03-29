'use client';

import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

import {
  type Allocation,
  type Config,
  type External,
  type Member,
  type Module,
  type Task,
  type Utils
} from '@/models';

import { calculateDateOffset } from '../utils';

function useCustomState<T extends { id: string }>(value: T[]): Utils<T> {
  const [values, setValues] = useState<T[]>(value);

  const add = useCallback((value: T) => {
    setValues((prev) => [...prev, value]);
  }, []);

  const set = useCallback((value: T) => {
    setValues((prev) => prev.map((m) => (m.id === value.id ? value : m)));
  }, []);

  const del = useCallback((id: string) => {
    setValues((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const raw = useCallback((values: T[]) => {
    setValues(values);
  }, []);

  return useMemo(
    () => ({
      values,
      add,
      set,
      del,
      raw
    }),
    [values, add, set, del, raw]
  );
}

function useConfig(external: External) {
  const members = useCustomState<Member>(
    external.members.map((member) => ({ ...member, absences: member.absences ?? [] }))
  );
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

export function usePlannerState() {
  const date = new Date();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [iniDate, setIniDate] = useState<Date>(calculateDateOffset(date, 'day', -2));
  const [endDate, setEndDate] = useState<Date>(calculateDateOffset(date, 'month', 2));
  const [defaultBadgeKey, setDefaultBadgeKey] = useState<string>('TSK-001');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [version, setVersion] = useState<number>(1);
  const [imports, setImports] = useState(0);
  const [absence, setAbsence] = useState(false);

  const config = useConfig({
    version,
    general: {
      iniDate: iniDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      defaultBadgeKey,
      baseUrl
    },
    members: [
      { id: '-', name: '', title: '', color: '', schedule: [8, 8, 8, 8, 8, 0, 0], absences: [] }
    ],
    modules: [],
    tasks: [],
    allocations: []
  });

  const applyExternalConfig = (data: External) => {
    try {
      setIniDate(new Date(data.general.iniDate));
      setEndDate(new Date(data.general.endDate));
      setDefaultBadgeKey(data.general.defaultBadgeKey);
      setBaseUrl(data.general.baseUrl ?? '');
      setVersion(data.version || 1);
      config.members.raw(
        data.members.map((member) => ({ ...member, absences: member.absences ?? [] }))
      );
      config.modules.raw(data.modules);
      config.tasks.raw(data.tasks);
      config.allocations.raw(data.allocations);
      setImports((prev) => prev + 1);
    } catch (error) {
      console.error('Error applying configuration:', error);
      alert('There was an error applying the configuration.');
    }
  };

  const createExportableConfig = (exportVersion?: number): string => {
    const v = exportVersion ?? version;
    return JSON.stringify(
      {
        version: v,
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
      },
      null,
      2
    );
  };

  const handleExport = () => {
    const newVersion = version + 1;
    setVersion(newVersion);
    const data = createExportableConfig(newVersion);
    const blob = new Blob([data], { type: 'application/json' });
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
      applyExternalConfig(JSON.parse(event.target?.result as string) as External);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfigChange = (newConfig: Config) => {
    applyExternalConfig(newConfig as unknown as External);
  };

  const handleConfigExport = () => {
    const newVersion = version + 1;
    setVersion(newVersion);
    return { payload: createExportableConfig(newVersion), version: newVersion };
  };

  return {
    isSettingsOpen,
    setIsSettingsOpen,
    iniDate,
    setIniDate,
    endDate,
    setEndDate,
    defaultBadgeKey,
    setDefaultBadgeKey,
    baseUrl,
    setBaseUrl,
    version,
    setVersion,
    imports,
    config,
    setImports,
    handleExport,
    handleImport,
    handleConfigChange,
    handleConfigExport,
    absence,
    setAbsence
  };
}
