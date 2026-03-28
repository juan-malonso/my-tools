import { Button } from '@component/forms';

import { type Module } from '@/models';

export const TaskBoxActions: React.FC<{
  module?: Module;
  actions: { onClick: () => void; children: React.ReactNode }[];
}> = ({ module, actions }) => {
  return (
    <div
      className={`
          absolute bottom-1 right-1 flex gap-1
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        `}
    >
      {actions.map(({ onClick, children }, i) => (
        <Button
          key={i}
          onClick={onClick}
          style={{ backgroundColor: module?.color ?? '#9ca3af' }}
          className="!p-1.5 hover:brightness-125 border border-slate-50"
        >
          {children}
        </Button>
      ))}
    </div>
  );
};
