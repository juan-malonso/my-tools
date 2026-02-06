'use client';

import { useState } from 'react';

import { Card } from '@packages/components';
import { ScreenGrid } from '@packages/layout';
import Script from 'next/script';

import { Body } from '@/components/body';
import { PageIcon } from '@/components/icons';
import { Sidebar } from '@/components/sidebar';
import { type Asset, type AssetUtils, type Monitor, type MonitorUtils } from '@/models';

export default function Page() {
  const [asset, setAsset] = useState<Asset | null>(null);

  const assetAdd = (asset: Asset) => {
    setAsset(asset);
  };

  const assetDel = () => {
    setAsset(null);
  };

  const assetUtils: AssetUtils = {
    value: asset,
    add: assetAdd,
    del: assetDel
  };

  const [monitors, setMonitors] = useState<Monitor[]>([defaultMonitor()]);

  const monitorsAdd = (monitor: Monitor, index?: number) => {
    if (index === undefined) {
      setMonitors((prevMonitors) => [...prevMonitors, monitor]);
    } else {
      setMonitors((prevMonitors) => {
        const newMonitors = [...prevMonitors];
        newMonitors[index] = monitor;
        return newMonitors;
      });
    }
  };

  const monitorsDel = (index: number) => {
    setMonitors((prevMonitors) => prevMonitors.filter((_, i) => i !== index));
  };

  const monitorUtils: MonitorUtils = {
    value: monitors,
    add: monitorsAdd,
    del: monitorsDel
  };

  return (
    <ScreenGrid
      headName="Screen Wall"
      headIcon="/favicon.ico"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center gap-2 p-3">
          <PageIcon />
          <h1 className="text-xl font-bold tracking-tight">
            Screen<span className="text-blue-500"> Wall</span>
          </h1>
        </div>
      }
      sidebarContent={<Sidebar asset={assetUtils} monitors={monitorUtils} />}
      sidebarInstructions={
        <Card level="none" actions={<></>}>
          <p className="text-gray-300 text-sm">Controls:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
            <li>Drag monitors to move them.</li>
            <li>Drag the image to pan it around.</li>
            <li>Scroll on the background to zoom.</li>
            <li>Drag with scroll to move view.</li>
          </ul>
        </Card>
      }
    >
      <Body asset={assetUtils} monitors={monitorUtils} />
    </ScreenGrid>
  );
}

function defaultMonitor(): Monitor {
  const monitor: Monitor = {
    orientation: 'horizontal',
    aspectRatio: '16:9',
    inches: 27,
    position: { x: 0, y: 0, w: 0, h: 0 }
  };

  const [ratioW, ratioH] = monitor.aspectRatio.split(':').map(Number);
  const { inches } = monitor;

  const inchesH = inches / Math.sqrt(Math.pow(ratioW / ratioH, 2) + 1);
  const inchesW = inchesH * (ratioW / ratioH);

  const scalingFactor = 20;
  const pixelW = inchesW * scalingFactor;
  const pixelH = inchesH * scalingFactor;

  monitor.position.w = monitor.orientation === 'horizontal' ? pixelW : pixelH;
  monitor.position.h = monitor.orientation === 'horizontal' ? pixelH : pixelW;

  return monitor;
}
