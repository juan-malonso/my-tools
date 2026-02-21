'use client';

import { useMemo, useState } from 'react';

import { BodyGrid } from '@packages/layout';
import Script from 'next/script';

import { PageIcon } from '@/components/common/icons';
import { TaskPlanner } from '@/components/features/task-planner';
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

  const [iniDate /*, setIniDate*/] = useState<Date>(getDate(date, 'day', -2));
  const [endDate /*, setEndDate*/] = useState<Date>(getDate(date, 'month', 2));

  const config = useConfig({
    general: {
      iniDate: iniDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10)
    },
    members: [
      { id: '0000000000001', name: 'John Doe', title: 'Developer' },
      { id: '0000000000002', name: 'Jane Doe', title: 'Designer' }
    ],
    modules: [
      { id: 'MD1', name: 'Module 1', color: 'bg-red-500' },
      { id: 'MD2', name: 'Module 2', color: 'bg-green-500' },
      { id: 'MD3', name: 'Module 3', color: 'bg-orange-500' }
    ],
    tasks: [
      { id: '0000000000001', title: 'Task 1', description: 'Description 1', ticket: [] },
      { id: '0000000000002', title: 'Task 2', description: 'Description 2', ticket: [] }
    ],
    allocations: [
      {
        id: '0000000000001',
        iniDate: getDate(date, 'day', 1).toISOString().slice(0, 10),
        span: 3,
        memberId: '0000000000001',
        taskId: '0000000000001',
        moduleId: 'MD1'
      }
    ]
  });

  return (
    <BodyGrid
      headName="Screen Wall"
      headIcon="/favicon.ico"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center gap-2 p-3">
          <PageIcon />
          <h1 className="text-xl font-bold tracking-tight">
            Team<span className="text-sky-500"> Time</span>
          </h1>
        </div>
      }
    >
      <TaskPlanner config={config} />
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
        endDate: new Date(external.general.endDate)
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
    del: (value: T) => {
      setValues(values.filter((m) => m.id !== value.id));
    },
    raw: (values: T[]) => {
      setValues(values);
    }
  };
}
