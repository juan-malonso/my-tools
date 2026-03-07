export const TaskBoxResize: React.FC<{
  position: 'left' | 'right';
  onResize: (e: React.MouseEvent) => void;
}> = ({ position, onResize }) => {
  return (
    <div
      className={`absolute 
          w-8 ${position}-0 top-0 bottom-0 
          cursor-ew-resize
          opacity-0 hover:opacity-100
          flex ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}
        `}
      onMouseDown={onResize}
    >
      <div className={`top-0 bottom-0 w-2.5 bg-gray-700/50`} />
    </div>
  );
};
