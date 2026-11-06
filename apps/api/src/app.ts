import { readFileSync } from 'node:fs'
import Fastify from 'fastify'
import mercurius from 'mercurius'

import { createDatabase } from './db/client.js'
import { createTicketsRepository } from './features/tickets/tickets.js'
import { createResolvers } from './graphql/resolvers.js'

const buildApp = () => {
  const app = Fastify({ logger: true })

  const schema = readFileSync(
    new URL('../schema.graphql', import.meta.url),
    'utf8',
  )

  const database = createDatabase()
  const ticketsRepository = createTicketsRepository(database.db)

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

  app.get('/health', async () => ({
    status: 'ok',
  }))

  app.register(mercurius, {
    schema,
    resolvers: createResolvers(ticketsRepository),
    graphiql: process.env.NODE_ENV === 'development',
  })

  return app
}

export { buildApp }
