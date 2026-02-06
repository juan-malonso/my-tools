import React from 'react';

import { Body } from '../components';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

interface ScreenGridProps {
  headName: string;
  headIcon: string;
  headStyles?: React.ReactNode;
  headDeps?: React.ReactNode;

  headerTitle?: React.ReactNode;
  headerTopnav?: React.ReactNode;
  headerActions?: React.ReactNode;

  sidebarContent?: React.ReactNode;
  sidebarInstructions?: React.ReactNode;

  children: React.ReactNode;
}

const headerId = 'header';
const sidebarId = 'sidebar';
const mainId = 'main';

export function ScreenGrid({
  headName,
  headIcon,
  headStyles = <></>,
  headDeps = <></>,

  headerTitle,
  headerTopnav,
  headerActions,

  sidebarContent,
  sidebarInstructions,

  children
}: ScreenGridProps) {
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
        <aside className={`[grid-area:${sidebarId}] z-50`}>
          <Sidebar instructions={sidebarInstructions}>{sidebarContent}</Sidebar>
        </aside>
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
        grid-rows-[50px_1fr]
        grid-cols-[350px_1fr]
        [grid-template-areas:'${headerId}_${headerId}'_'${sidebarId}_${mainId}']
      `}
    >
      {children}
    </body>
  );
}
