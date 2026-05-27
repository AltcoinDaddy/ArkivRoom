"use client";

import {
  ArrowRight,
  ExternalLink,
  FileText,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { ARKIV_EXPLORER_URL, CHAIN } from "@/lib/constants";
import { CreateRoomPanel } from "./create-room-panel";
import { CreateDocumentPanel } from "./create-document-panel";
import { CreateGrantPanel } from "./create-grant-panel";
import { WalletButton } from "./wallet-button";

export function HomeScreen() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isReadyForWrites = isConnected && chainId === CHAIN.id;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
      {/* ── Header ── */}
      <header className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-5 backdrop-blur-xl sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,242,195,0.22)] bg-[rgba(143,242,195,0.08)] px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-mint)]">
              <Sparkles className="h-3.5 w-3.5" />
              Privacy on Arkiv Braga
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)] sm:text-4xl lg:text-5xl">
              Wallet-owned private data rooms
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[rgba(244,236,215,0.72)]">
              Create confidential rooms, attach sensitive documents, and grant
              time-bound access to specific wallets — all stored on-chain via
              Arkiv Braga.
            </p>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* ── Status + Quick links ── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-2.5 w-2.5 rounded-full ${isReadyForWrites ? "bg-[var(--color-mint)]" : "bg-[rgba(244,236,215,0.28)]"}`}
          />
          <p className="text-sm text-[rgba(244,236,215,0.72)]">
            {isReadyForWrites
              ? "Connected on Braga — ready to create entities."
              : "Connect a wallet on Braga testnet to start."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/doc"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
          >
            <FileText className="h-4 w-4" />
            How it works
          </Link>
          <Link
            href={ARKIV_EXPLORER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
          >
            <ExternalLink className="h-4 w-4" />
            Braga explorer
          </Link>
        </div>
      </section>

      {/* ── How it works (compact) ── */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: LockKeyhole,
            step: "1",
            title: "Create a room",
            copy: "A private workspace that acts as the parent container for all your documents and grants.",
          },
          {
            icon: ArrowRight,
            step: "2",
            title: "Attach documents",
            copy: "Add sensitive records to your room. Each document inherits the room's scope and tracks its own access tier.",
          },
          {
            icon: ArrowRight,
            step: "3",
            title: "Grant access",
            copy: "Issue wallet-specific, time-bound permissions for a room or a single document.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(143,242,195,0.12)] font-mono text-sm font-semibold text-[var(--color-mint)]">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-sand)]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[rgba(244,236,215,0.68)]">
                {item.copy}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Interactive workflow ── */}
      <CreateRoomPanel />
      <CreateDocumentPanel />
      <CreateGrantPanel />
    </main>
  );
}
