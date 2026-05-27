"use client";

import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Copy,
  ExternalLink,
  FileLock2,
  KeyRound,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useAccount, useChainId } from "wagmi";
import {
  ARKIV_EXPLORER_URL,
  BRAGA_RPC_URL,
  CHAIN,
  ENTITY_TYPES,
  type EntityType,
  PROJECT_ATTRIBUTE,
  PROJECT_ATTRIBUTE_KEY,
} from "@/lib/constants";
import { formatAddress } from "@/lib/utils";
import { useArkivRoomStore } from "@/store/arkiv-room";
import { CreateRoomPanel } from "./create-room-panel";
import { CreateDocumentPanel } from "./create-document-panel";
import { CreateGrantPanel } from "./create-grant-panel";
import { WalletButton } from "./wallet-button";

const entityIcons: Record<EntityType, typeof LockKeyhole> = {
  [ENTITY_TYPES.room]: LockKeyhole,
  [ENTITY_TYPES.document]: FileLock2,
  [ENTITY_TYPES.grant]: KeyRound,
};

export function HomeScreen() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { demoFlow, entityBlueprints, projectHighlights } = useArkivRoomStore();

  const isReadyForWrites = isConnected && chainId === CHAIN.id;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
      <header className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,242,195,0.22)] bg-[rgba(143,242,195,0.08)] px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-mint)]">
              <Sparkles className="h-3.5 w-3.5" />
              Privacy bounty build
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(244,236,215,0.58)]">
                ArkivRoom / wallet-owned private data rooms
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[var(--color-sand)] sm:text-5xl lg:text-6xl">
                Confidential records, scoped by one unmistakable Arkiv footprint.
              </h1>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel-strong)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(240,191,99,0.2)] bg-[rgba(240,191,99,0.08)] px-3 py-1 font-mono text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Braga-ready stack
                </div>
                <p className="max-w-2xl text-lg leading-8 text-[rgba(244,236,215,0.78)]">
                  We are building a focused Privacy entry: owners create a room, attach private
                  documents, and grant another wallet time-bound access on Arkiv Braga.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {projectHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.52)]">
                      {highlight.label}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-[var(--color-sand)]">
                      {highlight.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[rgba(244,236,215,0.66)]">
                      {highlight.copy}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="https://forms.arkiv.network/ethns-arkiv-challenge"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-[#09201c] transition hover:translate-y-[-1px]"
                >
                  Submission form
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ARKIV_EXPLORER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.28)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  Open Braga explorer
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href="/doc"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(240,191,99,0.24)] bg-[rgba(240,191,99,0.08)] px-5 py-3 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(240,191,99,0.36)] hover:bg-[rgba(240,191,99,0.12)]"
                >
                  Open judge deck
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[rgba(143,242,195,0.16)] bg-[linear-gradient(180deg,rgba(143,242,195,0.12),rgba(12,24,24,0.2))] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.56)]">
                    Arkiv scope
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-sand)]">
                    Every entity and query carries the same project signature.
                  </p>
                </div>
                <Blocks className="h-9 w-9 text-[var(--color-mint)]" />
              </div>

              <div className="mt-6 rounded-[1.35rem] border border-[rgba(143,242,195,0.18)] bg-[rgba(7,18,18,0.72)] p-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.5)]">
                  {PROJECT_ATTRIBUTE_KEY}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <code className="font-mono text-sm text-[var(--color-mint)]">{PROJECT_ATTRIBUTE}</code>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(PROJECT_ATTRIBUTE);
                      toast.success("Project attribute copied.");
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.28)]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-6 text-[rgba(244,236,215,0.74)]">
                <div className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <Network className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                  <div>
                    <p className="font-semibold text-[var(--color-sand)]">{CHAIN.name}</p>
                    <p className="font-mono text-xs text-[rgba(244,236,215,0.55)]">{BRAGA_RPC_URL}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                  <div>
                    <p className="font-semibold text-[var(--color-sand)]">
                      {isReadyForWrites ? "Wallet is ready for Arkiv writes." : "Connect an injected wallet on Braga to write."}
                    </p>
                    <p className="text-[rgba(244,236,215,0.65)]">
                      {address
                        ? `Active wallet: ${formatAddress(address)}`
                        : "The read layer is ready now; write actions can hook into the same schema helpers next."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
            Demo order
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-sand)]">
            Run the workflow from top to bottom
          </h2>

          <div className="mt-6 space-y-3">
            {[
              {
                title: "Step 1",
                heading: "Create a room",
                copy: "Start here. This creates the parent record that documents and grants depend on.",
              },
              {
                title: "Step 2",
                heading: "Add a document",
                copy: "Attach a sensitive record to the room so the data model becomes visibly relational.",
              },
              {
                title: "Step 3",
                heading: "Grant access",
                copy: "Issue room-wide or document-level access to another wallet with an expiry.",
              },
              {
                title: "Step 4",
                heading: "Refresh the live panels",
                copy: "Show the `Room`, `Document`, and `Grant` entities coming back from Arkiv Braga.",
              },
            ].map((item, index) => (
              <article
                key={item.heading}
                className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(143,242,195,0.12)] font-mono text-sm font-semibold text-[var(--color-mint)]">
                    0{index + 1}
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgba(244,236,215,0.48)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--color-sand)]">{item.heading}</p>
                    <p className="mt-1 text-sm leading-6 text-[rgba(244,236,215,0.68)]">{item.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Live workflow
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              The core demo is three simple steps
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[rgba(244,236,215,0.72)]">
              The forms below are intentionally ordered. Start with the room, then attach a document,
              then grant access. Each step writes to Arkiv and each right-hand panel reads the same
              project-scoped entities back.
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-[rgba(143,242,195,0.18)] bg-[rgba(143,242,195,0.08)] px-4 py-3 text-sm leading-6 text-[rgba(244,236,215,0.78)]">
            {isReadyForWrites
              ? "Wallet connected on Braga. You can run the full flow now."
              : "Connect a Braga wallet first, then move through the three steps below."}
          </div>
        </div>
      </section>

      <CreateRoomPanel />
      <CreateDocumentPanel />
      <CreateGrantPanel />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
            Arkiv model
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
            Three entities, one obvious data story
          </h2>

          <div className="mt-6 grid gap-4">
            {entityBlueprints.map((entity) => {
              const Icon = entityIcons[entity.entityType];
              return (
                <article
                  key={entity.entityType}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.48)]">
                        {entity.entityType}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[var(--color-sand)]">
                        {entity.title}
                      </h3>
                    </div>
                    <Icon className="h-8 w-8 text-[var(--color-mint)]" />
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[rgba(244,236,215,0.72)]">
                    {entity.copy}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entity.attributes.map((attribute) => (
                      <span
                        key={attribute}
                        className="rounded-full border border-[rgba(244,236,215,0.12)] bg-[rgba(7,18,18,0.72)] px-3 py-1.5 font-mono text-xs text-[var(--color-gold)]"
                      >
                        {attribute}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
            Verification
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
            Why a judge can understand this quickly
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.48)]">
                Project-scoped query
              </p>
              <pre className="mt-3 overflow-x-auto font-mono text-xs leading-7 text-[var(--color-sand)]">
{`query
  .where(eq("${PROJECT_ATTRIBUTE_KEY}", "${PROJECT_ATTRIBUTE}"))
  .where(eq("entity_type", "arkiv_room"))
  .withAttributes(true)
  .withPayload(true)`}
              </pre>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.48)]">
                What to look for in the demo
              </p>
              <div className="mt-3 space-y-3 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                  <p>Each step creates a distinct Arkiv entity type: `Room`, `Document`, then `Grant`.</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                  <p>Each live panel reads back only records that match the same project attribute.</p>
                </div>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                  <p>Room and document relationships are visible through parent entity keys such as `roomKey` and `documentKey`, and grants show recipient plus expiry.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[rgba(240,191,99,0.18)] bg-[rgba(240,191,99,0.08)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Supporting stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Next.js 16", "Tailwind 4", "wagmi", "@arkiv-network/sdk", "Zod", "Zustand"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[rgba(240,191,99,0.24)] bg-[rgba(7,18,18,0.4)] px-3 py-1.5 font-mono text-xs text-[var(--color-sand)]"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[rgba(143,242,195,0.16)] bg-[rgba(143,242,195,0.08)] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-mint)]">
                In one sentence
              </p>
              <p className="mt-3 text-lg font-semibold text-[var(--color-sand)]">
                Connect a Braga wallet, create a room, attach a document, grant another wallet
                access, then refresh to show all three entity types coming back from Arkiv.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
          Detailed flow
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
          The same story in plain language
        </h2>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {demoFlow.map((step, index) => (
            <article
              key={step.title}
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(143,242,195,0.12)] font-mono text-sm font-semibold text-[var(--color-mint)]">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-sand)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[rgba(244,236,215,0.72)]">{step.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
