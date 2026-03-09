import React, { type ChangeEvent } from 'react';
import { DeleteButton } from '@component/forms';

import { ColorPicker } from '@component/forms/colors';
import { Input } from '@component/forms/inputs';

import type { Member } from '@/models';

import { CELL_H, USER_W } from '../../utils/handlers';

export const MemberBox: React.FC<{
  member: Member;
  setMember: (member: Member) => void;
  onDelete?: () => void;
}> = ({ member, setMember, onDelete }) => {
  return (
    <td className="">
      <div style={{ height: CELL_H, width: USER_W }} className="h-full w-full p-1">
        <div
          className={`
            h-full w-full p-1
            border border-slate-300/50 rounded-lg
            bg-slate-800 text-white
            flex relative group`}
        >
          <div className="h-full p-2 flex flex-col justify-center">
            <ColorPicker
              shape="circle"
              size="lg"
              className="border border-slate-500/50 rounded-full"
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
          <div className="h-full w-full p-2 flex flex-col justify-center gap-2">
            <Input
              className="w-full text-lg"
              value={member.name}
              placeholder="Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, name: e.target.value });
              }}
            />
            <Input
              className="w-full text-sm"
              value={member.title}
              placeholder="Title"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, title: e.target.value });
              }}
            />
          </div>
          {onDelete && (
            <div className="absolute hidden top-1 right-1 group-hover:block">
              <DeleteButton onClick={onDelete} />
            </div>
          )}
        </div>
      </div>
    </td>
  );
};
