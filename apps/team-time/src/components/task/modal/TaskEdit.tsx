import React, { useMemo } from 'react';
import { CloseButton } from '@component/forms';
import { Modal } from '@component/surfaces';

import type { Allocation, Member, Module, Task, Utils } from '@/models';

import { AllocationSettings } from '../card';

interface TaskEditProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: Allocation | null;
  allocations: Utils<Allocation>;
  tasks: Utils<Task>;
  members: Utils<Member>;
  modules: Utils<Module>;
  defaultBadgeKey: string;
}

export const TaskEdit: React.FC<TaskEditProps> = ({
  isOpen,
  onClose,
  allocation,
  allocations,
  tasks,
  members,
  modules,
  defaultBadgeKey
}) => {
  const task = useMemo(
    () => tasks.values.find((t) => t.id === allocation?.taskId),
    [tasks.values, allocation]
  );

  if (!isOpen || !allocation || !task) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header="Edit Task"
      body={
        <div className="p-4 flex flex-col gap-6 text-white">
          <AllocationSettings
            task={task}
            tasks={tasks}
            allocation={allocation}
            allocations={allocations}
            members={members}
            modules={modules}
            defaultBadgeKey={defaultBadgeKey}
          />
        </div>
      }
      footer={
        <div className="flex justify-end items-center">
          <CloseButton size="md" onClick={onClose}>
            Close
          </CloseButton>
        </div>
      }
    />
  );
};
