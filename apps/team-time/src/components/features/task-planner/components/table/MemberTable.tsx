import React from 'react';

import type { Config } from '@/models';

import { CELL_H } from '../../utils/handlers';
import { MemberBox } from '../member/MemberBox';

interface TaskTableProps {
  config: Config;
  scrollAmount: number;
}

export const MemberTable: React.FC<TaskTableProps> = ({ config, scrollAmount }) => {
  const { members } = config;

  return (
    <table className={`h-full rounded-2xl`}>
      <tbody>
        {members.values.map((member, i) => {
          return (
            <tr
              key={i}
              className={`divide-x-2 w-full border-b-2 border-transparent absolute`}
              style={{ top: i * (CELL_H + 2) }}
            >
              <MemberBox
                key={i}
                member={member}
                setMember={members.set}
                scrollAmount={scrollAmount}
              />
            </tr>
          );
        })}
        <tr />
      </tbody>
    </table>
  );
};
