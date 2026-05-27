import { braga } from "@arkiv-network/sdk/chains";

export const CHAIN = braga;
export const BRAGA_RPC_URL = CHAIN.rpcUrls.default.http[0];
export const ARKIV_EXPLORER_URL = CHAIN.blockExplorers?.default.url ?? "";
export const PROJECT_ATTRIBUTE_KEY = "project";
export const PROJECT_ATTRIBUTE = "arkivroom::privacy::braga::v1";
export const ENTITY_TYPE_ATTRIBUTE_KEY = "entity_type";
export const DEFAULT_ENTITY_EXPIRY_SECONDS = 60 * 60 * 24 * 30;

export const ENTITY_TYPES = {
  room: "arkiv_room",
  document: "arkiv_document",
  grant: "arkiv_grant",
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];
