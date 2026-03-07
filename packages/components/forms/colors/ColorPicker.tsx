import React from 'react';

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
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
  '#64748b'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  shape = 'rounded',
  size = 'md',
  className = '',
  disabled = false,
  children
}) => {
  // Función para rotar colores (comportamiento original)
  const handleRotateColor = () => {
    if (disabled) return;
    const currentIndex = PRESET_COLORS.indexOf(value);
    const nextIndex = (currentIndex + 1) % PRESET_COLORS.length;
    onChange(PRESET_COLORS[nextIndex]);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        disabled={disabled}
        onClick={handleRotateColor}
        style={{ backgroundColor: value }}
        className={`
          ${shapeStyles[shape]} 
          ${sizeStyles[size]}
          cursor-pointer shadow-sm transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none
          ${className}
        `}
      >
        {children}
      </button>
    </div>
  );
};
