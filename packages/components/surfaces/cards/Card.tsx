import React from 'react';

interface CardProps {
  header?: React.ReactNode;
  headerClassName?: string;
  sidenav?: React.ReactNode;
  sidenavClassName?: string;
  body?: React.ReactNode;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  className?: string;
}

/**
 * Layout Definido:
 * [ Header  ][ Header ]
 * [ Sidenav ][ Body   ]
 * [ Footer  ][ Footer ]
 */
const containerStyle = `
  h-full w-full rounded-2xl shadow-2xl 
  bg-slate-800 border border-slate-600 overflow-hidden
  grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]
  [grid-template-areas:'header_header''sidenav_body''sidenav_footer']
`;

export const Card: React.FC<CardProps> = ({
  header,
  headerClassName,
  sidenav,
  sidenavClassName,
  body,
  bodyClassName,
  footer,
  footerClassName,
  className = ''
}) => {
  return (
    <div className={`${containerStyle} ${className}`}>
      <CardHeader className={headerClassName}>{header}</CardHeader>
      <CardSidenav className={sidenavClassName}>{sidenav}</CardSidenav>
      <CardBody className={bodyClassName}>{body}</CardBody>
      <CardFooter className={footerClassName}>{footer}</CardFooter>
    </div>
  );
};

const sectionStyle = `
  w-full h-full p-4 border-slate-700/50 border
`;

const CardHeader: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  if (!children) return null;
  return <header className={`[grid-area:header] ${sectionStyle} ${className}`}>{children}</header>;
};

const CardSidenav: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  if (!children) return null;
  return (
    <aside
      className={`[grid-area:sidenav] ${sectionStyle} w-[200px] bg-slate-900/50 overflow-auto ${className}`}
    >
      {children}
    </aside>
  );
};

const CardBody: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  if (!children) return null;
  return (
    <main className={`[grid-area:body] ${sectionStyle} overflow-auto ${className}`}>
      {children}
    </main>
  );
};

const CardFooter: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  if (!children) return null;
  return (
    <footer className={`[grid-area:footer] ${sectionStyle} bg-slate-900/50 ${className}`}>
      {children}
    </footer>
  );
};
