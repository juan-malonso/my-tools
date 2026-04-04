import { type ChangeEvent } from 'react';

import { type Asset, type AssetUtils } from '@/models';

export function useAssetManager(asset: AssetUtils) {
  const addAsset = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const h = img.height;
        const w = img.width;

        asset.add({
          file: { name: file.name, type: file.type, src },
          name: '',
          zoom: 100,
          source: { h, w },
          position: { x: 0, y: 0, w, h }
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  };

  const changeAsset = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = asset.value;
    if (value === null) return;

    const $form = (e.target as HTMLElement).closest('.image-form');
    if (!$form) return;

    const selector = (label: string): string => {
      const $element = $form.querySelector<HTMLInputElement | HTMLSelectElement>(label);
      return $element === null ? '0' : $element.value;
    };

    const updateAsset: Asset = {
      ...value,
      zoom: parseInt(selector('.zoom-input'), 10)
    };

    asset.add(updateAsset);
  };

  const delAsset = () => {
    asset.del();
  };

  return {
    addAsset,
    changeAsset,
    delAsset
  };
}
