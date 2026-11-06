/**
 * @generated SignedSource<<01fed0aaa882c3b847ec61426daba416>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TicketStatus = "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type UpdateTicketStatusMutation$variables = {
  id: string;
  status: TicketStatus;
};
export type UpdateTicketStatusMutation$data = {
  readonly updateTicketStatus: {
    readonly id: string;
    readonly status: TicketStatus;
    readonly updatedAt: string;
  };
};
export type UpdateTicketStatusMutation = {
  response: UpdateTicketStatusMutation$data;
  variables: UpdateTicketStatusMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      }
    ],
    "concreteType": "Ticket",
    "kind": "LinkedField",
    "name": "updateTicketStatus",
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
        "name": "status",
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
    "name": "UpdateTicketStatusMutation",
    "selections": (v1/*:: as any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "UpdateTicketStatusMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "b5e0c447f4b03de7500ae07e46221e7b",
    "id": null,
    "metadata": {},
    "name": "UpdateTicketStatusMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateTicketStatusMutation(\n  $id: ID!\n  $status: TicketStatus!\n) {\n  updateTicketStatus(id: $id, status: $status) {\n    id\n    status\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "80649497496ae5bdf04c708e1783fafc";

export default node;
