import React, { type ChangeEvent } from 'react';
import { ColorPicker } from '@component/forms/colors';
import { Input } from '@component/forms/inputs';

import type { Member } from '@/models';
import { CELL_H, USER_W } from '@/utils';

export const MemberBox: React.FC<{
  member: Member;
  setMember: (member: Member) => void;
  scrollAmount: number;
}> = ({ member, setMember, scrollAmount }) => {
  const currentWidth = Math.min(Math.max(64, 22 + USER_W - scrollAmount), USER_W);

  return (
    <td className="sticky left-[-22px]">
      <div
        style={{ height: CELL_H, width: currentWidth }}
        className="h-full p-1 transition-all duration-300 ease-in-out"
      >
        <div
          className={`
            h-full w-full p-1
            border border-slate-300/50 rounded-lg
            bg-slate-800 text-white
            shadow-lg shadow-slate-900
            flex relative group overflow-hidden`}
        >
          <div className="h-full p-2 flex flex-col justify-center min-w-[48px]">
            <ColorPicker
              shape="circle"
              size="lg"
              className="border-slate-400 shrink-0"
              value={member.color}
              onChange={(color) => {
                setMember({ ...member, color });
              }}
            >
              <span className="font-semibold text-sm select-none uppercase">
                {member.name
                  .split(' ')
                  .map((s) => s[0])
                  .join('') || '--'}
              </span>
            </ColorPicker>
          </div>

          <div
            className={`
              h-full flex flex-col justify-center gap-2 whitespace-nowrap
              transition-all  ease-in-out px-2
              ${currentWidth < USER_W ? 'w-0 opacity-0 translate-x-[-10px]' : 'w-full opacity-100 translate-x-0'}
            `}
          >
            <Input
              className="w-full text-lg bg-transparent border border-slate-400/40 focus:ring-0 px-2"
              value={member.name}
              placeholder="Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, name: e.target.value });
              }}
            />
            <Input
              className="w-full text-sm bg-transparent border border-slate-400/40 focus:ring-0 px-2"
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
