import { createPublicClient, http, jsonToPayload } from "@arkiv-network/sdk";
import { braga } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import type { Attribute } from "@arkiv-network/sdk/types";
import {
  ENTITY_TYPES,
  ENTITY_TYPE_ATTRIBUTE_KEY,
  PROJECT_ATTRIBUTE,
  PROJECT_ATTRIBUTE_KEY,
} from "./constants";
import { documentSchema, grantSchema, roomSchema, type DocumentInput, type GrantInput, type RoomInput } from "./schemas";

export const arkivPublicClient = createPublicClient({
  chain: braga,
  transport: http(),
});

function withProjectScope(attributes: Attribute[]): Attribute[] {
  return [
    { key: PROJECT_ATTRIBUTE_KEY, value: PROJECT_ATTRIBUTE },
    ...attributes,
  ];
}

export function buildRoomEntityInput(input: RoomInput) {
  const room = roomSchema.parse(input);

  return {
    contentType: "application/json" as const,
    payload: jsonToPayload(room),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.room },
      { key: "room_id", value: room.roomId },
      { key: "owner", value: room.owner },
      { key: "sensitivity", value: room.sensitivity },
    ]),
  };
}

export function buildDocumentEntityInput(input: DocumentInput) {
  const document = documentSchema.parse(input);

  return {
    contentType: "application/json" as const,
    payload: jsonToPayload(document),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.document },
      { key: "room_id", value: document.roomId },
      { key: "document_id", value: document.documentId },
      { key: "owner", value: document.owner },
      { key: "access_tier", value: document.accessTier },
    ]),
  };
}

export function buildGrantEntityInput(input: GrantInput) {
  const grant = grantSchema.parse(input);

  return {
    contentType: "application/json" as const,
    payload: jsonToPayload(grant),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.grant },
      { key: "room_id", value: grant.roomId },
      { key: "document_id", value: grant.documentId ?? "room-wide" },
      { key: "owner", value: grant.owner },
      { key: "recipient", value: grant.recipient },
      { key: "permission", value: grant.permission },
    ]),
  };
}

export function buildProjectRoomsQuery(limit = 12) {
  return arkivPublicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.room))
    .withAttributes(true)
    .withPayload(true)
    .limit(limit);
}
