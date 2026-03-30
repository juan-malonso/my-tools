import { ModuleSelector } from '@/components/selectors';
import { type Allocation, type Module, type Task } from '@/models';

export const TaskBoxContent: React.FC<{
  module: Module | undefined;
  modules: Module[];
  task: Task;
  allocation: Allocation;
  updateAllocation: (allocation: Allocation) => void;
  actions: { onClick: () => void; children: React.ReactNode }[];
  badgeUrl: string;
}> = ({ module, modules, task, allocation, updateAllocation, badgeUrl }) => {
  return (
    <div className="p-1 pl-3 flex flex-col gap-1">
      <div className="flex flex-row items-center gap-2">
        <div className="text-sm font-medium leading-tight line-clamp-2 flex-1">
          <ModuleSelector
            className="w-12 text-center"
            size="xs"
            modules={modules}
            allocation={allocation}
            updateAllocation={(a) => {
              updateAllocation(a);
            }}
          />
          <span className="ml-1">{task.title}</span>
        </div>
      </div>

      <div className="text-xs text-slate-300 truncate w-full" title={task.description}>
        {task.description}
      </div>

      <div className="flex gap-1 flex-wrap mt-1">
        {task.ticket.map((t, i) => (
          <TaskBoxBadget key={i} module={module} badgeUrl={badgeUrl} id={t.id} />
        ))}
      </div>
    </div>
  );
};

const TaskBoxBadget: React.FC<{ module?: Module; id: string; badgeUrl: string }> = ({
  module,
  id,
  badgeUrl
}) => {
  return (
    <a
      style={{ backgroundColor: module?.color ?? '#9ca3af' }}
      className={`px-1 py-0.5 rounded text-nowrap
          text-slate-50 text-xs 
        `}
      href={`${badgeUrl}/${id}`}
      target="_blank"
      rel="noreferrer"
    >
      {id}
    </a>
  );
};
