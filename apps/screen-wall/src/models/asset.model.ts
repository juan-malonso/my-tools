export interface Asset {
  file: { name: string; type: string; src: string } | null;
  zoom: number;
  source: { w: number; h: number };
  position: { x: number; y: number; w: number; h: number };
}

export interface AssetUtils {
  value: Asset | null;
  add: (value: Asset) => void;
  del: () => void;
}
