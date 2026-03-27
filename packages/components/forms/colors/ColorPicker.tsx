import React, { useState, useRef } from 'react'; // Añadimos useRef

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
  arrow,
  FloatingArrow
} from '@floating-ui/react';

type ColorPickerShape = 'circle' | 'square' | 'rounded';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  shape?: ColorPickerShape;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const shapeStyles: Record<ColorPickerShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-lg'
};

const sizeStyles = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
};

const PRESET_COLORS = [
  '#fecaca',
  '#fed7aa',
  '#fde68a',
  '#bbf7d0',
  '#a5f3fc',
  '#bfdbfe',
  '#ddd6fe',
  '#f5d0fe',
  '#f1f5f9',
  '#64748b',

  '#fca5a5',
  '#fdba74',
  '#fcd34d',
  '#86efac',
  '#67e8f9',
  '#93c5fd',
  '#c4b5fd',
  '#f0abfc',
  '#e2e8f0',
  '#475569',

  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#4ade80',
  '#22d3ee',
  '#60a5fa',
  '#a78bfa',
  '#e879f9',
  '#cbd5e1',
  '#334155',

  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
  '#94a3b8',
  '#1e293b',

  '#dc2626',
  '#ea580c',
  '#d97706',
  '#16a34a',
  '#0891b2',
  '#2563eb',
  '#7c3aed',
  '#c026d3',
  '#64748b',
  '#0f172a'
];

const ARROW_HEIGHT = 7;
const GAP = 10;

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  shape = 'rounded',
  size = 'md',
  className = '',
  disabled = false,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null); // Ref para el elemento de la flecha

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(GAP),
      flip(),
      shift({ padding: 10 }),
      arrow({ element: arrowRef }) // 3. Configuramos el middleware
    ]
  });

  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleColorSelect = (color: string) => {
    if (color) {
      onChange(color);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          type="button"
          disabled={disabled}
          style={{ backgroundColor: value }}
          className={`
            ${shapeStyles[shape]} 
            ${sizeStyles[size]}
            cursor-pointer shadow-sm transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none border-2 border-slate-300
            ${className}
          `}
        >
          {children}
        </button>
      </div>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50 bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-300 outline-none"
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill="#1e293b" // bg-slate-800
                stroke="#cbd5e1" // border-slate-300
                strokeWidth={1}
                height={ARROW_HEIGHT}
              />

              <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Color Picker
              </div>

              <div className="grid grid-cols-10 gap-1">
                {PRESET_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleColorSelect(color);
                    }}
                    style={{ backgroundColor: color }}
                    className="w-6 h-6 rounded-md transition-transform border border-slate-600 cursor-pointer shadow-sm hover:scale-110 hover:shadow-md"
                    title={color}
                  />
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
};
