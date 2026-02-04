import type { Metadata } from "next";
import { BaseLayout, ScreenLayout } from "@packages/layout";
import "./globals.css"; // Asegúrate de mantener tus estilos globales si los tienes

export const metadata: Metadata = {
  title: "Screen Wall",
  description: "Screen Wall Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout lang="es">
      <ScreenLayout>{children}</ScreenLayout>
    </BaseLayout>
  );
}
