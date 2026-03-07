import React, { useEffect } from 'react';

import { CloseButton, DeleteButton } from '@component/forms';
import { Modal } from '@component/surfaces';

import { type Allocation, type Module, type Task, type Utils } from '@/models';

import { TaskSettings } from './TaskSettings';
import { ModuleSelector, TaskSelector } from '../selectors';

interface TaskEditProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: Allocation | null;
  tasks: Utils<Task>;
  modules: Utils<Module>;
  updateAllocation: (allocation: Allocation) => void;
  onDeleteAllocation: (allocation: Allocation) => void;
  defaultBadgeKey: string;
}

export const TaskEdit: React.FC<TaskEditProps> = ({
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
  const selectedModule = modules.values.find((m) => m.id === allocation.moduleId);

  const handleTaskUpdate = (updatedTask: Task) => {
    tasks.set(updatedTask);
  };

  const handleDelete = () => {
    onDeleteAllocation(allocation);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        headerClassName={`bg-opacity-50 bg-[${selectedModule?.color ?? '#9ca3af'}] bg-red-500`}
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Edit Allocation</h2>
          </div>
        }
        body={
          selectedTask && (
            <TaskSettings
              task={selectedTask}
              setTask={handleTaskUpdate}
              defaultBadgeKey={defaultBadgeKey}
            />
          )
        }
        footer={
          <div className="flex justify-between items-center">
            <DeleteButton size="md" onClick={handleDelete}>
              Delete
            </DeleteButton>
            <CloseButton size="md" onClick={onClose}>
              Close
            </CloseButton>
          </div>
        }
      ></Modal>
    </>
  );
};
