import { useCallback, useRef, useState } from 'react';

import type { Asset, Monitor, AssetUtils, MonitorUtils } from '@/models';

import { BodyContent } from './BodyContent';
import { BodyImage } from './BodyImage';
import { BodyMonitor } from './BodyMonitor';

export interface BodyProps {
  asset: AssetUtils;
  monitors: MonitorUtils;
}

export function Body({ asset, monitors }: BodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isPanning, ...panHandlers } = usePan(asset, monitors);
  const { changeAsset, onZoomChange } = useAssetActions(asset);

  const assetValue = asset.value;

  const handleDownload = useCallback(
    (index: number, monitor: Monitor) => {
      if (containerRef.current && assetValue) {
        void createMonitorImage(assetValue, containerRef.current, index, monitor);
      }
    },
    [assetValue]
  );

  return (
    <BodyContent ref={containerRef} {...panHandlers} className={isPanning ? 'cursor-grabbing' : ''}>
      {asset.value && (
        <BodyImage asset={asset.value} onChange={changeAsset} onZoomChange={onZoomChange} />
      )}
      {monitors.value.map((m, index) => {
        const changeMonitor = (x: number, y: number) => {
          const newMonitor = {
            ...m,
            position: {
              ...m.position,
              x,
              y
            }
          };
          monitors.add(newMonitor, index);
        };

        return (
          <BodyMonitor
            key={index}
            index={index}
            monitor={m}
            onDownload={() => {
              handleDownload(index, m);
            }}
            onChange={changeMonitor}
          />
        );
      })}
    </BodyContent>
  );
}

function usePan(asset: AssetUtils, monitors: MonitorUtils) {
  const [isPanning, setIsPanning] = useState(false);
  const panStartPos = useRef({ x: 0, y: 0 });
  const initialPanPositions = useRef<{
    asset: Asset['position'];
    monitors: Monitor['position'][];
  } | null>(null);

  const assetValue = asset.value;

  const handlePanStart = (e: React.PointerEvent) => {
    if (e.button !== 1) return;
    e.preventDefault();

    initialPanPositions.current = {
      asset: assetValue?.position ?? { x: 0, y: 0, w: 0, h: 0 },
      monitors: monitors.value.map((m) => m.position)
    };

    setIsPanning(true);
    panStartPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.classList.add('cursor-grabbing');
  };

  const handlePanMove = (e: React.PointerEvent) => {
    const { current } = initialPanPositions;
    if (!isPanning || !current) return;

    const dx = e.clientX - panStartPos.current.x;
    const dy = e.clientY - panStartPos.current.y;

    if (assetValue) {
      const initialAssetPos = current.asset;
      asset.add({
        ...assetValue,
        position: { ...initialAssetPos, x: initialAssetPos.x + dx, y: initialAssetPos.y + dy }
      });
    }

    monitors.value.forEach((monitor, index) => {
      const initialMonitorPos = current.monitors[index];
      monitors.add(
        {
          ...monitor,
          position: {
            ...initialMonitorPos,
            x: initialMonitorPos.x + dx,
            y: initialMonitorPos.y + dy
          }
        },
        index
      );
    });
  };

  const handlePanEnd = (e: React.PointerEvent) => {
    if (!isPanning) return;
    setIsPanning(false);
    initialPanPositions.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.classList.remove('cursor-grabbing');
  };

  return {
    isPanning,
    onPointerDown: handlePanStart,
    onPointerMove: handlePanMove,
    onPointerUp: handlePanEnd,
    onPointerCancel: handlePanEnd
  };
}

function useAssetActions(asset: AssetUtils) {
  const assetValue = asset.value;

  const changeAsset = (x: number, y: number) => {
    if (!assetValue) return;
    const newAsset = {
      ...assetValue,
      position: {
        ...assetValue.position,
        x,
        y
      }
    };
    asset.add(newAsset);
  };

  const onZoomChange = (zoom: number) => {
    if (!assetValue) return;
    const newAsset = {
      ...assetValue,
      zoom: Math.max(1, zoom)
    };
    asset.add(newAsset);
  };

  return { changeAsset, onZoomChange };
}

function calculateDimensions(asset: Asset, monitor: Monitor, rect: DOMRect) {
  const zoomFactor = asset.zoom / 100;
  const imageX = asset.position.x;
  const imageY = asset.position.y;

  const monitorWidth = monitor.position.w;
  const monitorHeight = monitor.position.h;
  const monitorX = monitor.position.x;
  const monitorY = monitor.position.y;

  const imageW = asset.source.w * zoomFactor;
  const imageH = asset.source.h * zoomFactor;

  const imageAbsX = rect.width / 2 + imageX - imageW / 2;
  const imageAbsY = rect.height / 2 + imageY - imageH / 2;

  const monitorAbsX = rect.width / 2 + monitorX - monitorWidth / 2;
  const monitorAbsY = rect.height / 2 + monitorY - monitorHeight / 2;

  const monitorRelX = monitorAbsX - imageAbsX;
  const monitorRelY = monitorAbsY - imageAbsY;

  const x = monitorRelX / zoomFactor;
  const y = monitorRelY / zoomFactor;
  const w = monitorWidth / zoomFactor;
  const h = monitorHeight / zoomFactor;

  return { x, y, w, h };
}

async function createMonitorImage(
  asset: Asset,
  container: HTMLDivElement,
  index: number,
  monitor: Monitor
) {
  if (asset.file === null) return;

  const image = new Image();
  image.src = asset.file.src;
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const tempCanvas = document.createElement('canvas');

  const [ratioW, ratioH] = monitor.aspectRatio.split(':').map(Number);
  const outputWidth = 3840;
  const outputHeight =
    monitor.orientation === 'horizontal'
      ? (outputWidth / ratioW) * ratioH
      : (outputWidth / ratioH) * ratioW;

  tempCanvas.width = outputWidth;
  tempCanvas.height = outputHeight;

  const tCtx = tempCanvas.getContext('2d');
  if (!tCtx) return;

  const rect = container.getBoundingClientRect();

  const { x, y, w, h } = calculateDimensions(asset, monitor, rect);
  tCtx.drawImage(image, x, y, w, h, 0, 0, outputWidth, outputHeight);

  const blob: Blob | null = await new Promise((resolve) => {
    tempCanvas.toBlob(resolve, 'image/jpeg', 1.0);
  });
  if (!blob) return;

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);

  const imageName = asset.file.name;
  const lastDotIndex = imageName.lastIndexOf('.');
  const imageNameWithoutExtension =
    lastDotIndex === -1 ? imageName : imageName.substring(0, lastDotIndex);

  a.download = `${imageNameWithoutExtension}_monitor_${(index + 1).toFixed(0)}.jpg`;
  a.click();

  URL.revokeObjectURL(a.href);
}
