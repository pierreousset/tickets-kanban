import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

import { Button } from '@repo/ui/components/button'
import { Input } from '@repo/ui/components/input'
import { Toaster, toast } from '@repo/ui/components/toast'

import { AppSidebar } from './components/app-sidebar'
import { CreateTicketDialog } from './features/tickets/components/create-ticket-dialog'
import { TicketBoard } from './features/tickets/components/ticket-board'
import { TicketDetailsSheet } from './features/tickets/components/ticket-details-sheet'
import { useTickets } from './features/tickets/hooks/use-tickets'
import { ticketStatuses } from './features/tickets/ticket-statuses'
import type {
  CreateTicketInput,
  TicketStatus,
  UpdateTicketInput,
} from './features/tickets/types'

type MoveError = {
  ticketId: string
  status: TicketStatus
  message: string
}

const App = () => {
  const { tickets, createTicket, updateTicketStatus, updateTicket } =
    useTickets()

  const [search, setSearch] = useState('')
  const [moveError, setMoveError] = useState<MoveError | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set())

  const pendingIdsRef = useRef(new Set<string>())
  const focusTicketIdRef = useRef<string | null>(null)
  const detailsActiveRef = useRef(false)

  const normalizedSearch = search.trim().toLocaleLowerCase('fr')

  const visibleTickets = tickets.filter((ticket) =>
    `${ticket.title} ${ticket.description}`
      .toLocaleLowerCase('fr')
      .includes(normalizedSearch),
  )

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? null

  useEffect(() => {
    if (detailsActiveRef.current) return

    const id = focusTicketIdRef.current

    if (!id) return

    if (document.activeElement === document.body) {
      document.getElementById(`ticket-open-${id}`)?.focus()
    }

    if (!pendingIds.has(id)) {
      focusTicketIdRef.current = null
    }
  }, [tickets, pendingIds])

  const handleNavigate = (status: TicketStatus) => {
    document.getElementById(`column-${status}`)?.focus()
  }

  const handleOpenTicket = (id: string) => {
    focusTicketIdRef.current = null
    detailsActiveRef.current = true

    setSelectedTicketId(id)
    setDetailsOpen(true)
  }

  const handleDetailsOpenChange = (open: boolean) => {
    if (open) {
      detailsActiveRef.current = true
    }

    setDetailsOpen(open)
  }

  const handleDetailsOpenChangeComplete = (open: boolean) => {
    if (!open && !detailsOpen) {
      detailsActiveRef.current = false
      focusTicketIdRef.current = null
    }
  }

  const handleCreateTicket = async (input: CreateTicketInput) => {
    await createTicket(input)
    setSearch('')

    toast.add({
      type: 'success',
      title: 'Ticket créé',
      description: input.title,
    })
  }

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    const ticket = tickets.find((item) => item.id === id)

    if (!ticket || pendingIdsRef.current.has(id)) return

    setMoveError((current) => (current?.ticketId === id ? null : current))

    if (ticket.status === status) return

    pendingIdsRef.current.add(id)
    focusTicketIdRef.current = detailsActiveRef.current ? null : id

    setPendingIds(new Set(pendingIdsRef.current))

    try {
      await updateTicketStatus(id, status)

      const label =
        ticketStatuses.find((item) => item.value === status)?.label ?? status

      toast.add({
        id: `ticket-status-${id}`,
        type: 'success',
        title: 'Statut mis à jour',
        description: `« ${ticket.title} » → ${label}`,
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Réessaie dans un instant.'

      setMoveError({
        ticketId: id,
        status,
        message: `Impossible de déplacer « ${ticket.title} ». ${message}`,
      })
    } finally {
      pendingIdsRef.current.delete(id)
      setPendingIds(new Set(pendingIdsRef.current))
    }
  }

  const handleRetryMove = async () => {
    if (!moveError) return

    await handleStatusChange(moveError.ticketId, moveError.status)
  }

  const handleUpdateTicket = async (
    id: string,
    input: UpdateTicketInput,
  ): Promise<void> => {
    if (pendingIdsRef.current.has(id)) {
      throw new Error(
        'Une modification de ce ticket est déjà en cours. Réessaie dans un instant.',
      )
    }

    pendingIdsRef.current.add(id)
    setPendingIds(new Set(pendingIdsRef.current))

    try {
      await updateTicket(id, input)

      toast.add({
        type: 'success',
        title: 'Ticket modifié',
        description: input.title,
      })
    } finally {
      pendingIdsRef.current.delete(id)
      setPendingIds(new Set(pendingIdsRef.current))
    }
  }

  const errorFeedback = moveError ? (
    <div
      role="alert"
      className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
    >
      <p className="text-sm text-destructive">{moveError.message}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pendingIds.has(moveError.ticketId)}
          onClick={handleRetryMove}
        >
          Réessayer
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMoveError(null)}
        >
          Masquer
        </Button>
      </div>
    </div>
  ) : null

  return (
    <>
      <div className="flex h-svh overflow-hidden bg-background text-foreground">
        <AppSidebar onNavigate={handleNavigate} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 md:px-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Mon espace
              </p>

              <h1
                id="tickets-heading"
                tabIndex={-1}
                className="mt-1 rounded text-xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Tickets
              </h1>
            </div>

            <CreateTicketDialog onCreate={handleCreateTicket} />
          </header>

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
            <div className="relative w-full max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un ticket…"
                aria-label="Rechercher un ticket"
                className="pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Clique sur un ticket pour consulter ses détails.
            </p>
          </div>

          {!detailsOpen && errorFeedback && (
            <div className="mx-4 mb-4 md:mx-6">{errorFeedback}</div>
          )}

          {normalizedSearch && visibleTickets.length === 0 && (
            <div className="mx-4 mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 md:mx-6">
              <p className="text-sm text-muted-foreground">
                Aucun ticket pour « {search.trim()} ».
              </p>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearch('')}
              >
                Effacer la recherche
              </Button>
            </div>
          )}

          <div className="min-h-0 flex-1">
            <TicketBoard
              tickets={visibleTickets}
              pendingIds={pendingIds}
              onStatusChange={handleStatusChange}
              onOpen={handleOpenTicket}
            />
          </div>
        </main>
      </div>

      <TicketDetailsSheet
        ticket={selectedTicket}
        open={detailsOpen}
        isUpdating={
          selectedTicket !== null && pendingIds.has(selectedTicket.id)
        }
        onOpenChange={handleDetailsOpenChange}
        onOpenChangeComplete={handleDetailsOpenChangeComplete}
        onSave={handleUpdateTicket}
        feedback={detailsOpen ? errorFeedback : null}
      />

      <Toaster limit={3} timeout={4000} />
    </>
  )
}

export default App
