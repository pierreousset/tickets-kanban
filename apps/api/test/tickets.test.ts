import assert from 'node:assert/strict'
import { test, type TestContext } from 'node:test'

import { buildApp } from '../src/app.js'
import type {
  Ticket,
  TicketsRepository,
} from '../src/features/tickets/tickets.js'

const ticketId = '7f4f0fd7-336e-4c5f-881f-6c0cfd845401'

const ticket: Ticket = {
  id: ticketId,
  title: 'Titre initial',
  description: 'Description initiale',
  status: 'in_progress',
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-02T10:00:00.000Z'),
}

const createMutation = `
  mutation Create($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      title
      createdAt
    }
  }
`

const updateMutation = `
  mutation Update($id: ID!, $input: UpdateTicketInput!) {
    updateTicket(id: $id, input: $input) {
      id
      title
      description
    }
  }
`

const statusMutation = `
  mutation Status($id: ID!, $status: TicketStatus!) {
    updateTicketStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

const deleteMutation = `
  mutation Delete($id: ID!) {
    deleteTicket(id: $id)
  }
`

const unexpectedCall = async (): Promise<never> => {
  throw new Error('Appel inattendu au repository.')
}

const setup = (t: TestContext, overrides: Partial<TicketsRepository>) => {
  const repository: TicketsRepository = {
    list: unexpectedCall,
    create: unexpectedCall,
    updateStatus: unexpectedCall,
    update: unexpectedCall,
    remove: unexpectedCall,
    ...overrides,
  }

  const app = buildApp({
    ticketsRepository: repository,
    logger: false,
  })

  t.after(() => app.close())

  return async (query: string, variables: Record<string, unknown>) => {
    const response = await app.inject({
      method: 'POST',
      url: '/graphql',
      payload: { query, variables },
    })

    assert.equal(response.statusCode, 200)

    return response.json()
  }
}

test('la création normalise le titre et sérialise les dates', async (t) => {
  const create = t.mock.fn<TicketsRepository['create']>(async () => ({
    ...ticket,
    title: 'Titre propre',
  }))
  const request = setup(t, { create })

  const body = await request(createMutation, {
    input: {
      title: '  Titre propre  ',
      description: 'Description',
    },
  })

  assert.equal(body.errors, undefined)
  assert.equal(create.mock.callCount(), 1)
  assert.deepEqual(create.mock.calls[0]?.arguments, [
    { title: 'Titre propre', description: 'Description' },
  ])
  assert.equal(body.data.createTicket.title, 'Titre propre')
  assert.equal(body.data.createTicket.createdAt, ticket.createdAt.toISOString())
})

test('un titre invalide bloque création et édition avant écriture', async (t) => {
  const create = t.mock.fn<TicketsRepository['create']>(async () => ticket)
  const update = t.mock.fn<TicketsRepository['update']>(async () => ticket)
  const request = setup(t, { create, update })
  const input = { title: ' x ', description: '' }

  for (const scenario of [
    { query: createMutation, variables: { input } },
    { query: updateMutation, variables: { id: ticketId, input } },
  ]) {
    const body = await request(scenario.query, scenario.variables)

    assert.equal(body.data, null)
    assert.equal(body.errors[0].extensions.code, 'BAD_USER_INPUT')
  }

  assert.equal(create.mock.callCount(), 0)
  assert.equal(update.mock.callCount(), 0)
})

test('l’édition transmet uniquement les textes normalisés', async (t) => {
  const update = t.mock.fn<TicketsRepository['update']>(async () => ({
    ...ticket,
    title: 'Nouveau titre',
    description: 'Nouveau texte',
  }))
  const request = setup(t, { update })

  const body = await request(updateMutation, {
    id: ticketId,
    input: {
      title: '  Nouveau titre  ',
      description: '  Nouveau texte  ',
    },
  })

  assert.equal(body.errors, undefined)
  assert.equal(update.mock.callCount(), 1)
  assert.deepEqual(update.mock.calls[0]?.arguments, [
    ticketId,
    {
      title: 'Nouveau titre',
      description: 'Nouveau texte',
    },
  ])
  assert.equal(body.data.updateTicket.description, 'Nouveau texte')
})

test('un UUID invalide bloque les modifications et la suppression', async (t) => {
  const update = t.mock.fn<TicketsRepository['update']>(async () => ticket)
  const updateStatus = t.mock.fn<TicketsRepository['updateStatus']>(
    async () => ticket,
  )
  const remove = t.mock.fn<TicketsRepository['remove']>(async () => ticketId)
  const request = setup(t, { update, updateStatus, remove })

  for (const scenario of [
    {
      query: updateMutation,
      variables: {
        id: 'invalide',
        input: { title: 'Titre valide', description: '' },
      },
    },
    {
      query: statusMutation,
      variables: { id: 'invalide', status: 'done' },
    },
    {
      query: deleteMutation,
      variables: { id: 'invalide' },
    },
  ]) {
    const body = await request(scenario.query, scenario.variables)

    assert.equal(body.data, null)
    assert.equal(body.errors[0].extensions.code, 'BAD_USER_INPUT')
  }

  assert.equal(update.mock.callCount(), 0)
  assert.equal(updateStatus.mock.callCount(), 0)
  assert.equal(remove.mock.callCount(), 0)
})

test('modifier un ticket absent renvoie NOT_FOUND', async (t) => {
  const request = setup(t, {
    update: async () => undefined,
  })

  const body = await request(updateMutation, {
    id: ticketId,
    input: { title: 'Titre valide', description: '' },
  })

  assert.equal(body.data, null)
  assert.equal(body.errors[0].extensions.code, 'NOT_FOUND')
})

test('la suppression renvoie l’identifiant du ticket supprimé', async (t) => {
  const remove = t.mock.fn<TicketsRepository['remove']>(async () => ticketId)
  const request = setup(t, { remove })

  const body = await request(deleteMutation, { id: ticketId })

  assert.equal(body.errors, undefined)
  assert.equal(body.data.deleteTicket, ticketId)
  assert.equal(remove.mock.callCount(), 1)
  assert.deepEqual(remove.mock.calls[0]?.arguments, [ticketId])
})

test('supprimer un ticket déjà absent reste un succès', async (t) => {
  const remove = t.mock.fn<TicketsRepository['remove']>(async () => undefined)
  const request = setup(t, { remove })

  const body = await request(deleteMutation, { id: ticketId })

  assert.equal(body.errors, undefined)
  assert.equal(body.data.deleteTicket, ticketId)
  assert.equal(remove.mock.callCount(), 1)
})

test('une erreur du repository ne devient pas un faux succès', async (t) => {
  const request = setup(t, {
    remove: async () => {
      throw new Error('Stockage indisponible.')
    },
  })

  const body = await request(deleteMutation, { id: ticketId })

  assert.equal(body.data, null)
  assert.equal(body.errors[0].message, 'Stockage indisponible.')
})
