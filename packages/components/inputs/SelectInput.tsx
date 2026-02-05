import { Input } from "./Input";

export interface SelectInputProps {
  label: React.ReactNode;
  className?: string;
  defaultValue: string;
  options: (string | { label: string; value: string })[];
  onChange?: (e: any) => void;
}

const style = "bg-gray-900 border border-gray-700 w-full rounded-md px-2 py-1";

export function SelectInput({
  label,
  className = "",
  options,
  defaultValue,
  onChange,
}: SelectInputProps) {
  return (
    <Input label={label}>
      <select
        className={`${style} ${className}`}
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((option, index) =>
          typeof option === "string"
            ? SelectOption(index, option, option)
            : SelectOption(index, option.value, option.label),
        )}
      </select>
    </Input>
  );
}

const SelectOption = (index: number, value: string, label: string) => (
  <option key={index} value={value}>
    {label}
  </option>
);
