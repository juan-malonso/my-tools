import React from 'react';

import { CELL_W } from '../utils/handlers';

function calcWidth(span: number, margin = 5, border = 2) {
  return CELL_W * span - margin * 2 + (span - 1) * border;
}

export const DropBox: React.FC<{ span: number; block?: boolean }> = ({ span, block = false }) => {
  const style = 'border-2 border-dashed  rounded-lg text-gray-400';
  const ocupied = block ? 'bg-red-200/10 border-red-400' : 'bg-slate-200/10 border-slate-400';
  const align = 'flex justify-center items-center';

  return (
    <div className={`h-full w-full p-[10px]`}>
      <div
        style={{ width: calcWidth(span, 10, 2) }}
        className={`h-full p-2 ${style} ${ocupied} ${align}`}
      ></div>
    </div>
  );
};
