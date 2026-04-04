
import { type RefObject, useEffect, useState } from 'react';

import { type Position } from '@/models';

interface PannableOptions {
  ref: RefObject<HTMLElement | null>;
  onPan: (position: Position) => void;
}

export function usePannable({ ref, onPan }: PannableOptions) {
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return; // Middle mouse button
      setIsPanning(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      onPan({ x: deltaX, y: deltaY, w: 0, h: 0 });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 1) return;
      setIsPanning(false);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, onPan, ref, startPos.x, startPos.y]);
}
