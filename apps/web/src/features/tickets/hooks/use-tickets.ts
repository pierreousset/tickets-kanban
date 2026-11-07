import { useMemo } from 'react'
import { useLazyLoadQuery, useRelayEnvironment } from 'react-relay'
import { commitMutation } from 'relay-runtime'

import { ticketsQuery } from '../queries/TicketsQuery'
import type { TicketsQuery } from '../queries/__generated__/TicketsQuery.graphql'

import { createTicketMutation } from '../mutations/CreateTicketMutation'
import type { CreateTicketMutation } from '../mutations/__generated__/CreateTicketMutation.graphql'

import { updateTicketStatusMutation } from '../mutations/UpdateTicketStatusMutation'
import type { UpdateTicketStatusMutation } from '../mutations/__generated__/UpdateTicketStatusMutation.graphql'

import { updateTicketMutation } from '../mutations/UpdateTicketMutation'
import type { UpdateTicketMutation } from '../mutations/__generated__/UpdateTicketMutation.graphql'

import { isTicketStatus } from '../types'

import type {
  CreateTicketInput,
  TicketStatus,
  TicketView,
  UpdateTicketInput,
} from '../types'

const useTickets = () => {
  const environment = useRelayEnvironment()

  const data = useLazyLoadQuery<TicketsQuery>(
    ticketsQuery,
    {},
    { fetchPolicy: 'store-only' },
  )

  const tickets = useMemo(
    () =>
      data.tickets.map((ticket): TicketView => ({
        ...ticket,
        status: isTicketStatus(ticket.status) ? ticket.status : 'unknown',
        createdAt: new Date(ticket.createdAt),
        updatedAt: new Date(ticket.updatedAt),
      })),
    [data.tickets],
  )

  const createTicket = (input: CreateTicketInput): Promise<void> => {
    return new Promise((resolve, reject) => {
      commitMutation<CreateTicketMutation>(environment, {
        mutation: createTicketMutation,
        variables: { input },

        updater(store) {
          const created = store.getRootField('createTicket')

          if (!created) return

          const root = store.getRoot()
          const current = root.getLinkedRecords('tickets') ?? []
          const remaining = current.filter(
            (ticket) =>
              ticket != null && ticket.getDataID() !== created.getDataID(),
          )

          root.setLinkedRecords([created, ...remaining], 'tickets')
        },

        onCompleted: (_response, errors) => {
          if (errors?.length) {
            reject(new Error(errors.map((error) => error.message).join('\n')))
            return
          }

          resolve()
        },

        onError: reject,
      })
    })
  }

  const updateTicketStatus = (
    id: string,
    status: TicketStatus,
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<UpdateTicketStatusMutation>(environment, {
        mutation: updateTicketStatusMutation,
        variables: { id, status },

        optimisticResponse: {
          updateTicketStatus: {
            id,
            status,
            updatedAt: new Date().toISOString(),
          },
        },

        onCompleted: (_response, errors) => {
          if (errors?.length) {
            reject(new Error(errors.map((error) => error.message).join('\n')))
            return
          }

          resolve()
        },

        onError: reject,
      })
    })
  }

  const updateTicket = (
    id: string,
    input: UpdateTicketInput,
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<UpdateTicketMutation>(environment, {
        mutation: updateTicketMutation,
        variables: { id, input },

        onCompleted: (_response, errors) => {
          if (errors?.length) {
            reject(new Error(errors.map((error) => error.message).join('\n')))
            return
          }

          resolve()
        },

        onError: reject,
      })
    })
  }

  return {
    tickets,
    createTicket,
    updateTicketStatus,
    updateTicket,
  }
}

export { useTickets }
