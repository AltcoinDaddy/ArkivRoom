# ArkivRoom

ArkivRoom is a Privacy-themed Arkiv challenge project: a wallet-owned private data room where users create confidential rooms, attach sensitive records, and grant time-bound access to other wallets on Arkiv Braga.

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- `wagmi` + injected wallet connector
- `@arkiv-network/sdk` for Braga clients, payload encoding, and scoped queries
- Zod for entity validation
- Zustand for lightweight demo state
- Sonner for UX feedback

## Challenge fit

- Theme: `Privacy`
- Entity types: `Room`, `Document`, `Grant`
- Every entity and every query uses the same unique `PROJECT_ATTRIBUTE`
- Target network: Arkiv Braga testnet

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current app status

This starter already includes:

- a branded ArkivRoom landing shell
- Braga chain and injected-wallet setup
- shared Arkiv constants and project scoping
- Zod schemas for room, document, and grant payloads
- Arkiv helper builders for entity payloads and a project-scoped room query

The next implementation step is wiring a create-room form to `buildRoomEntityInput()` and then submitting it through an Arkiv wallet client.

## Important files

- `/Users/daddy/Desktop/ns/ArkivRoom/src/app/page.tsx`
- `/Users/daddy/Desktop/ns/ArkivRoom/src/components/home-screen.tsx`
- `/Users/daddy/Desktop/ns/ArkivRoom/src/lib/arkiv.ts`
- `/Users/daddy/Desktop/ns/ArkivRoom/src/lib/schemas.ts`
- `/Users/daddy/Desktop/ns/ArkivRoom/src/store/arkiv-room.ts`
