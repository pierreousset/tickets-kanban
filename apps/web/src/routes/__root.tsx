import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { RelayRouterContext } from '../relay/environment'

import appCss from '../index.css?url'
import { RootDocument } from '@/components/root-document'

export const Route = createRootRouteWithContext<RelayRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Tickets' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: Outlet,
  shellComponent: RootDocument,
})
