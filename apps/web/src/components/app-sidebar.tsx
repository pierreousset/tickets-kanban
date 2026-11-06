import { Ticket } from 'lucide-react'

import { Button } from '@repo/ui/components/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip'

import { ticketStatuses } from '../features/tickets/ticket-statuses'
import type { TicketStatus } from '../features/tickets/types'

type AppSidebarProps = {
  onNavigate: (status: TicketStatus) => void
}

const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-6 border-r bg-sidebar py-4 text-sidebar-foreground">
      <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Ticket className="size-5" aria-hidden="true" />
        <span className="sr-only">Tickets</span>
      </div>

      <TooltipProvider>
        <nav aria-label="Colonnes du tableau" className="flex flex-col gap-2">
          {ticketStatuses.map(({ value, label, icon: Icon }) => (
            <Tooltip key={value}>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Aller à la colonne ${label}`}
                    onClick={() => onNavigate(value)}
                  />
                }
              >
                <Icon className="size-4" aria-hidden="true" />
              </TooltipTrigger>

              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  )
}

export { AppSidebar }
