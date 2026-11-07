import {
  DragDropProvider,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/react'

import { Badge } from '@repo/ui/components/badge'
import { cn } from '@repo/ui/lib/utils'

import { ticketStatuses } from '../ticket-statuses'
import { isTicketStatus } from '../types'
import type { TicketStatus, TicketView } from '../types'
import { TicketCard } from './ticket-card'

type TicketBoardProps = {
  tickets: TicketView[]
  pendingIds: ReadonlySet<string>
  onStatusChange: (id: string, status: TicketStatus) => Promise<void>
  onOpen: (id: string) => void
}

type TicketColumnProps = TicketBoardProps & {
  status: TicketView['status']
  label: string
}

const TicketColumn = ({
  status,
  label,
  tickets,
  pendingIds,
  onStatusChange,
  onOpen,
}: TicketColumnProps) => {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    accept: 'ticket',
    disabled: status === 'unknown',
  })

  return (
    <section
      ref={ref}
      aria-labelledby={`column-${status}`}
      className={cn(
        'flex h-full w-72 shrink-0 flex-col rounded-xl border bg-muted/40',
        isDropTarget && 'border-primary bg-primary/5',
      )}
    >
      <header className="flex items-center justify-between gap-3 p-4">
        <h2
          id={`column-${status}`}
          tabIndex={-1}
          className="rounded text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label}
        </h2>

        <Badge variant="secondary">{tickets.length}</Badge>
      </header>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <TicketCard
              ticket={ticket}
              isUpdating={pendingIds.has(ticket.id)}
              onStatusChange={onStatusChange}
              onOpen={onOpen}
            />
          </li>
        ))}

        {tickets.length === 0 && (
          <li className="grid min-h-36 place-items-center rounded-lg border border-dashed px-4 text-center text-sm text-muted-foreground">
            Aucun ticket
          </li>
        )}
      </ul>
    </section>
  )
}

const TicketBoard = ({
  tickets,
  pendingIds,
  onStatusChange,
  onOpen,
}: TicketBoardProps) => {
  const unknownTickets = tickets.filter((ticket) => ticket.status === 'unknown')

  const handleDragEnd = async (event: DragEndEvent) => {
    if (event.canceled) return

    const { source, target } = event.operation

    if (!source || !target || !isTicketStatus(target.id)) return

    const ticket = tickets.find((item) => item.id === source.id)

    if (!ticket || ticket.status === target.id || pendingIds.has(ticket.id)) {
      return
    }

    await onStatusChange(ticket.id, target.id)
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-4 overflow-x-auto px-4 pb-4 pt-1 md:px-6">
        {ticketStatuses.map(({ value, label }) => (
          <TicketColumn
            key={value}
            status={value}
            label={label}
            tickets={tickets.filter((ticket) => ticket.status === value)}
            pendingIds={pendingIds}
            onStatusChange={onStatusChange}
            onOpen={onOpen}
          />
        ))}

        {unknownTickets.length > 0 && (
          <TicketColumn
            status="unknown"
            label="Statut inconnu"
            tickets={unknownTickets}
            pendingIds={pendingIds}
            onStatusChange={onStatusChange}
            onOpen={onOpen}
          />
        )}
      </div>
    </DragDropProvider>
  )
}

export { TicketBoard }
