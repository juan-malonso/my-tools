import { type ItemDate } from './date.model';
import { type Member } from './member.model';

export interface Ticket {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  ticket: Ticket[];
}

export interface TaskMetadata {
  member: Member;
  date: ItemDate;
  task?: string;
  span: number;
  next?: string;
  dragging: boolean;
  resizing: boolean;
}
