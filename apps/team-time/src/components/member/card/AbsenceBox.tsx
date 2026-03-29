import React from 'react';

interface AbsenceBoxProps {
  isAbsence: boolean;
  onClick: () => void;
}

export const AbsenceBox: React.FC<AbsenceBoxProps> = ({ isAbsence, onClick }) => {
  const border = 'border-2 border-dashed border-gray-300 rounded-lg';
  const style = 'bg-slate-200/20 text-gray-300';
  const align = 'flex justify-center items-center';
  const hover = 'opacity-0 group-hover:opacity-100 duration-1';

  const message = isAbsence ? 'Unset absence' : 'Set as absence';

  return (
    <button
      onClick={onClick}
      className={`h-full w-full p-1 group ${isAbsence ? 'bg-yellow-600/40' : 'bg-gray-600/40'}`}
    >
      <div className={`h-full p-2 ${style} ${border} ${align} ${hover}`}>{message}</div>
    </button>
  );
};
