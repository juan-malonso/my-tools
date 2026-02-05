"use client";

import { useState } from "react";

import { Card } from "@packages/components";
import { ScreenGrid } from "@packages/layout";

import { Body } from "@/components/body";
import { PageIcon } from "@/components/icons";
import { Sidebar } from "@/components/sidebar";

interface Monitor {
  orientation: "horizontal" | "vertical";
  aspectRatio: string;
  inches: number;
  position: { x: number; y: number; w: number; h: number };
}

interface Asset {
  file: { name: string; type: string; src: string } | null;
  zoom: number;
  source: { w: number; h: number };
  position: { x: number; y: number; w: number; h: number };
}

export default function Page() {
  // --- Estado ---
  const [asset, setAsset] = useState<Asset | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([defaultMonitor()]);

  const assetUtils = {
    value: asset,
    add: (asset: Asset) => setAsset(asset),
    del: () => setAsset(null),
  };

  const monitorUtils = {
    value: monitors,
    add: (monitor: Monitor, index?: number) => {
      if (index === undefined) {
        setMonitors((prevMonitors) => [...prevMonitors, monitor]);
      } else {
        setMonitors((prevMonitors) => {
          const newMonitors = [...prevMonitors];
          newMonitors[index] = monitor;
          return newMonitors;
        });
      }
    },
    del: (index: number) =>
      setMonitors((prevMonitors) => prevMonitors.filter((_, i) => i !== index)),
  };

  return (
    <ScreenGrid
      headName="Screen Wall"
      headIcon="/favicon.ico"
      headStyles={<script src="https://cdn.tailwindcss.com"></script>}
      headerTitle={
        <div className="flex items-center gap-2 p-3">
          <PageIcon />
          <h1 className="text-xl font-bold tracking-tight">
            Screen<span className="text-blue-500"> Wall</span>
          </h1>
        </div>
      }
      sidebarContent={<Sidebar asset={assetUtils} monitors={monitorUtils} />}
      sidebarInstructions={
        <Card level="none" actions={<></>}>
          <p className="text-gray-300 text-sm">Controls:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
            <li>Drag monitors to move them.</li>
            <li>Drag the image to pan it around.</li>
            <li>Scroll on the background to zoom.</li>
          </ul>
        </Card>
      }
    >
      <Body asset={assetUtils} monitors={monitorUtils} />
    </ScreenGrid>
  );
}

function defaultMonitor(): Monitor {
  const monitor: Monitor = {
    orientation: "horizontal",
    aspectRatio: "16:9",
    inches: 27,
    position: { x: 0, y: 0, w: 0, h: 0 },
  };

  const [ratioW, ratioH] = monitor.aspectRatio.split(":").map(Number);
  const inches = monitor.inches;

  const h_inches = inches / Math.sqrt(Math.pow(ratioW / ratioH, 2) + 1);
  const w_inches = h_inches * (ratioW / ratioH);

  const scalingFactor = 20;
  const physical_w_px = w_inches * scalingFactor;
  const physical_h_px = h_inches * scalingFactor;

  monitor.position.w =
    monitor.orientation === "horizontal" ? physical_w_px : physical_h_px;
  monitor.position.h =
    monitor.orientation === "horizontal" ? physical_h_px : physical_w_px;

  return monitor;
}
