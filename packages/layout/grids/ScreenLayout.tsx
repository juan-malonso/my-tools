import React from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

// Estilos inline para el patrón de grid específico del index.html
const gridBackgroundStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(45deg, #1f2937 25%, transparent 25%),
    linear-gradient(-45deg, #1f2937 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1f2937 75%),
    linear-gradient(-45deg, transparent 75%, #1f2937 75%)`,
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

interface ScreenLayoutProps {
  children: React.ReactNode; // Contenido principal (Main)
  sidebar?: React.ReactNode; // Contenido del Sidebar
  headerTitle?: React.ReactNode; // Título de la App
  headerActions?: React.ReactNode; // Botones del Header
  className?: string;
}

export function ScreenLayout({
  children,
  sidebar,
  headerTitle = "App",
  headerActions,
  className = "",
}: ScreenLayoutProps) {
  return (
    <div
      className={`flex flex-col h-screen overflow-hidden bg-gray-950 text-gray-100 font-sans ${className}`}
    >
      <Header title={headerTitle}>{headerActions}</Header>

      <div className="flex flex-1 h-full overflow-hidden">
        {sidebar && <Sidebar>{sidebar}</Sidebar>}

        <main
          className="flex-1 relative bg-gray-950 flex items-center justify-center overflow-hidden select-none touch-none"
          style={gridBackgroundStyle}
          id="preview-container"
        >
          {/* Capa para contenido interactivo */}
          {children}
        </main>
      </div>
    </div>
  );
}
