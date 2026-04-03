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

const mapExternalToInternal = (external: External) => {
  const defaultSchedule = [true, true, true, true, true, false, false];
  const members: Member[] = external.members.map((member) => ({
    ...member,
    absences: member.absences ?? [],
    schedule: member.schedule?.map((s) => !!s) ?? defaultSchedule
  }));

  return {
    general: {
      iniDate: new Date(external.general.iniDate),
      endDate: new Date(external.general.endDate),
      defaultBadgeKey: external.general.defaultBadgeKey,
      baseUrl: external.general.baseUrl ?? ''
    },
    version: external.version || 1,
    members,
    modules: external.modules,
    tasks: external.tasks,
    allocations: external.allocations
  };
};

export function usePlannerState() {
  const date = new Date();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [iniDate, setIniDate] = useState<Date>(() => calculateDateOffset(date, 'day', -2));
  const [endDate, setEndDate] = useState<Date>(() => calculateDateOffset(date, 'month', 2));
  const [defaultBadgeKey, setDefaultBadgeKey] = useState<string>('TSK-001');
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [version, setVersion] = useState<number>(1);
  const [imports, setImports] = useState(0);
  const [absence, setAbsence] = useState(false);

  const members = useCustomState<Member>([
    {
      id: '-',
      name: '',
      title: '',
      color: '',
      schedule: [true, true, true, true, true, false, false],
      absences: []
    }
  ]);
  const modules = useCustomState<Module>([]);
  const tasks = useCustomState<Task>([]);
  const allocations = useCustomState<Allocation>([]);

  const config = useMemo<Config>(
    () => ({
      general: {
        iniDate,
        endDate,
        defaultBadgeKey,
        baseUrl: baseUrl
      },
      members,
      modules,
      tasks,
      allocations
    }),
    [iniDate, endDate, defaultBadgeKey, baseUrl, members, modules, tasks, allocations]
  );

  const applyExternalConfig = (data: External) => {
    try {
      const internalConfig = mapExternalToInternal(data);

      setIniDate(internalConfig.general.iniDate);
      setEndDate(internalConfig.general.endDate);
      setDefaultBadgeKey(internalConfig.general.defaultBadgeKey);
      setBaseUrl(internalConfig.general.baseUrl);
      setVersion(internalConfig.version);

      members.raw(internalConfig.members);
      modules.raw(internalConfig.modules);
      tasks.raw(internalConfig.tasks);
      allocations.raw(internalConfig.allocations);

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
