import { graphql } from 'react-relay'

export const updateTicketMutation = graphql`
  mutation UpdateTicketMutation($id: ID!, $input: UpdateTicketInput!) {
    updateTicket(id: $id, input: $input) {
      id
      title
      description
      updatedAt
    }
  }
`
