export type TicketStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'

export type Ticket = {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
}

export const tickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Créer la page des projets',
    description: 'Afficher les projets disponibles.',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ticket-2',
    title: 'Afficher les tickets',
    description: 'Présenter les tickets sous forme de cartes.',
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ticket-3',
    title: 'Configurer le monorepo',
    description: 'Relier les applications et les packages partagés.',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
