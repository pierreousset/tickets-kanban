import { useState } from 'react'

import { Header } from './components/Header'
import { TicketCard } from './features/tickets/components/ticket-card'
import { useTickets } from './features/tickets/hooks/use-tickets'
import type { TicketStatus } from './features/tickets/types'

type StatusFilter = 'all' | TicketStatus

const App = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { tickets, createTicket, updateTicketStatus } = useTickets()

  const filteredTickets =
    statusFilter === 'all'
      ? tickets
      : tickets.filter((ticket) => ticket.status === statusFilter)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <Header
          onCreate={createTicket}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredTickets.length === 0 ? (
          <p className="text-slate-600">Aucun ticket pour ce filtre.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard
                  ticket={ticket}
                  onStatusChange={updateTicketStatus}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default App
