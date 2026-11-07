/**
 * @generated SignedSource<<99273494d95c06c6f31bc1c29705fa70>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateTicketInput = {
  description: string;
  title: string;
};
export type UpdateTicketMutation$variables = {
  id: string;
  input: UpdateTicketInput;
};
export type UpdateTicketMutation$data = {
  readonly updateTicket: {
    readonly description: string;
    readonly id: string;
    readonly title: string;
    readonly updatedAt: string;
  };
};
export type UpdateTicketMutation = {
  response: UpdateTicketMutation$data;
  variables: UpdateTicketMutation$variables;
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
    "name": "input"
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
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Ticket",
    "kind": "LinkedField",
    "name": "updateTicket",
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
    "name": "UpdateTicketMutation",
    "selections": (v1/*:: as any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "UpdateTicketMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "6d5cffd54ec35c748e3bf69573740b5f",
    "id": null,
    "metadata": {},
    "name": "UpdateTicketMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateTicketMutation(\n  $id: ID!\n  $input: UpdateTicketInput!\n) {\n  updateTicket(id: $id, input: $input) {\n    id\n    title\n    description\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "5db4cf04826a75234353aab3d5761bd5";

export default node;
