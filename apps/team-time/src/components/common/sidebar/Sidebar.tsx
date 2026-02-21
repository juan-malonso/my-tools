import React from 'react';

import type { Config } from '@/models';

interface SidebarProps {
  config: Config;
}

export const Sidebar: React.FC<SidebarProps> = ({ config }) => {
  const { members } = config;

  // Alturas deben coincidir con las definidas en Body.tsx
  const headerHeight = 30 + 30 + 40; // Mes + Semana + Día
  const rowHeight = 50; // Altura de fila de miembro

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e5e7eb',
        flexShrink: 0
      }}
    >
      {/* Cabecera del Sidebar alineada con la cabecera del Body */}
      <div
        style={{
          height: `${String(headerHeight)}px`,
          display: 'flex',
          alignItems: 'end',
          justifyContent: 'center',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f3f4f6',
          fontWeight: 'bold',
          boxSizing: 'border-box',
          padding: '8px'
        }}
      >
        Miembros
      </div>

      {/* Filas de miembros alineadas con las filas del Body */}
      <div>
        {members.values.map((member) => (
          <div
            key={member.id}
            style={{
              height: `${String(rowHeight)}px`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderBottom: '1px solid #e5e7eb',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
              fontWeight: 500
            }}
          >
            {member.name}
          </div>
        ))}
      </div>
    </div>
  );
};
