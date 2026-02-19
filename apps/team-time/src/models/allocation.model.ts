import type { Member } from './member.model';
import type { Module } from './module.model';
import type { Task } from './task.model';

export interface Allocation {
  id: string;

  iniDate: string;
  span: number;

  memberId: Member['id'];
  moduleId: Module['id'];
  taskId: Task['id'];
}
