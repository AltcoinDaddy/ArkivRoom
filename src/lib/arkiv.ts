import { createPublicClient, createWalletClient, http, jsonToPayload } from "@arkiv-network/sdk";
import { braga } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import type { Attribute, Entity } from "@arkiv-network/sdk/types";
import { custom, type Hex } from "viem";
import type { Account } from "viem/accounts";
import {
  DEFAULT_ENTITY_EXPIRY_SECONDS,
  ENTITY_TYPES,
  ENTITY_TYPE_ATTRIBUTE_KEY,
  PROJECT_ATTRIBUTE,
  PROJECT_ATTRIBUTE_KEY,
} from "./constants";
import {
  documentSchema,
  grantSchema,
  roomSchema,
  type DocumentInput,
  type GrantInput,
  type RoomInput,
} from "./schemas";

export const arkivPublicClient = createPublicClient({
  chain: braga,
  transport: http(),
});

type BrowserEthereumProvider = {
  request: (...args: unknown[]) => Promise<unknown>;
};

export type LiveRoom = RoomInput & {
  key: Hex;
  createdAtBlock?: string;
};

export type LiveDocument = DocumentInput & {
  key: Hex;
  createdAtBlock?: string;
};

export type LiveGrant = GrantInput & {
  key: Hex;
  createdAtBlock?: string;
};

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
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
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
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
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
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
  };
}

export function buildProjectRoomsQuery(limit = 12) {
  return arkivPublicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.room))
    .withAttributes(true)
    .withMetadata(true)
    .withPayload(true)
    .limit(limit);
}

export function buildProjectDocumentsQuery(limit = 24) {
  return arkivPublicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.document))
    .withAttributes(true)
    .withMetadata(true)
    .withPayload(true)
    .limit(limit);
}

export function buildProjectGrantsQuery(limit = 30) {
  return arkivPublicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.grant))
    .withAttributes(true)
    .withMetadata(true)
    .withPayload(true)
    .limit(limit);
}

export function getArkivWalletClient({
  account,
  provider,
}: {
  account: Account;
  provider: BrowserEthereumProvider;
}) {
  return createWalletClient({
    account,
    chain: braga,
    transport: custom(provider),
  });
}

export function parseRoomEntity(entity: Entity): LiveRoom | null {
  try {
    const payload = roomSchema.parse(entity.toJson());
    return {
      ...payload,
      key: entity.key,
      createdAtBlock: entity.createdAtBlock?.toString(),
    };
  } catch {
    return null;
  }
}

export async function fetchProjectRooms(limit = 12) {
  const result = await buildProjectRoomsQuery(limit).fetch();

  return result.entities
    .map(parseRoomEntity)
    .filter((room): room is LiveRoom => room !== null)
    .sort((left, right) => Number(right.createdAtBlock ?? "0") - Number(left.createdAtBlock ?? "0"));
}

export function parseDocumentEntity(entity: Entity): LiveDocument | null {
  try {
    const payload = documentSchema.parse(entity.toJson());
    return {
      ...payload,
      key: entity.key,
      createdAtBlock: entity.createdAtBlock?.toString(),
    };
  } catch {
    return null;
  }
}

export async function fetchProjectDocuments(limit = 24) {
  const result = await buildProjectDocumentsQuery(limit).fetch();

  return result.entities
    .map(parseDocumentEntity)
    .filter((document): document is LiveDocument => document !== null)
    .sort((left, right) => Number(right.createdAtBlock ?? "0") - Number(left.createdAtBlock ?? "0"));
}

export function parseGrantEntity(entity: Entity): LiveGrant | null {
  try {
    const payload = grantSchema.parse(entity.toJson());
    return {
      ...payload,
      key: entity.key,
      createdAtBlock: entity.createdAtBlock?.toString(),
    };
  } catch {
    return null;
  }
}

export async function fetchProjectGrants(limit = 30) {
  const result = await buildProjectGrantsQuery(limit).fetch();

  return result.entities
    .map(parseGrantEntity)
    .filter((grant): grant is LiveGrant => grant !== null)
    .sort((left, right) => Number(right.createdAtBlock ?? "0") - Number(left.createdAtBlock ?? "0"));
}
