export interface InputProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

const style = 'text-xs text-gray-400 my-auto';

export function Input({ label, children = <></> }: InputProps) {
  return (
    <>
      <label className={style}>{label}</label>
      {children}
    </>
  );
}
