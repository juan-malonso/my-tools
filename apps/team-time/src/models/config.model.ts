import type { Allocation } from './allocation.model';
import type { Member } from './member.model';
import type { Module } from './module.model';
import type { Task } from './task.model';

export interface Utils<T> {
  values: T[];
  add: (item: T) => void;
  set: (item: T) => void;
  del: (id: string) => void;
  raw: (items: T[]) => void;
}

export interface External {
  general: {
    iniDate: string;
    endDate: string;
    defaultBadgeKey: string;
    baseUrl?: string;
  };

  members: Member[];
  modules: Module[];
  tasks: Task[];

  allocations: Allocation[];
}

export interface Config {
  general: {
    iniDate: Date;
    endDate: Date;
    defaultBadgeKey: string;
    baseUrl?: string;
  };

  members: Utils<Member>;
  modules: Utils<Module>;
  tasks: Utils<Task>;

  allocations: Utils<Allocation>;
}
