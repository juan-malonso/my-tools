import React from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  lang?: string;
}

export function BaseLayout({
  children,
  className = "",
  lang = "en",
}: BaseLayoutProps) {
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${className}`}
      >
        {children}
      </body>
    </html>
  );
}
