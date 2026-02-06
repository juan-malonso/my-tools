export interface Monitor {
  orientation: 'horizontal' | 'vertical';
  aspectRatio: string;
  inches: number;
  position: { x: number; y: number; w: number; h: number };
}

export interface MonitorUtils {
  value: Monitor[];
  add: (value: Monitor, index?: number) => void;
  del: (index: number) => void;
}
