import { Layout } from '@packages/layout';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Screen Wall',
  description: 'Screen Wall Application'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout lang="en">{children}</Layout>;
}
