export type TicketStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
};