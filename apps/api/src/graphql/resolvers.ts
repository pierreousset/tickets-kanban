import { GraphQLError } from 'graphql'
import { DateTimeResolver } from 'graphql-scalars'
import type { IResolvers } from 'mercurius'

import type {
  CreateTicketInput,
  TicketsRepository,
  TicketStatus,
  UpdateTicketInput,
} from '../features/tickets/tickets.js'

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const createResolvers = (ticketsRepository: TicketsRepository) => {
  return {
    DateTime: DateTimeResolver,

    Query: {
      tickets: () => ticketsRepository.list(),
    },

    Mutation: {
      createTicket: (
        _parent: unknown,
        { input }: { input: CreateTicketInput },
      ) => {
        const title = input.title.trim()

        if (title.length < 3) {
          throw new GraphQLError(
            'Le titre doit contenir au moins 3 caractères.',
            {
              extensions: { code: 'BAD_USER_INPUT' },
            },
          )
        }

        return ticketsRepository.create({
          ...input,
          title,
        })
      },

      updateTicketStatus: async (
        _parent: unknown,
        { id, status }: { id: string; status: TicketStatus },
      ) => {
        if (!uuidPattern.test(id)) {
          throw new GraphQLError('Identifiant de ticket invalide.', {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }

        const ticket = await ticketsRepository.updateStatus(id, status)

        if (!ticket) {
          throw new GraphQLError('Ticket introuvable.', {
            extensions: { code: 'NOT_FOUND' },
          })
        }

        return ticket
      },

      updateTicket: async (
        _parent: unknown,
        { id, input }: { id: string; input: UpdateTicketInput },
      ) => {
        if (!uuidPattern.test(id)) {
          throw new GraphQLError('Identifiant de ticket invalide.', {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }

        const title = input.title.trim()

        if (title.length < 3) {
          throw new GraphQLError(
            'Le titre doit contenir au moins 3 caractères.',
            {
              extensions: { code: 'BAD_USER_INPUT' },
            },
          )
        }

        const ticket = await ticketsRepository.update(id, {
          title,
          description: input.description.trim(),
        })

        if (!ticket) {
          throw new GraphQLError('Ticket introuvable.', {
            extensions: { code: 'NOT_FOUND' },
          })
        }

        return ticket
      },

      deleteTicket: async (_parent: unknown, { id }: { id: string }) => {
        if (!uuidPattern.test(id)) {
          throw new GraphQLError('Identifiant de ticket invalide.', {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }

        const deletedId = await ticketsRepository.remove(id)

        return deletedId ?? id.toLowerCase()
      },
    },
  } satisfies IResolvers
}

export { createResolvers }
