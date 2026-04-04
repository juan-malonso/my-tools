import { type Position } from './position.model';

export interface Monitor {
  name: string;
  orientation: 'horizontal' | 'vertical';
  aspectRatio: string;
  inches: number;
  position: Position;
}

export interface MonitorUtils {
  value: Monitor[];
  add: (value: Monitor, index?: number) => void;
  del: (index: number) => void;
}
