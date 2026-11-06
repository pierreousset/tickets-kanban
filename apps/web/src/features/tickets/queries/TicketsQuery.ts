import { graphql } from 'react-relay'

export const ticketsQuery = graphql`
  query TicketsQuery {
    tickets {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`
