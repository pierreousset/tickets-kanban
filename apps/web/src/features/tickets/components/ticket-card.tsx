import { useDraggable } from '@dnd-kit/react'
import { Ellipsis, GripVertical, LoaderCircle } from 'lucide-react'

import { Button } from '@repo/ui/components/button'
import { Card } from '@repo/ui/components/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { cn } from '@repo/ui/lib/utils'

import { ticketStatuses } from '../ticket-statuses'
import { isTicketStatus } from '../types'
import type { TicketStatus, TicketView } from '../types'

type TicketCardProps = {
  ticket: TicketView
  isUpdating: boolean
  onStatusChange: (id: string, status: TicketStatus) => Promise<void>
}

const TicketCard = ({
  ticket,
  isUpdating,
  onStatusChange,
}: TicketCardProps) => {
  const { ref, handleRef, isDragging } = useDraggable({
    id: ticket.id,
    type: 'ticket',
    disabled: isUpdating,
  })

  const handleStatusChange = async (value: unknown) => {
    if (!isTicketStatus(value) || value === ticket.status || isUpdating) {
      return
    }

    await onStatusChange(ticket.id, value)
  }

  return (
    <Card
      ref={ref}
      id={`ticket-${ticket.id}`}
      role="group"
      tabIndex={-1}
      aria-labelledby={`ticket-title-${ticket.id}`}
      aria-busy={isUpdating}
      className={cn(
        'gap-2 rounded-xl border border-border/70 bg-card p-3 shadow-xs ring-0',
        'transition-[border-color,box-shadow] duration-150 motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDragging
          ? 'border-primary/40 shadow-md'
          : 'hover:border-foreground/15 hover:shadow-sm',
      )}
    >
      <div className="flex items-start gap-2">
        <h3
          id={`ticket-title-${ticket.id}`}
          className="min-w-0 flex-1 break-words pt-1 text-sm font-medium leading-5"
        >
          {ticket.title}
        </h3>

        <div className="flex shrink-0 items-center">
          <Button
            ref={handleRef}
            type="button"
            variant="ghost"
            size="icon"
            disabled={isUpdating}
            aria-label={
              isUpdating
                ? `Enregistrement du ticket ${ticket.title}`
                : `Déplacer le ticket ${ticket.title}`
            }
            className="size-7 touch-none cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
          >
            {isUpdating ? (
              <LoaderCircle
                className="size-3.5 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <GripVertical className="size-3.5" aria-hidden="true" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isUpdating}
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Changer le statut du ticket ${ticket.title}`}
                  className="size-7 text-muted-foreground hover:text-foreground"
                />
              }
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup
                value={ticket.status}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <DropdownMenuLabel>Déplacer vers</DropdownMenuLabel>

                {ticketStatuses.map(({ value, label, icon: Icon }) => (
                  <DropdownMenuRadioItem
                    key={value}
                    value={value}
                    closeOnClick
                    className="gap-2"
                  >
                    <Icon
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {ticket.description && (
        <p className="line-clamp-2 whitespace-pre-wrap break-words text-sm leading-5 text-muted-foreground">
          {ticket.description}
        </p>
      )}
    </Card>
  )
}

export { TicketCard }
