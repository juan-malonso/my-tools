import React from 'react';

import { CELL_H, CELL_W } from '@/utils';

import { AbsenceBox } from '../card';

interface AbsenceCellProps {
  isAbsence: boolean;
  toggleAbsence: () => void;
}

export const AbsenceCell: React.FC<AbsenceCellProps> = ({ isAbsence, toggleAbsence }) => {
  return (
    <td className={`border-transparent`}>
      <div style={{ height: CELL_H, width: CELL_W }}>
        <AbsenceBox isAbsence={isAbsence} onClick={toggleAbsence} />
      </div>
    </td>
  );
};
