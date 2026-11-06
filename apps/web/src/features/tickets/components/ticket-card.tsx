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

import type { Ticket, TicketStatus } from '../types'

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Terminé' },
]

type TicketCardProps = {
  ticket: Ticket
  onStatusChange: (ticketId: string, status: TicketStatus) => void
}

export function TicketCard({ ticket, onStatusChange }: TicketCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{ticket.title}</CardTitle>
        <CardDescription>{ticket.description}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Select
          items={statusOptions}
          value={ticket.status}
          onValueChange={(value) => {
            if (
              value === 'todo' ||
              value === 'in_progress' ||
              value === 'done'
            ) {
              onStatusChange(ticket.id, value)
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
      </CardFooter>
    </Card>
  )
}