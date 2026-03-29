'use client';

import React from 'react';
import { AbsenceIcon, TargetIcon } from '@component/icons';

interface FloatingActionsProps {
  onGoToToday: () => void;
  absence: boolean;
  setAbsence: (absence: boolean) => void;
}

const Action: React.FC<{
  color?: string;
  label: string;
  icon: React.ReactElement;
  onClick: () => void;
}> = ({ color = 'bg-sky-500 text-white hover:bg-sky-600', label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-end
        h-12 min-w-[3rem] ml-auto ${color}
        rounded-full border-2 border-sky-100
        transition-all duration-300 ease-in-out
        overflow-hidden
      `}
    >
      <span
        className="
        max-w-0 overflow-hidden whitespace-nowrap
        group-hover:max-w-xs group-hover:pl-4
        transition-all duration-300 ease-in-out
        text-sm font-medium
      "
      >
        {label}
      </span>

      {/* Contenedor del icono (siempre visible a la derecha) */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">{icon}</div>
    </button>
  );
};

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onGoToToday,
  absence,
  setAbsence
}) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <Action
        color={
          absence
            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
            : 'bg-gray-500 text-white hover:bg-gray-600'
        }
        label={absence ? 'Disable Absence' : 'Active Absence'}
        onClick={() => {
          setAbsence(!absence);
        }}
        icon={<AbsenceIcon className="h-7 w-7 text-white" />}
      />
      <Action
        label={'Go to Today'}
        onClick={onGoToToday}
        icon={<TargetIcon className="h-7 w-7 text-white" />}
      />
    </div>
  );
};
