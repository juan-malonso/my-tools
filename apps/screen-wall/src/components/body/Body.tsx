import React, { useRef, useState } from 'react';

import { usePannable } from '@/hooks/usePannable';
import { useZoomable } from '@/hooks/useZoomable';
import { type AssetUtils, type MonitorUtils } from '@/models';

import { ImageAsset } from './ImageAsset';
import { MonitorCard } from './MonitorCard';

export interface BodyProps {
  asset: AssetUtils;
  monitors: MonitorUtils;
}

export function Body({ asset, monitors }: BodyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 100 });
  const mousePos = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1) {
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startCamX = camera.x;
      const startCamY = camera.y;

      function onPointerMove(moveEvent: PointerEvent) {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        setCamera((prev) => ({ ...prev, x: startCamX + dx, y: startCamY + dy }));
      }

      function onPointerUp() {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      }

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }
  };

  usePannable({
    ref,
    onPan: (position) => {
      setCamera((prev) => ({
        ...prev,
        x: prev.x + position.x,
        y: prev.y + position.y
      }));
    }
  });

  useZoomable({
    ref,
    onZoom: (deltaY) => {
      setCamera((prev) => {
        const newZoom = Math.min(Math.max(10, prev.zoom + deltaY * -0.1), 500);
        if (newZoom === prev.zoom) return prev;

        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return { ...prev, zoom: newZoom };

        const mx = mousePos.current.x - rect.left;
        const my = mousePos.current.y - rect.top;

        const currentScale = prev.zoom / 100;
        const newScale = newZoom / 100;

        const worldX = (mx - prev.x) / currentScale;
        const worldY = (my - prev.y) / currentScale;

        const newX = mx - worldX * newScale;
        const newY = my - worldY * newScale;

        return { x: newX, y: newY, zoom: newZoom };
      });
    }
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      style={{
        backgroundColor: '#0f172a',
        backgroundImage:
          'conic-gradient(#1e293b 25%, transparent 25%, transparent 50%, #1e293b 50%, #1e293b 75%, transparent 75%, transparent)',
        backgroundSize: `${(20 * (camera.zoom / 100)).toString()}px ${(20 * (camera.zoom / 100)).toString()}px`,
        backgroundPosition: `${camera.x.toString()}px ${camera.y.toString()}px`
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full origin-top-left"
        style={{
          transform: `translate(${camera.x.toString()}px, ${camera.y.toString()}px) scale(${(camera.zoom / 100).toString()})`
        }}
      >
        <ImageAsset asset={asset} camera={camera} />
        {monitors.value.map((monitor, index) => (
          <MonitorCard
            key={index}
            monitor={monitor}
            utils={monitors}
            index={index}
            assetName={asset.value?.name}
          />
        ))}
      </div>
    </div>
  );
}
