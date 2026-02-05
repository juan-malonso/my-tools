import {
  Card,
  DeleteButton,
  Form,
  MonitorIcon,
  NumberInput,
  SelectInput,
} from "@packages/components";

export interface SidebarMonitorProps {
  monitor: any;
  index: number;
  monitorCount: number;
  changeMonitor: (e: any) => void;
  deleteMonitor: () => void;
}

export function SidebarMonitor({
  monitor,
  index,
  monitorCount,
  changeMonitor,
  deleteMonitor,
}: SidebarMonitorProps) {
  return (
    <Card
      title={`Monitor ${index + 1}`}
      icon={<MonitorIcon />}
      actions={
        monitorCount > 1 ? <DeleteButton onClick={deleteMonitor} /> : null
      }
    >
      <Form className="monitor-form">
        <SelectInput
          label="Orientation"
          className="orientation-select"
          defaultValue={monitor.orientation}
          options={orientationOptions}
          onChange={changeMonitor}
        />
        <SelectInput
          label="Aspect Ratio"
          className="aspect-ratio-select"
          defaultValue={monitor.aspectRatio}
          options={aspectRatioOptions}
          onChange={changeMonitor}
        />
        <NumberInput
          label="Inches"
          className="inches-input"
          defaultValue={monitor.inches}
          minValue={1}
          maxValue={100}
          onChange={changeMonitor}
        />
      </Form>
    </Card>
  );
}

const orientationOptions = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

const aspectRatioOptions = [
  { label: "16:9", value: "16:9" },
  { label: "16:10", value: "16:10" },
  { label: "21:9", value: "21:9" },
  { label: "32:9", value: "32:9" },
  { label: "4:3", value: "4:3" },
];
