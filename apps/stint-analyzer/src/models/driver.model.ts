import { type Stint } from './stint.model';
import { type Team, teams } from './team.model';

export interface Driver {
  pin?: boolean;
  number: number;
  name: string;
  team: Team;
  nationality: string;
  stints: Stint[];
}

export const drivers: Record<string, Driver> = {
  // McLaren
  ['NOR']: { number: 1, name: 'Lando Norris', team: teams.mclaren, nationality: 'UK', stints: [] },
  ['PIA']: {
    number: 81,
    name: 'Oscar Piastri',
    team: teams.mclaren,
    nationality: 'AU',
    stints: []
  },
  // Mercedes
  ['RUS']: {
    number: 63,
    name: 'George Russell',
    team: teams.mercedes,
    nationality: 'UK',
    stints: []
  },
  ['ANT']: {
    number: 12,
    name: 'Kimi Antonelli',
    team: teams.mercedes,
    nationality: 'IT',
    stints: []
  },
  // Red Bull
  ['VER']: {
    number: 3,
    name: 'Max Verstappen',
    team: teams.redbull,
    nationality: 'NL',
    stints: []
  },
  ['HAD']: { number: 6, name: 'Isack Hadjar', team: teams.redbull, nationality: 'FR', stints: [] },
  // Ferrari
  ['LEC']: {
    number: 16,
    name: 'Charles Leclerc',
    team: teams.ferrari,
    nationality: 'MC',
    stints: []
  },
  ['HAM']: {
    number: 44,
    name: 'Lewis Hamilton',
    team: teams.ferrari,
    nationality: 'UK',
    stints: []
  },
  // Williams
  ['ALB']: {
    number: 23,
    name: 'Alexander Albon',
    team: teams.william,
    nationality: 'DE',
    stints: []
  },
  ['SAI']: { number: 55, name: 'Carlos Sainz', team: teams.william, nationality: 'ES', stints: [] },
  // Racing Bulls
  ['LAW']: {
    number: 30,
    name: 'Liam Lawson',
    team: teams.racingbulls,
    nationality: 'NZ',
    stints: []
  },
  ['LIN']: {
    number: 41,
    name: 'Arvid Lindblad',
    team: teams.racingbulls,
    nationality: 'UK',
    stints: []
  },
  // Aston Martin
  ['ALO']: {
    number: 14,
    name: 'Fernando Alonso',
    team: teams.astonmartin,
    nationality: 'ES',
    stints: []
  },
  ['STR']: {
    number: 18,
    name: 'Lance Stroll',
    team: teams.astonmartin,
    nationality: 'CA',
    stints: []
  },
  // Haas
  ['BEA']: { number: 87, name: 'Oliver Bearman', team: teams.hass, nationality: 'UK', stints: [] },
  ['OCO']: { number: 31, name: 'Esteban Ocon', team: teams.hass, nationality: 'FR', stints: [] },
  // Audi
  ['HUL']: { number: 27, name: 'Nico Hulkenberg', team: teams.audi, nationality: 'DE', stints: [] },
  ['BOR']: {
    number: 5,
    name: 'Gabriel Bortoleto',
    team: teams.audi,
    nationality: 'FI',
    stints: []
  },
  // Alpine
  ['GAS']: { number: 10, name: 'Pierre Gasly', team: teams.alpine, nationality: 'FR', stints: [] },
  ['COL']: {
    number: 43,
    name: 'Fanco Colapinto',
    team: teams.alpine,
    nationality: 'AR',
    stints: []
  },
  // Cadillac
  ['BOT']: {
    number: 77,
    name: 'Valtteri Bottas',
    team: teams.alphatauri,
    nationality: 'FI',
    stints: []
  },
  ['PER']: {
    number: 11,
    name: 'Checo Pérez',
    team: teams.alphatauri,
    nationality: 'MX',
    stints: []
  }
};
