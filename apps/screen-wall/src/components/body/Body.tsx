import { BodyContent } from "./BodyContent";
import { BodyImage } from "./BodyImage";
import { BodyMonitor } from "./BodyMonitor";
import React, { useRef } from "react";

export interface BodyProps {
  asset: {
    value: any | null;
    add: (asset: any) => void;
    del: () => void;
  };
  monitors: {
    value: any[];
    add: (monitor: any, index?: number) => void;
    del: (index: number) => void;
  };
}

export function Body({ asset, monitors }: BodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (index: number, monitor: any) => {
    if (!asset.value || !asset.value.file) return;

    const image = new Image();
    image.src = asset.value.file.src;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const tempCanvas = document.createElement("canvas");

    const [ratioW, ratioH] = monitor.aspectRatio.split(":").map(Number);
    const outputWidth = 3840;
    const outputHeight =
      monitor.orientation === "horizontal"
        ? (outputWidth / ratioW) * ratioH
        : (outputWidth / ratioH) * ratioW;

    tempCanvas.width = outputWidth;
    tempCanvas.height = outputHeight;

    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const zoomFactor = asset.value.zoom / 100;
    const imageX = asset.value.position.x;
    const imageY = asset.value.position.y;

    const monitorWidth = monitor.position.w;
    const monitorHeight = monitor.position.h;
    const monitorX = monitor.position.x;
    const monitorY = monitor.position.y;

    const imageW = asset.value.source.w * zoomFactor;
    const imageH = asset.value.source.h * zoomFactor;

    const imageAbsX = rect.width / 2 + imageX - imageW / 2;
    const imageAbsY = rect.height / 2 + imageY - imageH / 2;

    const monitorAbsX = rect.width / 2 + monitorX - monitorWidth / 2;
    const monitorAbsY = rect.height / 2 + monitorY - monitorHeight / 2;

    const monitorRelX = monitorAbsX - imageAbsX;
    const monitorRelY = monitorAbsY - imageAbsY;

    const sourceX = monitorRelX / zoomFactor;
    const sourceY = monitorRelY / zoomFactor;
    const sourceWidth = monitorWidth / zoomFactor;
    const sourceHeight = monitorHeight / zoomFactor;

    tCtx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    const blob: any = await new Promise((resolve) =>
      tempCanvas.toBlob(resolve, "image/jpeg", 1.0),
    );
    if (!blob) return;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    const imageName = asset.value.file.name || "capture";
    const lastDotIndex = imageName.lastIndexOf(".");
    const imageNameWithoutExtension =
      lastDotIndex === -1 ? imageName : imageName.substring(0, lastDotIndex);

    a.download = `${imageNameWithoutExtension}_monitor_${index + 1}.jpg`;
    a.click();

    URL.revokeObjectURL(a.href);
  };
  const changeAsset = (x: number, y: number) => {
    if (!asset.value) return;
    const newAsset = {
      ...asset.value,
      position: {
        ...asset.value.position,
        x,
        y,
      },
    };
    asset.add(newAsset);
  };

  const onZoomChange = (zoom: number) => {
    if (!asset.value) return;
    const newAsset = {
      ...asset.value,
      zoom: Math.max(1, zoom),
    };
    asset.add(newAsset);
  };

  return (
    <BodyContent ref={containerRef}>
      {asset.value && (
        <BodyImage
          asset={asset.value}
          onChange={changeAsset}
          onZoomChange={onZoomChange}
        />
      )}
      {monitors.value.map((m, index) => {
        const chageMonitor = (x: number, y: number) => {
          const newMonitor = {
            ...m,
            position: {
              ...m.position,
              x,
              y,
            },
          };
          monitors.add(newMonitor, index);
        };

        return (
          <BodyMonitor
            key={index}
            index={index}
            monitor={m}
            onDownload={() => handleDownload(index, m)}
            onChange={chageMonitor}
          />
        );
      })}
    </BodyContent>
  );
}
