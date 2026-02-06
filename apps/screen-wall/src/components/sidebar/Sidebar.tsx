import React from 'react';

import { CreateButton, ImageInput } from '@packages/components';

import { type Asset, type AssetUtils, type Monitor, type MonitorUtils } from '@/models';

import { SidebarContent } from './SidebarContent';
import { SidebarImage } from './SidebarImage';
import { SidebarMonitor } from './SidebarMonitor';

export interface SidebarProps {
  asset: AssetUtils;
  monitors: MonitorUtils;
}

export function Sidebar({ asset, monitors }: SidebarProps) {
  const assetValue = asset.value;
  const assetContent =
    assetValue === null ? (
      <ImageInput onChange={addAsset(asset)} />
    ) : (
      <SidebarImage
        asset={assetValue}
        delAsset={delAsset(asset)}
        changeAsset={changeAsset(asset)}
      />
    );

  const monitorValue = monitors.value;
  const monitorActions = (
    <>
      <CreateButton onClick={addMonitor(monitors)}>Add</CreateButton>
    </>
  );
  const monitorContent = (
    <div className="space-y-3 max-h-[400px] pr-1">
      {monitorValue.map((m, index) => {
        return (
          <SidebarMonitor
            key={index}
            index={index}
            monitor={m}
            monitorCount={monitors.value.length}
            changeMonitor={changeMonitor(monitors, index)}
            deleteMonitor={delMonitor(monitors, index)}
          />
        );
      })}
    </div>
  );

  return (
    <SidebarContent
      items={[
        {
          title: 'Image',
          content: assetContent
        },
        {
          title: 'Monitors',
          actions: monitorActions,
          content: monitorContent
        }
      ]}
    />
  );
}

function addAsset(asset: AssetUtils) {
  return (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const h = img.height;
        const w = img.width;

        asset.add({
          file: { name: file.name, type: file.type, src },
          zoom: 100,
          source: { h, w },
          position: { x: 0, y: 0, w, h }
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  };
}

function changeAsset(asset: AssetUtils) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
}

function delAsset(asset: AssetUtils) {
  return () => {
    asset.del();
  };
}

function calculateDimensions(monitor: Monitor) {
  const [ratioW, ratioH] = monitor.aspectRatio.split(':').map(Number);
  const { inches } = monitor;

  const inchesH = inches / Math.sqrt(Math.pow(ratioW / ratioH, 2) + 1);
  const inchesW = inchesH * (ratioW / ratioH);

  const scalingFactor = 20;
  const pixelW = inchesW * scalingFactor;
  const pixelH = inchesH * scalingFactor;

  monitor.position.w = monitor.orientation === 'horizontal' ? pixelW : pixelH;
  monitor.position.h = monitor.orientation === 'horizontal' ? pixelH : pixelW;
}

function addMonitor(monitors: MonitorUtils) {
  return () => {
    const monitor: Monitor = {
      orientation: 'horizontal',
      aspectRatio: '16:9',
      inches: 27,
      position: { x: 0, y: 0, w: 0, h: 0 }
    };

    calculateDimensions(monitor);
    monitors.add(monitor);
  };
}

function changeMonitor(monitors: MonitorUtils, index: number) {
  const m = monitors.value[index];

  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const $form = (e.target as HTMLElement).closest('.monitor-form');
    if (!$form) return;

    const selector = (label: string): string => {
      const $element = $form.querySelector<HTMLInputElement | HTMLSelectElement>(label);
      return $element === null ? '0' : $element.value;
    };

    m.orientation = selector('.orientation-select') as 'horizontal' | 'vertical';
    m.aspectRatio = selector('.aspect-ratio-select');
    m.inches = parseInt(selector('.inches-input'), 10);

    calculateDimensions(m);
    monitors.add(m, index);
  };
}

function delMonitor(monitors: MonitorUtils, index: number) {
  return () => {
    monitors.del(index);
  };
}
