import React, { useState, useRef, useEffect } from "react";

export interface BodyImageProps {
  asset: any;
  onChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
}

export function BodyImage({ asset, onChange, onZoomChange }: BodyImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialImagePos = useRef({ x: 0, y: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState(asset.position);

  const assetRef = useRef(asset);
  assetRef.current = asset;
  const onZoomChangeRef = useRef(onZoomChange);
  onZoomChangeRef.current = onZoomChange;

  useEffect(() => {
    if (!isDragging) {
      setPosition(asset.position);
    }
  }, [asset.position, isDragging]);

  useEffect(() => {
    const element = divRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newZoom = assetRef.current.zoom + (e.deltaY > 0 ? -1 : 1);
      onZoomChangeRef.current(newZoom);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialImagePos.current = { x: position.x, y: position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    setPosition({
      ...position,
      x: initialImagePos.current.x + dx,
      y: initialImagePos.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    onChange(initialImagePos.current.x + dx, initialImagePos.current.y + dy);
  };

  if (!asset || !asset.file) {
    return null;
  }

  const { w, h } = asset.source;
  const zoomFactor = asset.zoom / 100;
  const { x, y } = position;

  return (
    <div
      ref={divRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`group ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${w * zoomFactor}px`,
        height: `${h * zoomFactor}px`,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        touchAction: "none",
        zIndex: 1,
      }}
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
