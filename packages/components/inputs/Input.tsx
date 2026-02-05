export interface InputProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

const style = "text-xs text-gray-400";

export function Input({ label, children = <></> }: InputProps) {
  return (
    <>
      <label className={`${style}`}>{label}</label>
      {children}
    </>
  );
}
