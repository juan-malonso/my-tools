import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vile Vote',
  description: 'Vile Vote Application'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen">{children}</body>
    </html>
  );
}
