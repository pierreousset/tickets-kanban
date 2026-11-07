import { readFileSync } from 'node:fs'
import Fastify from 'fastify'
import mercurius from 'mercurius'

import { createDatabase } from './db/client.js'
import { createTicketsRepository } from './features/tickets/tickets.js'
import type { TicketsRepository } from './features/tickets/tickets.js'
import { createResolvers } from './graphql/resolvers.js'

type BuildAppOptions = {
  ticketsRepository?: TicketsRepository
  logger?: boolean
}

const buildApp = ({
  ticketsRepository,
  logger = true,
}: BuildAppOptions = {}) => {
  const app = Fastify({ logger })

  const schema = readFileSync(
    new URL('../schema.graphql', import.meta.url),
    'utf8',
  )

  let repository = ticketsRepository

  if (!repository) {
    const database = createDatabase()
    repository = createTicketsRepository(database.db)

    database.pool.on('error', (error) => {
      app.log.error(
        { err: error },
        'Une connexion PostgreSQL inactive a été interrompue.',
      )
    })

    app.addHook('onReady', async () => {
      await database.pool.query('SELECT 1')
    })

    app.addHook('onClose', async () => {
      await database.close()
    })
  }

  app.get('/health', async () => ({
    status: 'ok',
  }))

  app.register(mercurius, {
    schema,
    resolvers: createResolvers(repository),
    graphiql: process.env.NODE_ENV === 'development',
  })

  return app
}

export { buildApp }
