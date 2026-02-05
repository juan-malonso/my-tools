export interface CardProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "none";
  actions: React.ReactNode;
  children?: React.ReactNode;
}

const color = "bg-gray-800";
const header = "border-b-2 border-gray-700";

export function Card({
  icon = "",
  title = "",
  level: Tag = "h3",
  actions,
  children = <></>,
}: CardProps) {
  const $header =
    Tag !== "none" ? (
      <div className={`${header} flex justify-between p-3`}>
        <Tag className="flex gap-2 text-sm tracking-wider">
          {icon} {title}
        </Tag>
        {actions}
      </div>
    ) : (
      <></>
    );

  return (
    <div className={`${color} rounded-lg`}>
      {$header}
      <div className="space-y-3 p-3 ">{children}</div>
    </div>
  );
}
