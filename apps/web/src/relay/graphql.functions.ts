import { createServerFn } from '@tanstack/react-start'
import type { Variables } from 'relay-runtime'

type GraphQLInput = {
  query: string
  variables: Variables
}

export const executeGraphQL = createServerFn({ method: 'POST' })
  .validator((data: GraphQLInput) => {
    if (
      !data ||
      typeof data.query !== 'string' ||
      !data.query.trim() ||
      !data.variables ||
      typeof data.variables !== 'object' ||
      Array.isArray(data.variables)
    ) {
      throw new Error('Requête GraphQL invalide.')
    }

    return data
  })
  .handler(async ({ data }) => {
    const endpoint = process.env.API_GRAPHQL_URL

    if (!endpoint) {
      throw new Error('La variable API_GRAPHQL_URL est manquante.')
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      throw new Error(`L’API GraphQL a répondu HTTP ${response.status}.`)
    }

    return response.text()
  })
