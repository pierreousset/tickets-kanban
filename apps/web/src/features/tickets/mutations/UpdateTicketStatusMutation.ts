import { graphql } from 'react-relay'

export const updateTicketStatusMutation = graphql`
  mutation UpdateTicketStatusMutation($id: ID!, $status: TicketStatus!)
  @raw_response_type {
    updateTicketStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`
