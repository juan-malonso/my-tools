import React, { useState, useRef } from 'react';

import { CreateButton, DownloadIcon } from '@packages/components';

import { type Monitor } from '@/models';

export interface BodyMonitorProps {
  monitor: Monitor;
  index: number;
  onChange: (x: number, y: number) => void;
  onDownload: () => void;
}

const style = ' border-2 border-blue-500 text-white';

export function BodyMonitor({ monitor, index, onChange, onDownload }: BodyMonitorProps) {
  const [dragDelta, setDragDelta] = useState<{ dx: number; dy: number } | null>(null);

  const position = {
    x: monitor.position.x + (dragDelta?.dx ?? 0),
    y: monitor.position.y + (dragDelta?.dy ?? 0)
  };

  const isDragging = dragDelta !== null;
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.button !== 0) return; // Only left-click
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
    onChange(monitor.position.x + dx, monitor.position.y + dy);

    setDragDelta(null);
  };

  const { h, w, x, y, cm } = calculateDimensions(monitor, position);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`${style} group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={monitorStyle({ x: x.toFixed(), y: y.toFixed(), w: w.toFixed(), h: h.toFixed() })}
    >
      <div className="absolute top-0 left-0">
        <div className="p-1 text-[15px]">
          <div style={labelStyle}>{`Monitor ${(index + 1).toFixed(0)}`}</div>
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <div className="p-1">
          <CreateButton onClick={onDownload}>
            <DownloadIcon className="w-4 h-4 text-white" />
          </CreateButton>
        </div>
      </div>

      <div className="absolute bottom-0 right-0">
        <div className="p-1 text-[12px] text-white/70">
          <div style={labelStyle}>{`${cm.w.toFixed(2)}cm x ${cm.h.toFixed(2)} cm`}</div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  color: 'white',
  borderRadius: '4px',
  padding: '0px 4px'
};

function monitorStyle(coordinates: {
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

function calculateDimensions(monitor: Monitor, position: { x: number; y: number }) {
  const { w, h } = monitor.position;
  const { x, y } = position;

  const { inches, aspectRatio, orientation } = monitor;
  const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
  const ar = ratioW / ratioH;

  const inchesH = inches / Math.sqrt(ar * ar + 1);
  const inchesW = ar * inchesH;

  let cm = { w: inchesW * 2.54, h: inchesH * 2.54 };
  if (orientation === 'vertical') {
    cm = { w: cm.h, h: cm.w };
  }

  return { h, w, x, y, cm };
}
