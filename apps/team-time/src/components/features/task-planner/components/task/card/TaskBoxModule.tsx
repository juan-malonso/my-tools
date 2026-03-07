import { type Module } from '@/models';

export const TaskBoxModule: React.FC<{ module?: Module }> = ({ module }) => {
  return (
    <div
      style={{ backgroundColor: module?.color ?? '#9ca3af' }}
      className={`absolute left-0 top-0 bottom-0 w-1.5`}
    />
  );
};
