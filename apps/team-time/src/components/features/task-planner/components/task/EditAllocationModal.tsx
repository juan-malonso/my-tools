import React from 'react';

import { type Allocation, type Module, type Task, type Utils } from '@/models';

import { TaskRow } from '../../settings/TaskRow';
import { ModuleSelector } from '../selectors/ModuleSelector';
import { TaskSelector } from '../selectors/TaskSelector';

interface EditAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: Allocation | null;
  tasks: Utils<Task>;
  modules: Utils<Module>;
  updateAllocation: (allocation: Allocation) => void;
  onDeleteAllocation: (allocation: Allocation) => void;
  defaultBadgeKey: string;
}

export const EditAllocationModal: React.FC<EditAllocationModalProps> = ({
  isOpen,
  onClose,
  allocation,
  tasks,
  modules,
  updateAllocation,
  onDeleteAllocation,
  defaultBadgeKey
}) => {
  if (!isOpen || !allocation) return null;

  const selectedTask = tasks.values.find((t) => t.id === allocation.taskId);

  const handleTaskUpdate = (updatedTask: Task) => {
    tasks.set(updatedTask);
  };

  const handleDelete = () => {
    onDeleteAllocation(allocation);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-600"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Allocation</h2>

          <div className="text-sm grid grid-cols-4 gap-6">
            <ModuleSelector
              className="col-span-1"
              modules={modules.values}
              allocation={allocation}
              onUpdateAllocation={updateAllocation}
            />
            <TaskSelector
              className="col-span-3"
              tasks={tasks.values}
              allocation={allocation}
              onUpdateAllocation={updateAllocation}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTask && (
            <TaskRow
              task={selectedTask}
              setTask={handleTaskUpdate}
              defaultBadgeKey={defaultBadgeKey}
            />
          )}
        </div>
        <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-500 hover:bg-red-500/10 text-sm font-medium rounded-lg transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
