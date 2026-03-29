import React from 'react';

import type { Config } from '@/models';
import { getDates } from '@/utils';

import { AbsenceRow } from './AbsenceRow';

interface AbsenceTableProps {
  config: Config;
}

export const AbsenceTable: React.FC<AbsenceTableProps> = ({ config }) => {
  const { general, members } = config;

  const dates = getDates(general.iniDate, general.endDate);

  return (
    <table className={`h-full w-full rounded-2xl`}>
      <tbody>
        {members.values.map((member, i) => {
          return (
            <AbsenceRow key={i} dates={dates} member={member} setMember={config.members.set} />
          );
        })}

        <tr />
      </tbody>
    </table>
  );
};
