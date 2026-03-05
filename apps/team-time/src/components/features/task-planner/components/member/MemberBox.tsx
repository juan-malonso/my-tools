import React, { type ChangeEvent } from 'react';

import type { Member } from '@/models';

import { CELL_H, USER_W } from '../../utils/handlers';

export const MemberBox: React.FC<{ member: Member; setMember: (member: Member) => void }> = ({
  member,
  setMember
}) => {
  const changeColor = () => {
    const colors = [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#3b82f6',
      '#6366f1',
      '#8b5cf6',
      '#a855f7',
      '#d946ef',
      '#ec4899',
      '#f43f5e'
    ];
    const currentIndex = colors.indexOf(member.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setMember({ ...member, color: colors[nextIndex] });
  };

  return (
    <td className="">
      <div style={{ height: CELL_H, width: USER_W }} className="h-full w-full p-2">
        <div
          className={`
            h-full w-full p-2 
            border border-1 border-slate-100 rounded-lg
            bg-slate-800 text-white
            flex`}
        >
          <div className="h-full p-2 flex flex-col justify-center">
            <div
              onClick={changeColor}
              style={{ height: 40, width: 40, backgroundColor: member.color }}
              className={`
                rounded-full border border-2 border-slate-100 text-slate-100
                flex items-center justify-center cursor-pointer
              `}
            >
              <span className="font-semibold text-sm select-none uppercase">
                {member.name
                  .split(' ')
                  .map((s) => s[0])
                  .join('')}
              </span>
            </div>
          </div>
          <div className="h-full w-full p-2 flex flex-col justify-center gap-">
            <input
              className={`
                  w-full px-2 text-lg text-left
                  border border-transparent rounded
                `}
              value={member.name}
              placeholder="Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMember({ ...member, name: e.target.value });
              }}
            />
            <input
              className={`
                  w-full px-2 text-sm text-left text-slate-400
                  border border-transparent rounded
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
