import { Badge } from '@repo/ui/components/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'

import type { Ticket, TicketStatus } from '../types'

const statusLabels: Record<TicketStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
  cancelled: 'Annulé',
}

type TicketCardProps = {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{ticket.title}</CardTitle>
        <CardDescription>{ticket.description}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Badge variant="secondary">{statusLabels[ticket.status]}</Badge>
      </CardFooter>
    </Card>
  )
}
