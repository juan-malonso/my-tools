import { useState, useEffect } from 'react';

import type { Allocation, Utils } from '@/models';

import { isCellOccupied, type ItemDate, CELL_W } from '../utils/handlers';

export interface Resize {
  allocationId: string;
  direction: 'left' | 'right';
  startX: number;
  initialSpan: number;
  initialDateIndex: number;
}

export function useResize(
  dates: ItemDate[],
  allocations: Utils<Allocation>
): [Resize | undefined, React.Dispatch<React.SetStateAction<Resize | undefined>>] {
  const [resizing, setResizing] = useState<Resize | undefined>(undefined);

  useEffect(() => {
    if (!resizing) return;

    document.body.style.userSelect = 'none';

    const handleLeftResize = (allocation: Allocation, steps: number) => {
      const init = resizing.initialDateIndex + steps;
      const span = resizing.initialSpan - steps;

      if (span < 1 || init < 0 || init + span > dates.length) return;

      const newAllocation = { ...allocation, span, iniDate: dates[init].label };
      if (isCellOccupied(dates, allocations.values, newAllocation)) return;

      allocations.set(newAllocation);
    };

    const handleRightResize = (allocation: Allocation, steps: number) => {
      const span = resizing.initialSpan + steps;

      if (span < 1 || resizing.initialDateIndex + span > dates.length) return;

      const newAllocation = { ...allocation, span };
      if (isCellOccupied(dates, allocations.values, newAllocation)) return;

      allocations.set(newAllocation);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const steps = Math.round((e.clientX - resizing.startX) / CELL_W);

      const allocation = allocations.values.find((a) => a.id === resizing.allocationId);
      if (!allocation) return;

      if (resizing.direction === 'left') {
        handleLeftResize(allocation, steps);
      } else {
        handleRightResize(allocation, steps);
      }
    };

    const handleMouseUp = () => {
      setResizing(undefined);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, dates, allocations]);

  return [resizing, setResizing];
}
