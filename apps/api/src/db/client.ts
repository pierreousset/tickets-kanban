import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

const { Pool } = pg

const createDatabase = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('La variable DATABASE_URL est manquante.')
  }

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5_000,
  })

  return {
    db: drizzle({ client: pool }),
    pool,
    close: () => pool.end(),
  }
}

export type Database = ReturnType<typeof createDatabase>['db']

export { createDatabase }
