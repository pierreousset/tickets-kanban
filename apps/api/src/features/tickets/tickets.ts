import { desc, eq, sql } from 'drizzle-orm'

import type { Database } from '../../db/client.js'
import { ticketsTable } from '../../db/schema.js'
import type { TicketRow } from '../../db/schema.js'

export type Ticket = TicketRow
export type TicketStatus = Ticket['status']

export type CreateTicketInput = {
  title: string
  description?: string
}

export type UpdateTicketInput = {
  title: string
  description: string
}

const createTicketsRepository = (db: Database) => {
  const list = async (): Promise<Ticket[]> => {
    return db
      .select()
      .from(ticketsTable)
      .orderBy(desc(ticketsTable.createdAt), desc(ticketsTable.id))
  }

  const create = async (input: CreateTicketInput): Promise<Ticket> => {
    const [ticket] = await db
      .insert(ticketsTable)
      .values({
        title: input.title,
        description: input.description?.trim() ?? '',
      })
      .returning()

    if (!ticket) {
      throw new Error('La création du ticket a échoué.')
    }

    return ticket
  }

  const updateStatus = async (
    id: string,
    status: TicketStatus,
  ): Promise<Ticket | undefined> => {
    const [ticket] = await db
      .update(ticketsTable)
      .set({
        status,
        updatedAt: sql`now()`,
      })
      .where(eq(ticketsTable.id, id))
      .returning()

    return ticket
  }

  const update = async (
    id: string,
    input: UpdateTicketInput,
  ): Promise<Ticket | undefined> => {
    const [ticket] = await db
      .update(ticketsTable)
      .set({
        title: input.title,
        description: input.description,
        updatedAt: sql`now()`,
      })
      .where(eq(ticketsTable.id, id))
      .returning()

    return ticket
  }

  const remove = async (id: string): Promise<string | undefined> => {
    const [deleted] = await db
      .delete(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .returning({ id: ticketsTable.id })

    return deleted?.id
  }

  return {
    list,
    create,
    updateStatus,
    update,
    remove,
  }
}

export { createTicketsRepository }

export type TicketsRepository = ReturnType<typeof createTicketsRepository>
