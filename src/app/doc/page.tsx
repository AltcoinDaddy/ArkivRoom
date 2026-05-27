import type { Metadata } from "next";
import {
  ArrowRight,
  Blocks,
  Database,
  Eye,
  FileLock2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { PROJECT_ATTRIBUTE } from "@/lib/constants";

const slideLinks = [
  { href: "#hero", label: "Overview" },
  { href: "#entity-model", label: "Entity Model" },
  { href: "#architecture", label: "Architecture" },
  { href: "#workflow", label: "Workflow" },
];

const entityCards = [
  {
    icon: LockKeyhole,
    title: "Room",
    copy: "The parent entity for a private workspace. It defines the confidential container that documents and grants inherit from.",
    bullets: ["Wallet-owned container", "Tagged and queryable", "Root of the relationship tree"],
    tone: "bg-[rgba(143,242,195,0.12)] text-[var(--color-mint)] border-[rgba(143,242,195,0.18)]",
  },
  {
    icon: FileLock2,
    title: "Document",
    copy: "A sensitive record attached to a room. It keeps both human-readable IDs and the parent room entity key for stronger Arkiv-native relationships.",
    bullets: ["Belongs to a Room", "Stores `roomKey`", "Carries access tier metadata"],
    tone: "bg-[rgba(240,191,99,0.12)] text-[var(--color-gold)] border-[rgba(240,191,99,0.18)]",
  },
  {
    icon: KeyRound,
    title: "Grant",
    copy: "A permission entity that gives another wallet room-wide or document-level access with an expiry date, tied back to parent entity keys.",
    bullets: ["Recipient-specific", "Optional `documentKey`", "Expiry-based access control"],
    tone: "bg-[rgba(244,132,111,0.12)] text-[var(--color-rose)] border-[rgba(244,132,111,0.18)]",
  },
];

const flowSteps = [
  {
    title: "Create the Room",
    copy: "The owner creates a confidential container such as Investor DD. This becomes the parent entity for the workflow.",
  },
  {
    title: "Attach the Document",
    copy: "A document record is created with both `roomId` and the parent `roomKey`, making the relationship queryable on Arkiv.",
  },
  {
    title: "Issue the Grant",
    copy: "The owner grants another wallet room-wide or document-level access. The grant stores `roomKey` and optional `documentKey`.",
  },
  {
    title: "Refresh and Verify",
    copy: "The live panels query only records with the same `PROJECT_ATTRIBUTE` and show Room, Document, and Grant entities fetched back from Arkiv Braga.",
  },
];

export const metadata: Metadata = {
  title: "ArkivRoom — Documentation",
  description: "Technical architecture and documentation for ArkivRoom.",
};

export default function DocPage() {
  return (
    <main className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(143,242,195,0.18),transparent_55%)]" />

      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[rgba(8,17,17,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgba(244,236,215,0.5)]">
              ArkivRoom
            </p>
          </div>
          <nav className="hidden items-center gap-2 lg:flex">
            {slideLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(244,236,215,0.76)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
            >
              Open app
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 lg:px-10">
        <section
          id="hero"
          className="relative overflow-hidden rounded-[2.25rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(16,34,34,0.92),rgba(8,17,17,0.94))] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-18"
        >
          <div className="flex h-full flex-col justify-between gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,242,195,0.18)] bg-[rgba(143,242,195,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-mint)]">
                <Sparkles className="h-3.5 w-3.5" />
                Documentation
              </div>
              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[rgba(244,236,215,0.56)]">
                  ArkivRoom
                </p>
                <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-[var(--color-sand)] sm:text-6xl lg:text-7xl">
                  Wallet-owned confidential collaboration.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-[rgba(244,236,215,0.78)] sm:text-xl">
                  ArkivRoom is a web3-native private data room on Arkiv Braga. Users create a `Room`,
                  attach `Document` entities, and issue time-bound `Grant` entities to specific wallets.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="entity-model"
          className="rounded-[2.25rem] border border-[var(--color-border)] bg-[rgba(16,34,34,0.78)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
        >
          <div className="max-w-3xl space-y-4">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--color-sand)] sm:text-5xl">
              Entity Model
            </h2>
            <p className="text-lg leading-8 text-[rgba(244,236,215,0.76)]">
              ArkivRoom uses a compact Arkiv-native model: `Room` as the parent container,
              `Document` as the sensitive record, and `Grant` as the access-control layer.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {entityCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-6"
                >
                  <div className={`inline-flex rounded-full border px-3 py-2 ${card.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[rgba(244,236,215,0.74)]">{card.copy}</p>
                  <div className="mt-5 space-y-2">
                    {card.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-3 py-2 text-sm text-[rgba(244,236,215,0.78)]"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="architecture"
          className="rounded-[2.25rem] border border-[var(--color-border)] bg-[rgba(16,34,34,0.78)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
            <div className="space-y-5">
              <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--color-sand)] sm:text-5xl">
                Architecture
              </h2>
              <div className="space-y-3 text-base leading-7 text-[rgba(244,236,215,0.76)]">
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <Blocks className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-mint)]" />
                  <p>
                    Every entity write and every query includes the same `PROJECT_ATTRIBUTE`:
                    `arkivroom::privacy::braga::v1`.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <Database className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                  <p>
                    `Document` stores both `roomId` and `roomKey`, and `Grant` stores `roomKey` plus
                    optional `documentKey`, so relationships are modeled with parent Arkiv entity keys.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-rose)]" />
                  <p>
                    Ownership and attribution come from Arkiv metadata, while the payload and typed
                    attributes make the privacy workflow queryable.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[rgba(143,242,195,0.16)] bg-[linear-gradient(180deg,rgba(143,242,195,0.08),rgba(8,17,17,0.92))] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[rgba(244,236,215,0.5)]">
                Relationship diagram
              </p>
              <div className="mt-6 flex flex-col items-center gap-6">
                <div className="w-full max-w-md rounded-[1.5rem] border border-[rgba(143,242,195,0.22)] bg-[rgba(143,242,195,0.08)] p-5">
                  <div className="flex items-center gap-3">
                    <LockKeyhole className="h-5 w-5 text-[var(--color-mint)]" />
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[rgba(244,236,215,0.48)]">
                        Room entity
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[var(--color-sand)]">Parent key: `roomKey`</p>
                    </div>
                  </div>
                </div>

                <div className="h-12 w-px bg-[linear-gradient(180deg,var(--color-mint),rgba(240,191,99,0.65))]" />

                <div className="grid w-full max-w-3xl gap-5 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[rgba(240,191,99,0.22)] bg-[rgba(240,191,99,0.08)] p-5">
                    <div className="flex items-center gap-3">
                      <FileLock2 className="h-5 w-5 text-[var(--color-gold)]" />
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[rgba(244,236,215,0.48)]">
                          Document entity
                        </p>
                        <p className="mt-1 text-lg font-semibold text-[var(--color-sand)]">
                          Stores `roomId` + `roomKey`
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-[rgba(244,132,111,0.22)] bg-[rgba(244,132,111,0.08)] p-5">
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-5 w-5 text-[var(--color-rose)]" />
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[rgba(244,236,215,0.48)]">
                          Grant entity
                        </p>
                        <p className="mt-1 text-lg font-semibold text-[var(--color-sand)]">
                          Stores `roomKey` + optional `documentKey`
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full rounded-[1.4rem] border border-[var(--color-border)] bg-[#081111] p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.48)]">
                    Project-scoped query example
                  </p>
                  <pre className="mt-3 overflow-x-auto font-mono text-xs leading-7 text-[var(--color-sand)]">
{`query
  .where(eq("project", "${PROJECT_ATTRIBUTE}"))
  .where(eq("entity_type", "arkiv_document"))
  .where(eq("room_key", "<parent room entity key>"))
  .withAttributes(true)
  .withPayload(true)`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="rounded-[2.25rem] border border-[var(--color-border)] bg-[rgba(16,34,34,0.78)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--color-sand)] sm:text-5xl">
                Workflow
              </h2>
              <div className="space-y-3">
                {flowSteps.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(143,242,195,0.12)] font-mono text-sm font-semibold text-[var(--color-mint)]">
                        0{index + 1}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-[var(--color-sand)]">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[rgba(244,236,215,0.72)]">{step.copy}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-2 lg:pt-16">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5">
                  <Wallet className="h-5 w-5 text-[var(--color-gold)]" />
                  <p className="mt-4 text-lg font-semibold text-[var(--color-sand)]">Owner-centric</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
                    Users own their records and grant access explicitly to other wallets.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5">
                  <Eye className="h-5 w-5 text-[var(--color-mint)]" />
                  <p className="mt-4 text-lg font-semibold text-[var(--color-sand)]">Transparent</p>
                  <p className="mt-2 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
                    The UI exposes the exact Room → Document → Grant flow and the readback queries.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-[#09201c] transition hover:translate-y-[-1px]"
                >
                  Launch app
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="https://explorer.braga.hoodi.arkiv.network"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.28)] hover:bg-[rgba(255,255,255,0.03)]"
                >
                  Open Braga explorer
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
