import React, { useState, useRef, useEffect } from 'react';

import { type Asset } from '@/models';

export interface BodyImageProps {
  asset: Asset;
  onChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
}

export function BodyImage({ asset, onChange, onZoomChange }: BodyImageProps) {
  const [dragDelta, setDragDelta] = useState<{ dx: number; dy: number } | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const position = {
    x: asset.position.x + (dragDelta?.dx ?? 0),
    y: asset.position.y + (dragDelta?.dy ?? 0)
  };

  const isDragging = dragDelta !== null;

  const assetRef = useRef(asset);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    assetRef.current = asset;
    onZoomChangeRef.current = onZoomChange;
  }, [asset, onZoomChange]);

  useEffect(() => {
    const element = divRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newZoom = assetRef.current.zoom + (e.deltaY > 0 ? -1 : 1);
      onZoomChangeRef.current(newZoom);
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left-click
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragDelta({ dx: 0, dy: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragDelta === null) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setDragDelta({ dx, dy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragDelta === null) return;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    onChange(asset.position.x + dx, asset.position.y + dy);

    setDragDelta(null);
  };

  if (asset.file === null) {
    return null;
  }

  const { h, w, x, y } = calculateDimensions(asset, position);

  return (
    <div
      ref={divRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={assetStyle({ x: x.toFixed(), y: y.toFixed(), w: w.toFixed(), h: h.toFixed() })}
    >
      <img
        src={asset.file.src}
        alt={asset.file.name}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}

function assetStyle(coordinates: {
  x: string;
  y: string;
  w: string;
  h: string;
}): React.CSSProperties {
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${coordinates.w}px`,
    height: `${coordinates.h}px`,
    transform: `translate(calc(-50% + ${coordinates.x}px), calc(-50% + ${coordinates.y}px))`,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    touchAction: 'none'
  };
}

function calculateDimensions(asset: Asset, position: { x: number; y: number }) {
  const { w, h } = asset.source;
  const zoomFactor = asset.zoom / 100;
  const { x, y } = position;

  return { h: h * zoomFactor, w: w * zoomFactor, x, y };
}
