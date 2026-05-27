import { z } from "zod";
import { ENTITY_TYPES, PROJECT_ATTRIBUTE } from "./constants";

const walletAddress = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Wallet address must be a valid EVM address.");
const entityKey = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, "Entity key must be a valid 32-byte hex value.");

const baseSchema = z.object({
  project: z.literal(PROJECT_ATTRIBUTE),
  owner: walletAddress,
});

export const roomSchema = baseSchema.extend({
  entityType: z.literal(ENTITY_TYPES.room),
  roomId: z.string().min(3).max(64),
  name: z.string().min(3).max(80),
  description: z.string().min(12).max(280),
  sensitivity: z.enum(["strict", "internal", "shared"]),
  tags: z.array(z.string().min(2).max(20)).max(6),
});

export const documentSchema = baseSchema.extend({
  entityType: z.literal(ENTITY_TYPES.document),
  roomId: z.string().min(3).max(64),
  roomKey: entityKey,
  documentId: z.string().min(3).max(64),
  title: z.string().min(3).max(120),
  summary: z.string().min(12).max(280),
  uri: z.string().url(),
  accessTier: z.enum(["view", "review", "download"]),
});

export const grantSchema = baseSchema.extend({
  entityType: z.literal(ENTITY_TYPES.grant),
  roomId: z.string().min(3).max(64),
  roomKey: entityKey,
  documentId: z.string().min(3).max(64).optional(),
  documentKey: entityKey.optional(),
  grantId: z.string().min(3).max(64),
  recipient: walletAddress,
  permission: z.enum(["view", "comment", "download"]),
  expiresAt: z.string().datetime(),
});

export type RoomInput = z.infer<typeof roomSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type GrantInput = z.infer<typeof grantSchema>;
