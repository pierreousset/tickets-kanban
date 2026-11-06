import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const ticketStatusEnum = pgEnum('ticket_status', [
  'todo',
  'in_progress',
  'done',
  'cancelled',
])

export const ticketsTable = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),

  description: text('description').notNull().default(''),

  status: ticketStatusEnum('status').notNull().default('todo'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),
})

export type TicketRow = typeof ticketsTable.$inferSelect
