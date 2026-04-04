import { type Position } from './position.model';

export interface Asset {
  file: { name: string; type: string; src: string } | null;
  name: string;
  zoom: number;
  source: { w: number; h: number };
  position: Position;
}

export interface AssetUtils {
  value: Asset | null;
  add: (value: Asset) => void;
  del: () => void;
}
