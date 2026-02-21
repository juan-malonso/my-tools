import React, { type ChangeEvent } from 'react';

import type { Member } from '@/models';

import { CELL_H, USER_W } from '../../utils/handlers';

export const MemberBox: React.FC<{ member: Member; setMember: (member: Member) => void }> = ({
  member,
  setMember
}) => {
  return (
    <td className="">
      <div style={{ height: CELL_H, width: USER_W }} className="h-full w-full p-2">
        <div
          className={`
            h-full w-full p-2 
            border border-slate-400 rounded-lg
            bg-sky-300/20 text-slate-100
            flex`}
        >
          <div className="h-full p-2 flex flex-col justify-center">
            <div style={{ height: 40, width: 40 }} className="bg-gray-400 rounded-full"></div>
          </div>
          <div className="h-full w-full p-2 flex flex-col justify-center gap-1">
            <input
              className={`
                  w-full px-2
                  text-lg text-left
                  border border-slate-400 rounded
                `}
              value={member.name}
              placeholder="Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, name: e.target.value });
              }}
            />
            <input
              className={`
                  w-full px-2
                  text-sm text-left text-slate-400
                  border border-slate-400 rounded
                `}
              value={member.title}
              placeholder="Title"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, title: e.target.value });
              }}
            />
          </div>
        </div>
      </div>
    </td>
  );
};
