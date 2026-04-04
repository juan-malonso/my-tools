import { type RefObject, useEffect, useState } from 'react';

interface DraggableOptions {
  ref: RefObject<HTMLElement | null>;
  initialPosition: { x: number; y: number };
  onDragEnd: (position: { x: number; y: number }) => void;
}

export function useDraggable({ ref, initialPosition, onDragEnd }: DraggableOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.left = `${position.x.toString()}px`;
      ref.current.style.top = `${position.y.toString()}px`;
    }
  }, [position, ref]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      onDragEnd(position);
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
  }, [isDragging, onDragEnd, position, ref, startPos.x, startPos.y]);
}
