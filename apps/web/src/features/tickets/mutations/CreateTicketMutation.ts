import { graphql } from 'react-relay'

export const createTicketMutation = graphql`
  mutation CreateTicketMutation($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`
