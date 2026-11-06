import { useState } from 'react'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select'

import { isTicketStatus } from '../types'
import type { TicketStatus, TicketView } from '../types'

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
]

type TicketCardProps = {
  ticket: TicketView
  onStatusChange: (ticketId: string, status: TicketStatus) => Promise<void>
}

const TicketCard = ({ ticket, onStatusChange }: TicketCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleStatusChange = async (status: TicketStatus) => {
    if (isUpdating || status === ticket.status) return

    setIsUpdating(true)
    setUpdateError(null)

    try {
      await onStatusChange(ticket.id, status)
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Modification impossible.',
      )
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{ticket.title}</CardTitle>
        <CardDescription>{ticket.description}</CardDescription>
      </CardHeader>

      <CardFooter className="flex-col items-stretch gap-2">
        {ticket.status === 'unknown' ? (
          <p className="text-sm text-muted-foreground">
            Statut non pris en charge.
          </p>
        ) : (
          <Select
            items={statusOptions}
            value={ticket.status}
            disabled={isUpdating}
            onValueChange={(value) => {
              if (isTicketStatus(value)) {
                void handleStatusChange(value)
              }
            }}
          >
            <SelectTrigger
              className="w-full"
              aria-label={`Statut du ticket ${ticket.title}`}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {isUpdating && (
          <p role="status" className="text-sm text-muted-foreground">
            Mise à jour…
          </p>
        )}

        {updateError && (
          <p role="alert" className="text-sm text-destructive">
            {updateError}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

export { TicketCard }
