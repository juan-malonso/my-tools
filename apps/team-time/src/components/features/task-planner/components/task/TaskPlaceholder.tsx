import React from 'react';

import { AddIcon } from '@component/icons';

export const TaskPlaceholder: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const border = 'border-2 border-dashed border-gray-400 rounded-lg';
  const style = 'bg-slate-200/10 text-gray-400';
  const align = 'flex justify-center items-center';
  const hover = 'opacity-0 group-hover:opacity-100 duration-1';

  return (
    <>
      <button onClick={onClick} className={`h-full w-full p-2 group`}>
        <div className={`h-full p-2 ${style} ${border} ${align} ${hover}`}>
          <AddIcon className="h-3 w-3 mr-1" />
          Add Task
        </div>
      </button>
    </>
  );
};
