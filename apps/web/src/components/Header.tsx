
import type { Ticket, TicketStatus } from '../features/tickets/types'
import { CreateTicketDialog } from '../features/tickets/components/create-ticket-dialog'

export function Header({
  tickets,
  setTickets,
  statusFilter,
  setStatusFilter,
}: {
  tickets: Ticket[],
  setTickets: (tickets: Ticket[]) => void,
  statusFilter: 'all' | TicketStatus,
  setStatusFilter: (statusFilter: 'all' | TicketStatus) => void,
}) {

  const filters: { value: 'all' | TicketStatus; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'done', label: 'Terminés' },
  ]

  return (
    <header className="mb-8 border-b border-slate-200 pb-8 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-500">Projet démo</p>
          <h1 className="mt-2 text-3xl font-bold">Tickets</h1>
          <p className="mt-3 text-slate-600">
            Organise et suis l’avancement de ton projet.
          </p>
        </div>
        <div className="flex justify-end">
          <CreateTicketDialog
            onCreate={(ticket) => {
              setTickets([ticket, ...tickets])
            }}
          />
        </div>
      </div>
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
    </header>
  )
}
