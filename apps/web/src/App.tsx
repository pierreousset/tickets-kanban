import { useState } from 'react'
import { mockTickets } from './features/tickets/mock-tickets'
import type { TicketStatus } from './features/tickets/types'

export default function App() {

  const statusLabels: Record<TicketStatus, string> = {
    todo: 'À faire',
    in_progress: 'En cours',
    done: 'Terminé',
    cancelled: 'Annulé',
  }

  type StatusFilter = TicketStatus | 'all'

  const filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'done', label: 'Terminés' },
  ]

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredTickets = mockTickets.filter((ticket) => {
    if (statusFilter === 'all') return true
    return ticket.status === statusFilter
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Projet démo
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Tickets
          </h1>
          <p className="mt-3 text-slate-600">
            Organise et suis l’avancement de ton projet.
          </p>
          <div
            role="group"
            aria-label="Filtrer les tickets par statut"
            className="mb-6 flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={statusFilter === filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${statusFilter === filter.value
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {filteredTickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <h2 className="font-semibold">{ticket.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {ticket.description}
                  </p>
                </div>

                <span className="w-fit shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {statusLabels[ticket.status]}
                </span>
              </li>
            ))}
          </ul>
        </header>
      </div>
    </main>
  )
}