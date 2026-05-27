import { createPublicClient, createWalletClient, http, jsonToPayload } from "@arkiv-network/sdk";
import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";
import { braga } from "@arkiv-network/sdk/chains";
import { eq } from "@arkiv-network/sdk/query";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const PROJECT_ATTRIBUTE_KEY = "project";
const PROJECT_ATTRIBUTE = "arkivroom::privacy::braga::v1";
const ENTITY_TYPE_ATTRIBUTE_KEY = "entity_type";
const DEFAULT_ENTITY_EXPIRY_SECONDS = 60 * 60 * 24 * 30;
const ENTITY_TYPES = {
  room: "arkiv_room",
  document: "arkiv_document",
  grant: "arkiv_grant",
} as const;

function normalizePrivateKey(value: string) {
  const trimmed = value.trim();
  const withPrefix = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;

  if (!/^0x[a-fA-F0-9]{64}$/.test(withPrefix)) {
    throw new Error("Private key must be 32 bytes of hex.");
  }

  return withPrefix as `0x${string}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function withProjectScope(attributes: Array<{ key: string; value: string }>) {
  return [{ key: PROJECT_ATTRIBUTE_KEY, value: PROJECT_ATTRIBUTE }, ...attributes];
}

async function promptForPrivateKey() {
  const rl = createInterface({ input, output, terminal: true });

  try {
    const answer = await rl.question("Enter ArkivRoom test private key: ");
    return normalizePrivateKey(answer);
  } finally {
    rl.close();
  }
}

async function main() {
  const privateKey = await promptForPrivateKey();
  const account = privateKeyToAccount(privateKey);
  const publicClient = createPublicClient({
    chain: braga,
    transport: http(),
  });
  const walletClient = createWalletClient({
    chain: braga,
    transport: http(),
    account,
  });

  const stamp = Date.now().toString().slice(-6);
  const roomId = `smoke-room-${stamp}`;
  const roomPayload = {
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.room,
    owner: account.address,
    roomId,
    name: "ArkivRoom Smoke Test",
    description: "A quick end-to-end validation room created from the local smoke test script.",
    sensitivity: "strict" as const,
    tags: ["smoke", "judge", "privacy"],
  };

  const roomWrite = await walletClient.createEntity({
    contentType: "application/json",
    payload: jsonToPayload(roomPayload),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.room },
      { key: "room_id", value: roomPayload.roomId },
      { key: "owner", value: roomPayload.owner },
      { key: "sensitivity", value: roomPayload.sensitivity },
    ]),
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
  });
  await walletClient.waitForTransactionReceipt({ hash: roomWrite.txHash });

  const documentId = `memo-${stamp}`;
  const documentPayload = {
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.document,
    owner: account.address,
    roomId,
    roomKey: roomWrite.entityKey,
    documentId,
    title: "Smoke test memo",
    summary: "Created by the local smoke test to verify document creation and project-scoped reads.",
    uri: "https://example.com/private/arkivroom-smoke-test.pdf",
    accessTier: "review" as const,
  };

  const documentWrite = await walletClient.createEntity({
    contentType: "application/json",
    payload: jsonToPayload(documentPayload),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.document },
      { key: "room_id", value: documentPayload.roomId },
      { key: "room_key", value: documentPayload.roomKey },
      { key: "document_id", value: documentPayload.documentId },
      { key: "owner", value: documentPayload.owner },
      { key: "access_tier", value: documentPayload.accessTier },
    ]),
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
  });
  await walletClient.waitForTransactionReceipt({ hash: documentWrite.txHash });

  const grantId = `g-${slugify(roomId)}-${stamp}`;
  const recipient = "0x1111111111111111111111111111111111111111";
  const grantPayload = {
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.grant,
    owner: account.address,
    roomId,
    roomKey: roomWrite.entityKey,
    documentId,
    documentKey: documentWrite.entityKey,
    grantId,
    recipient,
    permission: "view" as const,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const grantWrite = await walletClient.createEntity({
    contentType: "application/json",
    payload: jsonToPayload(grantPayload),
    attributes: withProjectScope([
      { key: ENTITY_TYPE_ATTRIBUTE_KEY, value: ENTITY_TYPES.grant },
      { key: "room_id", value: grantPayload.roomId },
      { key: "room_key", value: grantPayload.roomKey },
      { key: "document_id", value: grantPayload.documentId },
      { key: "document_key", value: grantPayload.documentKey },
      { key: "owner", value: grantPayload.owner },
      { key: "recipient", value: grantPayload.recipient },
      { key: "permission", value: grantPayload.permission },
    ]),
    expiresIn: DEFAULT_ENTITY_EXPIRY_SECONDS,
  });
  await walletClient.waitForTransactionReceipt({ hash: grantWrite.txHash });

  const rooms = await publicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.room))
    .withPayload(true)
    .withMetadata(true)
    .limit(5)
    .fetch();

  const documents = await publicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.document))
    .withPayload(true)
    .withMetadata(true)
    .limit(5)
    .fetch();

  const grants = await publicClient
    .buildQuery()
    .where(eq(PROJECT_ATTRIBUTE_KEY, PROJECT_ATTRIBUTE))
    .where(eq(ENTITY_TYPE_ATTRIBUTE_KEY, ENTITY_TYPES.grant))
    .withPayload(true)
    .withMetadata(true)
    .limit(5)
    .fetch();

  console.log(
    JSON.stringify(
      {
        owner: account.address,
        roomKey: roomWrite.entityKey,
        roomTxHash: roomWrite.txHash,
        documentKey: documentWrite.entityKey,
        documentTxHash: documentWrite.txHash,
        grantKey: grantWrite.entityKey,
        grantTxHash: grantWrite.txHash,
        fetchedCounts: {
          rooms: rooms.entities.length,
          documents: documents.entities.length,
          grants: grants.entities.length,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
