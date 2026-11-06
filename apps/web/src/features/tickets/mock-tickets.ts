import type { Ticket } from './types'

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Créer la page des projets',
    description: 'Présenter les projets disponibles.',
    status: 'todo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ticket-2',
    title: 'Afficher les tickets',
    description: 'Construire la liste et afficher les statuts.',
    status: 'in_progress',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ticket-3',
    title: 'Configurer le monorepo',
    description: 'Installer Bun, Turbo et Vite.',
    status: 'done',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]