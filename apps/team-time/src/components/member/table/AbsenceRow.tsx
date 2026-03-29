import React from 'react';

import type { ItemDate, Member } from '@/models';
import { CELL_H, CELL_W } from '@/utils';

import { AbsenceCell } from './AbsenceCell';

interface AbsenceRowProps {
  member: Member;
  dates: ItemDate[];
  setMember: (member: Member) => void;
}

export const AbsenceRow: React.FC<AbsenceRowProps> = ({ member, dates, setMember }) => {
  return (
    <tr
      className={`divide-x-2 w-full border-2 border-transparent bg-slate-500/50`}
      style={{ height: CELL_H, width: CELL_W * dates.length }}
    >
      {dates.map((date, j) => {
        const isAbsence = member.absences.includes(date.label);

        const toggleAbsence = isAbsence
          ? () => {
              setMember({ ...member, absences: member.absences.filter((a) => a !== date.label) });
            }
          : () => {
              setMember({ ...member, absences: [...member.absences, date.label] });
            };

        return (
          <AbsenceCell
            key={j}
            isAbsence={member.absences.includes(date.label)}
            toggleAbsence={toggleAbsence}
          />
        );
      })}
    </tr>
  );
};
