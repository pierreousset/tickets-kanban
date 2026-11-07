/**
 * @generated SignedSource<<9524ad6fb0515f9add886bf6a2cb0463>>
 * @lightSyntaxTransform
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteTicketMutation$variables = {
  id: string;
};
export type DeleteTicketMutation$data = {
  readonly deleteTicket: string;
};
export type DeleteTicketMutation = {
  response: DeleteTicketMutation$data;
  variables: DeleteTicketMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
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
      }
    ],
    "kind": "ScalarField",
    "name": "deleteTicket",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteTicketMutation",
    "selections": (v1/*:: as any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*:: as any*/),
    "kind": "Operation",
    "name": "DeleteTicketMutation",
    "selections": (v1/*:: as any*/)
  },
  "params": {
    "cacheID": "ce8e72f013abd5a77f2ef90591fe65f7",
    "id": null,
    "metadata": {},
    "name": "DeleteTicketMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteTicketMutation(\n  $id: ID!\n) {\n  deleteTicket(id: $id)\n}\n"
  }
};
})();

(node as any).hash = "fcf375258ded325c94bb52e1085254cf";

export default node;
