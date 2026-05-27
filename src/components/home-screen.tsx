"use client";

import {
  ArrowRight,
  ExternalLink,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAccount, useChainId } from "wagmi";
import { ARKIV_EXPLORER_URL, CHAIN } from "@/lib/constants";


export function HomeScreen() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isReadyForWrites = isConnected && chainId === CHAIN.id;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16 sm:px-10 lg:px-12 gap-16 sm:gap-24">
      
      {/* ── Premium Centered Hero Section ── */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-12 md:pt-28 md:pb-20 max-w-5xl mx-auto w-full">

        {/* Hero Headline */}
        <h1 className="w-full text-4xl font-bold tracking-tight text-[var(--color-sand)] sm:text-6xl lg:text-7xl xl:text-8xl !leading-[1.1] font-sans">
          Wallet-owned private <br className="hidden sm:inline" /> data rooms
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-8 max-w-3xl text-lg sm:text-xl lg:text-2xl leading-relaxed text-[rgba(244,236,215,0.6)] font-light">
          Create confidential rooms, attach sensitive documents, and grant
          time-bound access to specific wallets — all secured on-chain via Arkiv Braga.
        </p>

        {/* Hero CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/app"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-mint)] px-10 py-4.5 text-base font-semibold text-[var(--color-ink)] transition-all duration-200 hover:opacity-90 w-full sm:w-auto shadow-[0_0_40px_rgba(143,242,195,0.15)]"
          >
            Start Building
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="/doc"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.01)] px-10 py-4.5 text-base font-semibold text-[var(--color-sand)] transition-all duration-200 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(244,236,215,0.25)] w-full sm:w-auto"
          >
            How it works
          </Link>
        </div>
      </section>


          {/* ── How it works Cards ── */}
      <section className="grid gap-6 sm:grid-cols-3">
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
          return (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 lg:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(143,242,195,0.1)] font-mono text-sm font-semibold text-[var(--color-mint)] border border-[rgba(143,242,195,0.15)]">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-sand)]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[rgba(244,236,215,0.6)]">
                {item.copy}
              </p>
            </div>
          );
        })}
      </section>

      {/* ── Status + Quick links ── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[var(--color-border)] pt-10">

        <div className="flex flex-wrap items-center gap-3">
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

  


    </main>
  );
}