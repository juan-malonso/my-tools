import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  lang?: string;
}

export function Layout({ children, lang = 'en' }: LayoutProps) {
  return (
    <html lang={lang} style={htmlStyle}>
      {children}
    </html>
  );
}

const htmlStyle: React.CSSProperties = {
  height: '100%',
  width: '100%'
};
