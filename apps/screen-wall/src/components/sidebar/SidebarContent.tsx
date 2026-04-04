import React, { useEffect, useRef } from 'react';
import {
  Card,
  CreateButton,
  DeleteButton,
  ImageInput,
  Input,
  Section,
  Select
} from '@packages/components';

import { useAssetManager } from '@/hooks/useAssetManager';
import { useMonitorManager } from '@/hooks/useMonitorManager';
import { type AssetUtils, type MonitorUtils } from '@/models';
import { calculateMonitorDimensions } from '@/utils';

export interface SidebarProps {
  asset: AssetUtils;
  monitors: MonitorUtils;
}

export function SidebarContent({ asset, monitors }: SidebarProps) {
  const { addAsset, changeAsset } = useAssetManager(asset);
  const { addMonitor } = useMonitorManager(monitors);
  const pendingFileName = useRef<string | null>(null);

  const handleAddAsset = (file: File) => {
    const nameWithoutExt = file.name.includes('.')
      ? file.name.substring(0, file.name.lastIndexOf('.'))
      : file.name;
    pendingFileName.current = nameWithoutExt;
    addAsset(file);
  };

  useEffect(() => {
    if (asset.value && pendingFileName.current) {
      if (!asset.value.name) {
        asset.add({ ...asset.value, name: pendingFileName.current });
      }
      pendingFileName.current = null;
    }
  }, [asset.value, asset]);

  const handleMonitorChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const currentMonitor = monitors.value[index];
    const updatedMonitor = {
      ...currentMonitor,
      // Si el campo es 'inches' lo convertimos a número, sino usamos el string
      [name]: name === 'inches' ? Number(value) : value
    };

    // Recalcular dimensiones del monitor si cambia algún campo que afecte su tamaño visual
    if (['inches', 'aspectRatio', 'orientation'].includes(name)) {
      const { w, h } = calculateMonitorDimensions(updatedMonitor);
      updatedMonitor.position = {
        ...updatedMonitor.position,
        w,
        h
      };
    }

    monitors.add(updatedMonitor, index);
  };

  const assetValue = asset.value;
  const assetContent =
    assetValue === null ? (
      <ImageInput onChange={handleAddAsset} />
    ) : (
      <Card
        body={
          <div className="flex items-end gap-2">
            <Input
              key={assetValue.name || 'default-name'}
              size="sm"
              name="name"
              className="image-name w-full bg-slate-900 border-slate-900"
              defaultValue={assetValue.name}
              onChange={changeAsset}
            />
            <DeleteButton
              onClick={() => {
                asset.del();
              }}
            />
          </div>
        }
      />
    );

  const monitorValue = monitors.value;
  const monitorActions = (
    <CreateButton size="sm" onClick={addMonitor}>
      Add
    </CreateButton>
  );
  const monitorContent = (
    <div className="space-y-3">
      {monitorValue.map((m, index) => {
        return (
          <Card
            key={index}
            body={
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <Input
                    size="sm"
                    name="name"
                    className="name-input w-full bg-slate-900 border-slate-900"
                    value={m.name || ''}
                    onChange={(e) => {
                      handleMonitorChange(index, e);
                    }}
                  />
                  <DeleteButton
                    onClick={() => {
                      monitors.del(index);
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    size="sm"
                    name="orientation"
                    className="orientation-select w-full"
                    value={m.orientation}
                    onChange={(e) => {
                      handleMonitorChange(index, e);
                    }}
                    options={[
                      { label: 'Horizontal', value: 'horizontal' },
                      { label: 'Vertical', value: 'vertical' }
                    ]}
                  />
                  <Select
                    size="sm"
                    name="aspectRatio"
                    className="aspect-ratio-select w-full"
                    value={m.aspectRatio}
                    onChange={(e) => {
                      handleMonitorChange(index, e);
                    }}
                    options={[
                      { label: '16:9', value: '16:9' },
                      { label: '4:3', value: '4:3' },
                      { label: '21:9', value: '21:9' },
                      { label: '32:9', value: '32:9' }
                    ]}
                  />
                  <Input
                    size="sm"
                    type="number"
                    name="inches"
                    className="inches-input w-full bg-slate-900 border-slate-900"
                    value={m.inches || 0}
                    min={10}
                    max={100}
                    onChange={(e) => {
                      handleMonitorChange(index, e);
                    }}
                  />
                </div>
              </div>
            }
          />
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 overflow-y-auto">
      <Section title="Image" actions={<></>}>
        {assetContent}
      </Section>
      <Section title="Monitors" actions={monitorActions}>
        {monitorContent}
      </Section>
    </div>
  );
}
