import React from 'react';

import { Section } from '@packages/components';

export interface SidebarContentProps {
  items?: {
    title: string;
    actions?: React.ReactNode;
    content?: React.ReactNode;
  }[];
}

export function SidebarContent({ items = [] }: SidebarContentProps) {
  return (
    <div className="flex flex-col space-y-5">
      {items.map(({ title, content = <></>, actions = <></> }, index) => (
        <Section key={index} title={`${(index + 1).toFixed(0)}. ${title}`} actions={actions}>
          {content}
        </Section>
      ))}
    </div>
  );
}
