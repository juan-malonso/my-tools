import React from 'react';

import type { Member } from '@/models';

import { CELL_H, USER_W } from '../utils/handlers';

export const MemberBox: React.FC<{ member: Member }> = ({ member }) => {
  return (
    <td>
      <div style={{ height: CELL_H, width: USER_W }} className="h-full w-full p-2">
        <div className="h-full w-full p-2 border border-slate-400 rounded-lg text-slate-100 flex">
          <div className="h-full p-2 flex flex-col justify-center">
            <div style={{ height: 40, width: 40 }} className="bg-sky-500 rounded-full"></div>
          </div>
          <div className="h-full w-full p-2 flex flex-col justify-center">
            <div className="text-lg text-left">{member.name}</div>
            <div className="text-sm text-left text-slate-500">{member.id}</div>
          </div>
        </div>
      </div>
    </td>
  );
};
