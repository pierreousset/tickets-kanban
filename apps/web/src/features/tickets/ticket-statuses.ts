import {
  CheckCheck,
  Circle,
  CircleX,
  Clock3,
  type LucideIcon,
} from 'lucide-react'

import type { TicketStatus } from './types'

export const ticketStatuses = [
  { value: 'todo', label: 'À faire', icon: Circle },
  { value: 'in_progress', label: 'En cours', icon: Clock3 },
  { value: 'done', label: 'Terminé', icon: CheckCheck },
  { value: 'cancelled', label: 'Annulé', icon: CircleX },
] satisfies {
  value: TicketStatus
  label: string
  icon: LucideIcon
}[]
