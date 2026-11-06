import Fastify from 'fastify'
import { readFileSync } from 'node:fs'
import mercurius from 'mercurius'
import { DateTimeResolver } from 'graphql-scalars'

import { tickets } from './features/tickets/tickets.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  const schema = readFileSync(
    new URL('../schema.graphql', import.meta.url),
    'utf8',
  )

  app.get('/health', async () => {
    return {
      status: 'ok',
    }
  })

  app.register(mercurius, {
    schema,
    resolvers: {
      DateTime: DateTimeResolver,
      Query: {
        tickets: () => tickets,
      },
    },
    graphiql: process.env.NODE_ENV === 'development',
  })

  return app
}
