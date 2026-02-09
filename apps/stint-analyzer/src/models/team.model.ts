export interface Team {
  name: string;
  color: string;
  hex: string;
}

export const teams: Record<string, Team> = {
  mclaren: { name: 'McLaren', color: 'orange-500', hex: '' },
  mercedes: { name: 'Mercedes', color: 'teal-300', hex: '' },
  redbull: { name: 'Red Bull', color: 'blue-900', hex: '' },
  ferrari: { name: 'Ferrari', color: 'red-500', hex: '' },
  william: { name: 'Williams', color: 'blue-500', hex: '' },
  racingbulls: { name: 'Racing Bulls', color: 'blue-700', hex: '' },
  astonmartin: { name: 'Aston Martin', color: 'green-500', hex: '' },
  hass: { name: 'Haas', color: 'gray-500', hex: '' },
  audi: { name: 'Audi', color: 'gray-200', hex: '' },
  alpine: { name: 'Alpine', color: 'blue-200', hex: '' },
  alphatauri: { name: 'AlphaTauri', color: 'purple-500', hex: '' }
};
