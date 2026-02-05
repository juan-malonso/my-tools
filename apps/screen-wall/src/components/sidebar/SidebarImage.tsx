import {
  Card,
  DeleteButton,
  Form,
  ImageIcon,
  NumberInput,
} from "@packages/components";

export interface SidebarImageProps {
  asset: { file: { name: string; type: string }; zoom: number };
  delAsset: () => void;
  changeAsset: (e: any) => void;
}

export function SidebarImage({
  asset,
  delAsset,
  changeAsset,
}: SidebarImageProps) {
  return (
    <Card
      title={asset.file.name}
      icon={<ImageIcon />}
      actions={<DeleteButton onClick={delAsset} />}
    >
      <Form className="image-form">
        <NumberInput
          label="Zoom"
          className="zoom-input"
          defaultValue={asset.zoom}
          minValue={0}
          step={0.01}
          onChange={changeAsset}
        />
      </Form>
    </Card>
  );
}
