import { Layout } from '@packages/layout';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Team Time',
  description: 'Team Time Application'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout lang="en">{children}</Layout>;
}
