import { createRouter } from '@tanstack/react-router'
import { RelayEnvironmentProvider } from 'react-relay'
import { RecordSource } from 'relay-runtime'

import { routeTree } from './routeTree.gen'
import { createRelayEnvironment } from './relay/environment'

type DehydratedRelay = {
  relaySnapshot: string
}

const getRouter = () => {
  const relayEnvironment = createRelayEnvironment()

  return createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      relayEnvironment,
    },

    dehydrate: (): DehydratedRelay => ({
      relaySnapshot: JSON.stringify(
        relayEnvironment.getStore().getSource().toJSON(),
      ),
    }),

    hydrate: ({ relaySnapshot }: DehydratedRelay) => {
      const store = relayEnvironment.getStore()

      store.publish(new RecordSource(JSON.parse(relaySnapshot)))
      store.notify()
    },

    Wrap: ({ children }) => (
      <RelayEnvironmentProvider environment={relayEnvironment}>
        {children}
      </RelayEnvironmentProvider>
    ),
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

export { getRouter }
