export interface Ticket {
  id: string;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  ticket: Ticket[];
}
