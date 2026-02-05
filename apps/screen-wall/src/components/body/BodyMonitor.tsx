import React, { useState, useRef, useEffect } from "react";
import { CreateButton, DownloadIcon } from "@packages/components";

export interface BodyMonitorProps {
  monitor: any;
  index: number;
  onChange: (x: number, y: number) => void;
  onDownload: (e: any) => void;
}

const style = " border-2 border-blue-500 text-white";

export function BodyMonitor({
  monitor,
  index,
  onChange,
  onDownload,
}: BodyMonitorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialMonitorPos = useRef({ x: 0, y: 0 });

  // Local state for immediate feedback during drag
  const [position, setPosition] = useState(monitor.position);

  // Sync local position with prop when not dragging
  useEffect(() => {
    if (!isDragging) {
      setPosition(monitor.position);
    }
  }, [monitor.position, isDragging]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialMonitorPos.current = { x: position.x, y: position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    setPosition({
      ...position,
      x: initialMonitorPos.current.x + dx,
      y: initialMonitorPos.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    onChange(
      initialMonitorPos.current.x + dx,
      initialMonitorPos.current.y + dy,
    );
  };

  const { w, h } = monitor.position;
  const { x, y } = position;

  const { inches, aspectRatio, orientation } = monitor;
  const [ratio_w, ratio_h] = aspectRatio.split(":").map(Number);
  const ar = ratio_w / ratio_h;

  const h_inches = inches / Math.sqrt(ar * ar + 1);
  const w_inches = ar * h_inches;

  let w_cm = w_inches * 2.54;
  let h_cm = h_inches * 2.54;

  if (orientation === "vertical") {
    [w_cm, h_cm] = [h_cm, w_cm];
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`${style} group ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${w}px`,
        height: `${h}px`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        touchAction: "none",
        zIndex: isDragging ? 100 : 10,
      }}
    >
      {/* TOP LEFT CORNER */}
      <div className="absolute top-0 left-0">
        <div className="p-1 text-[15px]">
          <div style={labelStyle}>{`Monitor ${index + 1}`}</div>
        </div>
      </div>

      {/* TOP RIGHT CORNER */}
      <div className="absolute top-0 right-0">
        <div className="p-1">
          <CreateButton onClick={onDownload}>
            <DownloadIcon className="w-4 h-4 text-white" />
          </CreateButton>
        </div>
      </div>

      {/* BOTTOM LEFT CORNER */}
      <div className="absolute bottom-0 left-0">
        <div className="p-1"></div>
      </div>

      {/* BOTTOM RIGHT CORNER */}
      <div className="absolute bottom-0 right-0">
        <div className="p-1 text-[12px] text-white/70">
          <div
            style={labelStyle}
          >{`${w_cm.toFixed(2)}cm x ${h_cm.toFixed(2)} cm`}</div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  color: "white",
  borderRadius: "4px",
  padding: "0px 4px",
};
