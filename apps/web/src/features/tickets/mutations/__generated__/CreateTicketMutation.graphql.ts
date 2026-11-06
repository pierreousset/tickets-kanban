/**
 * @generated SignedSource<<c18cb84ba4c2e01bedfa7343c2b315d6>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TicketStatus = "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type CreateTicketInput = {
  description?: string;
  title: string;
};
export type CreateTicketMutation$variables = {
  input: CreateTicketInput;
};
export type CreateTicketMutation$data = {
  readonly createTicket: {
    readonly createdAt: string;
    readonly description: string;
    readonly id: string;
    readonly status: TicketStatus;
    readonly title: string;
    readonly updatedAt: string;
  };
};
export type CreateTicketMutation = {
  response: CreateTicketMutation$data;
  variables: CreateTicketMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Ticket",
    "kind": "LinkedField",
    "name": "createTicket",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateTicketMutation",
    "selections": (v1/*:: as any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "CreateTicketMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "2578d2fe6fd9f295a80ed0e2bd468488",
    "id": null,
    "metadata": {},
    "name": "CreateTicketMutation",
    "operationKind": "mutation",
    "text": "mutation CreateTicketMutation(\n  $input: CreateTicketInput!\n) {\n  createTicket(input: $input) {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "dc1facbfa0775c6994d78e6e65dbb8ab";

export default node;
