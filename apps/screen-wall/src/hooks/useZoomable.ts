
import { type RefObject, useEffect } from 'react';

interface ZoomableOptions {
  ref: RefObject<HTMLElement | null>;
  onZoom: (deltaY: number) => void;
}

export function useZoomable({ ref, onZoom }: ZoomableOptions) {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      onZoom(e.deltaY);
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, [onZoom, ref]);
}
