import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@repo/ui/components/input'

import { AppSidebar } from './components/app-sidebar'
import { CreateTicketDialog } from './features/tickets/components/create-ticket-dialog'
import { TicketBoard } from './features/tickets/components/ticket-board'
import { useTickets } from './features/tickets/hooks/use-tickets'
import type { CreateTicketInput, TicketStatus } from './features/tickets/types'

const App = () => {
  const { tickets, createTicket, updateTicketStatus } = useTickets()

  const [search, setSearch] = useState('')
  const [moveError, setMoveError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set())

  const pendingIdsRef = useRef(new Set<string>())
  const focusTicketIdRef = useRef<string | null>(null)

  const normalizedSearch = search.trim().toLocaleLowerCase('fr')

  const visibleTickets = tickets.filter((ticket) =>
    `${ticket.title} ${ticket.description}`
      .toLocaleLowerCase('fr')
      .includes(normalizedSearch),
  )

  // Une carte change de parent lorsqu'elle change de colonne.
  // On restaure le focus si son ancien élément a disparu.
  useEffect(() => {
    const id = focusTicketIdRef.current

    if (!id) return

    if (document.activeElement === document.body) {
      document.getElementById(`ticket-${id}`)?.focus()
    }

    if (!pendingIds.has(id)) {
      focusTicketIdRef.current = null
    }
  }, [tickets, pendingIds])

  const handleNavigate = (status: TicketStatus) => {
    document.getElementById(`column-${status}`)?.focus()
  }

  const handleCreateTicket = async (input: CreateTicketInput) => {
    await createTicket(input)
    setSearch('')
  }

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    const ticket = tickets.find((item) => item.id === id)

    if (!ticket || ticket.status === status || pendingIdsRef.current.has(id)) {
      return
    }

    pendingIdsRef.current.add(id)
    focusTicketIdRef.current = id

    setPendingIds(new Set(pendingIdsRef.current))
    setMoveError(null)
    setAnnouncement('')

    try {
      await updateTicketStatus(id, status)

      setAnnouncement(
        `Le statut du ticket « ${ticket.title} » a été enregistré.`,
      )
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Réessaie dans un instant.'

      setMoveError(`Impossible de déplacer « ${ticket.title} ». ${message}`)
    } finally {
      pendingIdsRef.current.delete(id)
      setPendingIds(new Set(pendingIdsRef.current))
    }
  }

  return (
    <div className="flex h-svh overflow-hidden bg-background text-foreground">
      <AppSidebar onNavigate={handleNavigate} />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Mon espace
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight">
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
            Déplace les cartes pour changer leur statut.
          </p>
        </div>

        {moveError && (
          <p
            role="alert"
            className="mx-4 mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive md:mx-6"
          >
            {moveError}
          </p>
        )}

        <p role="status" className="sr-only">
          {announcement}
        </p>

        <div className="min-h-0 flex-1">
          <TicketBoard
            tickets={visibleTickets}
            pendingIds={pendingIds}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  )
}

export default App
