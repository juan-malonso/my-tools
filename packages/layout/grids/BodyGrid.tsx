import React from 'react';

import { Body } from '../components';
import { Header } from '../components/Header';

interface BodyGridProps {
  headName: string;
  headIcon: string;
  headStyles?: React.ReactNode;
  headDeps?: React.ReactNode;

  headerTitle?: React.ReactNode;
  headerTopnav?: React.ReactNode;
  headerActions?: React.ReactNode;

  children: React.ReactNode;
}

const headerId = 'header';
const mainId = 'main';

export function BodyGrid({
  headName,
  headIcon,
  headStyles = <></>,
  headDeps = <></>,

  headerTitle,
  headerTopnav,
  headerActions,

  children
}: BodyGridProps) {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href={headIcon} />
        <title>{headName}</title>
        {headStyles}
        {headDeps}
      </head>
      <Grid>
        <header className={`[grid-area:${headerId}] z-50`}>
          <Header title={headerTitle} topnav={headerTopnav} actions={headerActions}></Header>
        </header>
        <main className={`[grid-area:${mainId}]`}>
          <Body>{children}</Body>
        </main>
      </Grid>
    </>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <body
      className={`
        h-full w-full overflow-hidden
        grid 
        grid-rows-[60px_calc(100%-60px)]
        grid-cols-[
        grid-cols-[100%]
        [grid-template-areas:'${headerId}'_'${mainId}']
      `}
    >
      {children}
    </body>
  );
}
