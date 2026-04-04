'use client';

import { useState } from 'react';
import { MonitorIcon } from '@packages/components';
import { ScreenGrid } from '@packages/layout';
import Script from 'next/script';

import { Body } from '@/components/body/Body';
import { SidebarContent } from '@/components/sidebar/SidebarContent';
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

  const [monitors, setMonitors] = useState<Monitor[]>([]);

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
      headIcon="/favicon.svg"
      headStyles={<Script src="https://cdn.tailwindcss.com" />}
      headerTitle={
        <div className="flex items-center gap-2 p-3">
          <MonitorIcon className="h-6 w-6 text-purple-500" />
          <h1 className="text-xl font-bold tracking-tight">
            Screen<span className="text-purple-500"> Wall</span>
          </h1>
        </div>
      }
      sidebarContent={<SidebarContent asset={assetUtils} monitors={monitorUtils} />}
      sidebarInstructions={
        <div className="text-sm text-gray-300 gap-2 flex flex-col">
          <b>Controls:</b>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>
              <b>Left Click:</b> Move & resize elements.
            </li>
            <li>
              <b>Middle Click:</b> Pan the canvas.
            </li>
            <li>
              <b>Scroll:</b> Zoom in/out.
            </li>
            <li>
              <b>Export:</b> Click monitor icon to download crop.
            </li>
          </ul>
        </div>
      }
    >
      <div className="h-full w-full relative">
        <Body asset={assetUtils} monitors={monitorUtils} />
      </div>
    </ScreenGrid>
  );
}
