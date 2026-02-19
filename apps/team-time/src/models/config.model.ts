import type { Allocation } from './allocation.model';
import type { Member } from './member.model';
import type { Module } from './module.model';
import type { Task } from './task.model';

export interface Utils<T> {
  values: T[];
  add: (member: T) => void;
  set: (member: T) => void;
  del: (member: T) => void;
  raw: (members: T[]) => void;
}

export interface External {
  general: {
    iniDate: string;
    endDate: string;
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
  };

  members: Utils<Member>;
  modules: Utils<Module>;
  tasks: Utils<Task>;

  allocations: Utils<Allocation>;
}
