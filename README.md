# ArkivRoom

ArkivRoom is a Privacy-themed Arkiv app for wallet-owned confidential data rooms. Users create a `Room`, attach `Document` records, and issue time-bound `Grant` entities to specific wallets. All application data lives on Arkiv Braga.

## Challenge summary

- Theme: `Privacy`
- Network: Arkiv Braga testnet
- Entity types: `Room`, `Document`, `Grant`
- Project attribute: `arkivroom::privacy::braga::v1`

## How this meets the challenge requirements

- All data is stored as Arkiv entities on Arkiv Braga
- The app uses at least 2 entity types: it uses 3 entity types
- Every entity write uses the same unique `PROJECT_ATTRIBUTE`
- Every project query uses the same unique `PROJECT_ATTRIBUTE`
- The app includes a working UI flow for creating and querying entities
- The repo is open source and includes setup instructions

## What the app does

ArkivRoom is built around a simple privacy workflow:

1. Create a private room
2. Add sensitive documents to that room
3. Grant another wallet room-wide or document-level access
4. Query the same project-scoped records back from Arkiv

This makes Arkiv usage easy to verify because the `Room`, `Document`, and `Grant` entities are all visible in the UI and all reads and writes are scoped to the same project attribute.

## Why Arkiv is necessary

- Application records live on Arkiv Braga instead of an off-chain mock database
- Ownership and creator metadata come from Arkiv’s entity model
- Privacy-oriented access control is represented through first-class `Grant` entities
- Relationships are represented using parent entity keys, not only human-readable IDs
- Project-scoped querying is enforced through a shared `PROJECT_ATTRIBUTE`

## Entity model

### `Room`

Purpose: private container for confidential collaboration

Payload fields:
- `roomId`
- `name`
- `description`
- `sensitivity`
- `tags`

Attributes:
- `project`
- `entity_type`
- `room_id`
- `owner`
- `sensitivity`

### `Document`

Purpose: sensitive record attached to a room

Payload fields:
- `roomId`
- `roomKey`
- `documentId`
- `title`
- `summary`
- `uri`
- `accessTier`

Attributes:
- `project`
- `entity_type`
- `room_id`
- `room_key`
- `document_id`
- `owner`
- `access_tier`

### `Grant`

Purpose: wallet-based access control layer

Payload fields:
- `roomId`
- `roomKey`
- `documentId` optional
- `documentKey` optional
- `grantId`
- `recipient`
- `permission`
- `expiresAt`

Attributes:
- `project`
- `entity_type`
- `room_id`
- `room_key`
- `document_id`
- `document_key`
- `owner`
- `recipient`
- `permission`

## Demo flow

1. Connect a wallet on Braga
2. Create a room such as `Investor DD`
3. Add a document such as `Q2 revenue memo`
4. Create a grant for another wallet
5. Refresh the live panels to show `Room`, `Document`, and `Grant` entities fetched back from Arkiv

## Tech stack

- Next.js 16 App Router
- Tailwind CSS 4
- `wagmi` for browser wallet connection
- `@arkiv-network/sdk` for Arkiv Braga clients, payload encoding, and queries
- Zod for entity validation
- Zustand for lightweight UI state
- Sonner for feedback toasts

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
