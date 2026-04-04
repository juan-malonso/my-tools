import React, { useEffect, useRef } from 'react';

import { type AssetUtils } from '@/models';

export interface ImageAssetProps {
  asset: AssetUtils;
  camera: { x: number; y: number; zoom: number };
}

function getScaleX(corner: string, dx: number, w: number) {
  if (corner.includes('right')) return (w + dx) / w;
  if (corner.includes('left')) return (w - dx) / w;
  return 1;
}

function getScaleY(corner: string, dy: number, h: number) {
  if (corner.includes('bottom')) return (h + dy) / h;
  if (corner.includes('top')) return (h - dy) / h;
  return 1;
}

function calculateScale(corner: string, dx: number, dy: number, w: number, h: number) {
  if (corner === 'top' || corner === 'bottom') return getScaleY(corner, dy, h);
  if (corner === 'left' || corner === 'right') return getScaleX(corner, dx, w);

  const diag = Math.sqrt(w * w + h * h);
  let dirX = w / diag;
  let dirY = h / diag;

  if (corner.includes('left')) dirX = -dirX;
  if (corner.includes('top')) dirY = -dirY;

  const movementAlongDiagonal = dx * dirX + dy * dirY;
  return (diag + movementAlongDiagonal) / diag;
}

function useImageInteraction(
  asset: AssetUtils,
  imageRef: React.RefObject<HTMLImageElement | null>,
  cameraZoom: number
) {
  const handleImagePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;

    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    if (!asset.value) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = asset.value.position.x;
    const startPosY = asset.value.position.y;

    function onPointerMove(moveEvent: PointerEvent) {
      if (!asset.value) return;

      const currentScale = cameraZoom / 100;
      const dx = (moveEvent.clientX - startX) / currentScale;
      const dy = (moveEvent.clientY - startY) / currentScale;

      asset.add({
        ...asset.value,
        position: { ...asset.value.position, x: startPosX + dx, y: startPosY + dy }
      });
    }

    function onPointerUp() {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    }

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  const handleResizePointerDown = (e: React.PointerEvent, corner: string) => {
    if (e.button !== 0) return;

    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    if (!asset.value) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startZoom = asset.value.zoom;
    const startPosX = asset.value.position.x;
    const startPosY = asset.value.position.y;
    const imgNode = imageRef.current;
    if (!imgNode) return;

    const originalWidth = imgNode.naturalWidth || imgNode.offsetWidth;
    const originalHeight = imgNode.naturalHeight || imgNode.offsetHeight;
    const startWidth = originalWidth * (startZoom / 100);
    const startHeight = originalHeight * (startZoom / 100);

    function onPointerMove(moveEvent: PointerEvent) {
      if (!asset.value) return;

      const currentScale = cameraZoom / 100;
      const dx = (moveEvent.clientX - startX) / currentScale;
      const dy = (moveEvent.clientY - startY) / currentScale;

      const scale = calculateScale(corner, dx, dy, startWidth, startHeight);

      const minZoom = Math.max(10000 / originalWidth, 10000 / originalHeight);
      const newZoom = Math.min(500, Math.max(minZoom, startZoom * scale));

      const appliedWidth = originalWidth * (newZoom / 100);
      const appliedHeight = originalHeight * (newZoom / 100);

      const newPosX = startPosX + (corner.includes('left') ? startWidth - appliedWidth : 0);
      const newPosY = startPosY + (corner.includes('top') ? startHeight - appliedHeight : 0);

      asset.add({
        ...asset.value,
        zoom: newZoom,
        position: { ...asset.value.position, x: newPosX, y: newPosY }
      });
    }

    function onPointerUp() {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    }

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  return { handleImagePointerDown, handleResizePointerDown };
}

export function ImageAsset({ asset, camera }: ImageAssetProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const { handleImagePointerDown, handleResizePointerDown } = useImageInteraction(
    asset,
    imageRef,
    camera.zoom
  );

  const initializedSrc = useRef<string | null>(null);
  const assetRef = useRef(asset.value);

  useEffect(() => {
    assetRef.current = asset.value;
  }, [asset.value]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!asset.value?.file?.src || initializedSrc.current === asset.value.file.src) return;

    const img = e.currentTarget;
    const originalWidth = img.naturalWidth || img.offsetWidth;
    const originalHeight = img.naturalHeight || img.offsetHeight;

    const rootContainer = img.closest('.overflow-hidden');
    if (!rootContainer) return;

    const containerWidth = rootContainer.clientWidth;
    const containerHeight = rootContainer.clientHeight;

    const currentScale = camera.zoom / 100;

    const targetWidth = (containerWidth / currentScale) * 0.8;
    const targetHeight = (containerHeight / currentScale) * 0.8;

    const scaleX = targetWidth / originalWidth;
    const scaleY = targetHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    const minZoom = Math.max(10000 / originalWidth, 10000 / originalHeight);
    const newZoom = Math.min(500, Math.max(minZoom, scale * 100));

    const appliedWidth = originalWidth * (newZoom / 100);
    const appliedHeight = originalHeight * (newZoom / 100);

    const worldCenterX = (containerWidth / 2 - camera.x) / currentScale;
    const worldCenterY = (containerHeight / 2 - camera.y) / currentScale;

    const x = worldCenterX - appliedWidth / 2;
    const y = worldCenterY - appliedHeight / 2;

    initializedSrc.current = asset.value.file.src;

    setTimeout(() => {
      const currentAsset = assetRef.current;
      if (!currentAsset) return;

      if (currentAsset.position.x === 0 && currentAsset.position.y === 0) {
        asset.add({
          ...currentAsset,
          zoom: newZoom,
          position: { ...currentAsset.position, x, y }
        });
      }
    }, 50);
  };

  if (!asset.value?.file) {
    return null;
  }

  const inverseZoom = 10000 / (asset.value.zoom * camera.zoom);

  return (
    <div
      className="absolute top-0 left-0 group cursor-move"
      onPointerDown={handleImagePointerDown}
      style={{
        transform: `translate(${asset.value.position.x.toString()}px, ${asset.value.position.y.toString()}px) scale(${(asset.value.zoom / 100).toString()})`,
        transformOrigin: 'top left'
      }}
    >
      <img
        ref={imageRef}
        src={asset.value.file.src}
        alt="Canvas Asset"
        className="pointer-events-none select-none block max-w-none"
        onLoad={handleLoad}
      />
      <div
        className="absolute top-0 left-0 w-full h-full border border-purple-500 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
        style={{ borderWidth: `${(inverseZoom * 2).toString()}px` }}
      />
      <div
        className="absolute top-0 left-0 w-full cursor-n-resize opacity-0 group-hover:opacity-100"
        style={{ height: '12px', transform: `translateY(-50%) scaleY(${inverseZoom.toString()})` }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'top');
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full cursor-s-resize opacity-0 group-hover:opacity-100"
        style={{ height: '12px', transform: `translateY(50%) scaleY(${inverseZoom.toString()})` }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'bottom');
        }}
      />
      <div
        className="absolute top-0 left-0 h-full cursor-w-resize opacity-0 group-hover:opacity-100"
        style={{ width: '12px', transform: `translateX(-50%) scaleX(${inverseZoom.toString()})` }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'left');
        }}
      />
      <div
        className="absolute top-0 right-0 h-full cursor-e-resize opacity-0 group-hover:opacity-100"
        style={{ width: '12px', transform: `translateX(50%) scaleX(${inverseZoom.toString()})` }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'right');
        }}
      />

      <div
        className="absolute top-0 left-0 bg-purple-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 border border-white shadow-sm"
        style={{
          width: '16px',
          height: '16px',
          transform: `translate(-50%, -50%) scale(${inverseZoom.toString()})`
        }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'top-left');
        }}
      />
      <div
        className="absolute top-0 right-0 bg-purple-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 border border-white shadow-sm"
        style={{
          width: '16px',
          height: '16px',
          transform: `translate(50%, -50%) scale(${inverseZoom.toString()})`
        }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'top-right');
        }}
      />
      <div
        className="absolute bottom-0 left-0 bg-purple-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 border border-white shadow-sm"
        style={{
          width: '16px',
          height: '16px',
          transform: `translate(-50%, 50%) scale(${inverseZoom.toString()})`
        }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'bottom-left');
        }}
      />
      <div
        className="absolute bottom-0 right-0 bg-purple-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 border border-white shadow-sm"
        style={{
          width: '16px',
          height: '16px',
          transform: `translate(50%, 50%) scale(${inverseZoom.toString()})`
        }}
        onPointerDown={(e) => {
          handleResizePointerDown(e, 'bottom-right');
        }}
      />
    </div>
  );
}
