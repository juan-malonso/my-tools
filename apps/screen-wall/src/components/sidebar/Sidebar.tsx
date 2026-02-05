import { CreateButton, ImageInput } from "@packages/components";
import React from "react";
import { SidebarContent } from "./SidebarContent";
import { SidebarMonitor } from "./SidebarMonitor";
import { SidebarImage } from "./SidebarImage";
export interface SidebarProps {
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

export function Sidebar({ asset, monitors }: SidebarProps) {
  const addAsset = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        const h = img.height;
        const w = img.width;

        asset.add({
          file: { name: file.name, type: file.type, src },
          zoom: 100,
          source: { h, w },
          position: { x: 0, y: 0, w, h },
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  };

  const changeAsset = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const form = (e.target as HTMLElement).closest(".image-form");
    if (!form) return;

    const zoom = parseInt(
      (form.querySelector(".zoom-input") as HTMLInputElement).value,
      10,
    );

    const updateAsset = {
      ...asset.value,
      zoom,
    };

    asset.add(updateAsset);
  };

  const delAsset = () => {
    asset.del();
  };

  const addMonitor = () => {
    const monitor = {
      orientation: "horizontal",
      aspectRatio: "16:9",
      inches: 27,
      position: { x: 0, y: 0, w: 0, h: 0 },
    };

    calculateDimensions(monitor);
    monitors.add(monitor);
  };

  return (
    <SidebarContent
      items={[
        {
          title: "Image",
          content:
            asset.value === null ? (
              <ImageInput onChange={addAsset} />
            ) : (
              <SidebarImage
                asset={asset.value}
                delAsset={delAsset}
                changeAsset={changeAsset}
              />
            ),
        },
        {
          title: "Monitors",
          actions: <CreateButton onClick={addMonitor}>Add</CreateButton>,
          content: (
            <div className="space-y-3 max-h-[400px] pr-1">
              {monitors.value.map((m, index) => {
                const chageMonitor = (
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => {
                  const $form = (e.target as HTMLElement).closest(
                    ".monitor-form",
                  );
                  if (!$form) return;

                  const selector = (label: string) =>
                    $form.querySelector(label) as HTMLInputElement;

                  m.orientation = selector(".orientation-select").value;
                  m.aspectRatio = selector(".aspect-ratio-select").value;
                  m.inches = parseInt(
                    selector(".inches-input").value ?? "0",
                    10,
                  );

                  calculateDimensions(m);
                  monitors.add(m, index);
                };

                const delMonitor = () => {
                  monitors.del(index);
                };

                return (
                  <SidebarMonitor
                    key={index}
                    index={index}
                    monitor={m}
                    monitorCount={monitors.value.length}
                    changeMonitor={chageMonitor}
                    deleteMonitor={delMonitor}
                  />
                );
              })}
            </div>
          ),
        },
      ]}
    />
  );
}

function calculateDimensions(monitor: any) {
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
}
