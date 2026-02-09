export interface CardProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'none';
  className?: string;
  background?: string;
  actions: React.ReactNode;
  children?: React.ReactNode;
}

const header = 'border-b-2 border-gray-700';

export function Card({
  icon = '',
  title = '',
  level = 'h3',
  className = '',
  background = '',
  actions,
  children = <></>
}: CardProps) {
  const Tag = level === 'none' ? 'h3' : level;

  const $header =
    level !== 'none' ? (
      <div className={`${header} flex justify-between items-center p-3 ${className}`}>
        <Tag className="flex gap-2 tracking-wider  items-center w-full">
          {icon} {title}
        </Tag>
        {actions}
      </div>
    ) : (
      <></>
    );

  return (
    <div className={`bg-gray-800 rounded-lg ${background}`}>
      {$header}
      <div className="space-y-3 p-3">{children}</div>
    </div>
  );
}
