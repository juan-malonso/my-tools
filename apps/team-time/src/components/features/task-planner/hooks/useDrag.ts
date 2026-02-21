import { useState, type DragEvent } from 'react';

import type { Allocation, Utils } from '@/models';

import { isCellOccupied, type ItemDate } from '../utils/handlers';

export function useDrag(
  dates: ItemDate[],
  allocations: Utils<Allocation>
): [
  (e: DragEvent<HTMLDivElement>, allocation: Allocation) => void,
  (e: DragEvent<HTMLDivElement>, memberId: string, iniDate: string) => void,
  Allocation | undefined
] {
  const [dragged, setDragged] = useState<Allocation | undefined>(undefined);

  const handleDrag = (e: DragEvent<HTMLDivElement>, allocation: Allocation) => {
    setDragged(allocation);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, memberId: string, iniDate: string) => {
    e.preventDefault();
    if (dragged) {
      const allocation = allocations.values.find((a) => a.id === dragged.id);
      if (!allocation) return;

      const newAllocation = { ...allocation, memberId, iniDate };
      if (isCellOccupied(dates, allocations.values, newAllocation)) {
        setDragged(undefined);
        return;
      }

      allocations.set({ ...allocation, memberId, iniDate });
      setDragged(undefined);
    }
  };

  return [handleDrag, handleDrop, dragged];
}
