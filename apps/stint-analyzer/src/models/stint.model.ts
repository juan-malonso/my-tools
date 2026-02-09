export interface Lap {
  sectors: string[];
  time: string;
}

export interface Stint {
  compound: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'I' | 'W';
  time: number;
  laps: Lap[];
}
