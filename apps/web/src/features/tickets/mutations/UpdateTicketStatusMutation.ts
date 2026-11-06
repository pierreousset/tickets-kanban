import { graphql } from 'react-relay'

export const updateTicketStatusMutation = graphql`
  mutation UpdateTicketStatusMutation($id: ID!, $status: TicketStatus!) {
    updateTicketStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`
