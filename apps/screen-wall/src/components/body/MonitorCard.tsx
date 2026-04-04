import React, { useRef } from 'react';
import { DownloadIcon } from '@packages/components';

import { useDraggable } from '@/hooks/useDraggable';
import { type Monitor, type MonitorUtils } from '@/models';
import { calculateMonitorDimensions } from '@/utils/monitor.util';

interface MonitorCardProps {
  monitor: Monitor;
  utils: MonitorUtils;
  index: number;
  assetName?: string;
}

export function MonitorCard({ monitor, utils, index, assetName }: MonitorCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { cm } = calculateMonitorDimensions(monitor);

  useDraggable({
    ref,
    initialPosition: monitor.position,
    onDragEnd: (position) => {
      const newMonitor = { ...monitor };
      newMonitor.position.x = position.x;
      newMonitor.position.y = position.y;
      utils.add(newMonitor, index);
    }
  });

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();

    const img = document.querySelector<HTMLImageElement>('img[alt="Canvas Asset"]');
    if (!img || !ref.current) {
      return;
    }

    const imgRect = img.getBoundingClientRect();
    const monitorRect = ref.current.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    const sx = (monitorRect.left - imgRect.left) * scaleX;
    const sy = (monitorRect.top - imgRect.top) * scaleY;
    const sWidth = monitorRect.width * scaleX;
    const sHeight = monitorRect.height * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = sWidth;
    canvas.height = sHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

    const link = document.createElement('a');
    const baseName = assetName ?? 'asset';
    const monName = monitor.name || 'monitor';
    link.download = `${baseName} - ${monName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={ref}
      className={`absolute border-2 bg-purple-700/40 border-purple-400 rounded-sm cursor-move select-none`}
      style={{
        width: monitor.position.w,
        height: monitor.position.h
      }}
    >
      <span className="absolute top-1 left-1">
        <MonitorLabel label={monitor.name} />
      </span>
      <button
        onClick={handleDownload}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-1 right-1 text-white bg-black/50 hover:bg-black/80 rounded p-1 backdrop-blur-sm cursor-pointer transition-colors z-10"
        title="Descargar recorte"
      >
        <DownloadIcon className="w-3.5 h-3.5" />
      </button>
      <span className="absolute bottom-1 left-1 flex gap-1">
        <MonitorLabel label={monitor.aspectRatio} />
        <MonitorLabel label={`${monitor.inches.toFixed(0)}"`} />
      </span>
      <span className="absolute bottom-1 right-1">
        <MonitorLabel label={`${cm.w.toFixed(2)} x ${cm.h.toFixed(2)} cm`} />
      </span>
      <div className="flex flex-col items-center justify-center h-full gap-1" />
    </div>
  );
}

function MonitorLabel({ label }: { label: string }) {
  return (
    <span
      className={`
          text-[11px] text-white bg-black/50 rounded 
          p-1 backdrop-blur-sm pointer-events-none
        `}
    >
      {label}
    </span>
  );
}
