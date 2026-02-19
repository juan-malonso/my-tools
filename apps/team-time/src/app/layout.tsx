import type { Metadata } from 'next';

import { Layout } from '@packages/layout';
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
  return <Layout lang="es">{children}</Layout>;
}
