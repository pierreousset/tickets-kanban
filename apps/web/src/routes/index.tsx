import { createFileRoute } from '@tanstack/react-router'
import { fetchQuery } from 'relay-runtime'

import App from '../App'
import { ticketsQuery } from '../features/tickets/queries/TicketsQuery'
import type { TicketsQuery } from '../features/tickets/queries/__generated__/TicketsQuery.graphql'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await fetchQuery<TicketsQuery>(
      context.relayEnvironment,
      ticketsQuery,
      {},
      { fetchPolicy: 'store-or-network' },
    ).toPromise()
  },

  pendingComponent: () => (
    <p className="p-8" role="status">
      Chargement des tickets…
    </p>
  ),

  errorComponent: ({ error }) => (
    <p className="p-8 text-destructive" role="alert">
      Impossible de charger les tickets : {(error as Error).message}
    </p>
  ),

  component: App,
})
