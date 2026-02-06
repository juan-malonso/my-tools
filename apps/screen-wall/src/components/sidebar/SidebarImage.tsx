import { Card, DeleteButton, Form, ImageIcon, NumberInput } from '@packages/components';

import { type Asset } from '@/models';

export interface SidebarImageProps {
  asset: Asset;
  delAsset: () => void;
  changeAsset: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function SidebarImage({ asset, delAsset, changeAsset }: SidebarImageProps) {
  return (
    <Card
      title={asset.file?.name ?? 'Unknown Image'}
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
