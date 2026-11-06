/**
 * @generated SignedSource<<256ea8592d38724670ef01c13552266b>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TicketStatus = "cancelled" | "done" | "in_progress" | "todo" | "%future added value";
export type TicketsQuery$variables = Record<PropertyKey, never>;
export type TicketsQuery$data = {
  readonly tickets: ReadonlyArray<{
    readonly createdAt: string;
    readonly description: string;
    readonly id: string;
    readonly status: TicketStatus;
    readonly title: string;
    readonly updatedAt: string;
  }>;
};
export type TicketsQuery = {
  response: TicketsQuery$data;
  variables: TicketsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Ticket",
    "kind": "LinkedField",
    "name": "tickets",
    "plural": true,
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TicketsQuery",
    "selections": (v0/*:: as any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TicketsQuery",
    "selections": (v0/*:: as any*/)
  },
  "params": {
    "cacheID": "b0103138fa122b7be34a2b95cdf8266a",
    "id": null,
    "metadata": {},
    "name": "TicketsQuery",
    "operationKind": "query",
    "text": "query TicketsQuery {\n  tickets {\n    id\n    title\n    description\n    status\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d9ac46b385af22f4bae9f980bd34516";

export default node;
