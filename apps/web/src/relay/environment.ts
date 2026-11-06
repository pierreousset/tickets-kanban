import {
  Environment,
  Network,
  RecordSource,
  Store,
  createOperationDescriptor,
  getRequest,
  type GraphQLResponse,
} from 'relay-runtime'

import { ticketsQuery } from '../features/tickets/queries/TicketsQuery'
import { executeGraphQL } from './graphql.functions'

const createRelayEnvironment = () => {
  const network = Network.create(async (operation, variables) => {
    if (!operation.text) {
      throw new Error('Le document GraphQL compilé est absent.')
    }

    const result = await executeGraphQL({
      data: {
        query: operation.text,
        variables,
      },
    })

    return JSON.parse(result) as GraphQLResponse
  })

  const environment = new Environment({
    network,
    store: new Store(new RecordSource()),
    isServer: import.meta.env.SSR,
  })

  // Conserve la liste principale pendant la durée de vie du routeur.
  environment.retain(createOperationDescriptor(getRequest(ticketsQuery), {}))

  return environment
}

export type RelayRouterContext = {
  relayEnvironment: Environment
}

export { createRelayEnvironment }
