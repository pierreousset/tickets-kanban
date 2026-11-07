import type { CreateTicketMutation } from './mutations/__generated__/CreateTicketMutation.graphql'
import type { UpdateTicketMutation } from './mutations/__generated__/UpdateTicketMutation.graphql'

export type TicketStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'

export type Ticket = {
  id: string
  title: string
  description: string
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateTicketInput = CreateTicketMutation['variables']['input']

export type TicketView = Omit<Ticket, 'status'> & {
  status: TicketStatus | 'unknown'
}

const isTicketStatus = (value: unknown): value is TicketStatus => {
  return (
    value === 'todo' ||
    value === 'in_progress' ||
    value === 'done' ||
    value === 'cancelled'
  )
}

export type StatusFilter = 'all' | TicketStatus

export type UpdateTicketInput = UpdateTicketMutation['variables']['input']

export { isTicketStatus }
