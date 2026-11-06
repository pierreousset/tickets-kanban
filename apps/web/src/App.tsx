import { useState } from 'react'
import { mockTickets } from './features/tickets/mock-tickets'
import type { Ticket, TicketStatus } from './features/tickets/types'
import { TicketCard } from './features/tickets/components/ticket-card'
import { Header } from './components/Header'

export default function App() {
  type StatusFilter = 'all' | TicketStatus

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)

  const filteredTickets =
    statusFilter === 'all'
      ? tickets
      : tickets.filter((ticket) => ticket.status === statusFilter)

  function handleStatusChange(ticketId: string, status: TicketStatus) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket,
      ),
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Header
          tickets={tickets}
          setTickets={setTickets}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard ticket={ticket} onStatusChange={handleStatusChange} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
