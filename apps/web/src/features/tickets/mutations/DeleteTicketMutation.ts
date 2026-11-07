import { graphql } from 'react-relay'

export const deleteTicketMutation = graphql`
  mutation DeleteTicketMutation($id: ID!) {
    deleteTicket(id: $id)
  }
`
