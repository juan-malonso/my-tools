import React from 'react';

import type { ItemDate } from '@/models';
import { CELL_W, dayColor } from '@/utils';

const borderStyle = 'border-slate-500';

export const BackgroundCell: React.FC<{ date: ItemDate }> = ({ date }) => {
  const color = dayColor(date);

  return (
    <td className={`${color} border-l-2 ${borderStyle}`}>
      <div style={{ width: CELL_W }} />
    </td>
  );
};
