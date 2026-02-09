export interface SectionProps {
  title: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  actions: React.ReactNode;
  children: React.ReactNode;
}

export function Section({ title, level = 'h2', actions, children }: SectionProps) {
  const Tag = level;

  return (
    <div>
      <div className="flex justify-between pb-4">
        <Tag className="text-sm uppercase text-gray-500 font-semibold tracking-wider">{title}</Tag>
        {actions}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
