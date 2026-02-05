import { Input } from "./Input";

export interface NumberInputProps {
  label: React.ReactNode;
  placeholder?: string;
  className?: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  onChange?: (e: any) => void;
}

const style = "bg-gray-900 border border-gray-700 w-full rounded-md px-2 py-1";

export function NumberInput({
  label,
  placeholder,
  className = "",
  defaultValue,
  minValue,
  maxValue,
  step = 1,
  onChange,
}: NumberInputProps) {
  return (
    <Input label={label}>
      <input
        type="number"
        className={`${style} ${className}`}
        placeholder={placeholder}
        value={defaultValue}
        min={minValue}
        max={maxValue}
        step={step}
        onChange={onChange}
      />
    </Input>
  );
}
