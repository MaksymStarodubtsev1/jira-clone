export interface Ticket {
  id: string;
  title: string;
  description: string;
  index?: number
  columnId: string
}

export interface Column {
  id: string;
  title: string;
  cards: Ticket[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}
