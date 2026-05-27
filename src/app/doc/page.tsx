import type { Metadata } from "next";
import {
  Blocks,
  Database,
  FileLock2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  PlaySquare
} from "lucide-react";
import Link from "next/link";
import { CHAIN, PROJECT_ATTRIBUTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ArkivRoom — Presentation Deck",
  description: "Pitch deck and architecture overview for ArkivRoom.",
};

const problemPoints = [
  "Sensitive collaboration data is often trapped in off-chain tools that users do not truly own.",
  "Public blockchains are tamper-proof, but raw privacy workflows are hard to model cleanly.",
  "Most demos stop at storage. They do not show structured ownership, access grants, and queryable relationships.",
];

export default function PresentationDeck() {
  return (
    <main className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[#081111] text-[var(--color-sand)]">
      
      {/* Navigation overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgba(244,236,215,0.5)]">
          ArkivRoom Pitch Deck
        </div>
        <div className="pointer-events-auto">
           <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(8,17,17,0.8)] backdrop-blur px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
            >
              Open Live App
            </Link>
        </div>
      </div>

      {/* Slide 1: Title */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(143,242,195,0.15),transparent_60%)]" />
        
        <div className="max-w-5xl w-full flex flex-col gap-12 z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,242,195,0.18)] bg-[rgba(143,242,195,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-mint)]">
              <Sparkles className="h-3.5 w-3.5" />
              ETHNS Arkiv Challenge
            </div>
            <h1 className="text-6xl md:text-8xl font-semibold tracking-[-0.06em]">
              ArkivRoom
            </h1>
            <p className="text-2xl md:text-3xl text-[rgba(244,236,215,0.7)] max-w-3xl leading-tight">
              The privacy layer for wallet-owned confidential collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.1)] pt-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.48)]">Theme</p>
              <p className="mt-2 text-xl font-semibold">Privacy</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.48)]">Network</p>
              <p className="mt-2 text-xl font-semibold">{CHAIN.name}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.48)]">Project Attribute</p>
              <p className="mt-2 text-xl font-semibold break-all">{PROJECT_ATTRIBUTE}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
           <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</p>
        </div>
      </section>

      {/* Slide 2: Problem */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 bg-[rgba(16,34,34,0.3)]">
        <div className="max-w-6xl w-full grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-center">
          <div className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
              01 / The Problem
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.05em] leading-tight">
              Privacy gets lost when collaboration moves on-chain.
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.7)]">
              Teams need a way to model confidential workflows on a tamper-proof public data layer without losing structure, ownership, or explicit access control.
            </p>
          </div>
          <div className="space-y-4">
            {problemPoints.map((point, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(240,191,99,0.12)] font-mono text-xs text-[var(--color-gold)]">
                  0{i + 1}
                </div>
                <p className="text-lg text-[rgba(244,236,215,0.8)]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slide 3: Solution */}
      <section className="snap-start snap-always h-screen w-full flex flex-col items-center justify-center p-6">
        <div className="max-w-6xl w-full space-y-12">
          <div className="space-y-4 max-w-3xl">
             <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-mint)]">
              02 / The Solution
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.05em]">
              Three entities create one privacy workflow.
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.7)]">
              ArkivRoom uses a compact Arkiv-native model to turn decentralized storage into a true application layer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
              <LockKeyhole className="h-8 w-8 text-[var(--color-mint)] mb-6" />
              <h3 className="text-3xl font-semibold mb-4">1. Room</h3>
              <p className="text-[rgba(244,236,215,0.7)] text-lg mb-6">The parent entity for a private workspace. It defines the confidential container that documents and grants inherit from.</p>
              <div className="space-y-2 font-mono text-xs text-[var(--color-mint)] opacity-80">
                <p>+ Wallet-owned</p>
                <p>+ Queryable parent key</p>
              </div>
            </div>
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
              <FileLock2 className="h-8 w-8 text-[var(--color-gold)] mb-6" />
              <h3 className="text-3xl font-semibold mb-4">2. Document</h3>
              <p className="text-[rgba(244,236,215,0.7)] text-lg mb-6">A sensitive record attached to a room. It keeps both human-readable IDs and the parent room entity key.</p>
              <div className="space-y-2 font-mono text-xs text-[var(--color-gold)] opacity-80">
                <p>+ Belongs to a Room</p>
                <p>+ Carries access tier</p>
              </div>
            </div>
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
              <KeyRound className="h-8 w-8 text-[var(--color-rose)] mb-6" />
              <h3 className="text-3xl font-semibold mb-4">3. Grant</h3>
              <p className="text-[rgba(244,236,215,0.7)] text-lg mb-6">A permission entity that gives another wallet room-wide or document-level access with a strict expiry date.</p>
              <div className="space-y-2 font-mono text-xs text-[var(--color-rose)] opacity-80">
                <p>+ Recipient-specific</p>
                <p>+ Expiry-based control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slide 4: Architecture */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 bg-[rgba(16,34,34,0.3)]">
        <div className="max-w-6xl w-full grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
           <div className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--color-sand)] opacity-60">
              03 / Architecture
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.05em] leading-tight">
              Strictly scoped relationships on Arkiv Braga.
            </h2>
             <div className="space-y-4 text-lg text-[rgba(244,236,215,0.8)] mt-8">
               <div className="flex gap-4">
                 <Blocks className="w-6 h-6 shrink-0 text-[var(--color-mint)]" />
                 <p>Every write/query shares `arkivroom::privacy::braga::v1`.</p>
               </div>
               <div className="flex gap-4">
                 <Database className="w-6 h-6 shrink-0 text-[var(--color-gold)]" />
                 <p>Relationships use parent entity keys (`roomKey`), not just off-chain IDs.</p>
               </div>
               <div className="flex gap-4">
                 <ShieldCheck className="w-6 h-6 shrink-0 text-[var(--color-rose)]" />
                 <p>Ownership is proven via native Arkiv `$owner` attributes.</p>
               </div>
             </div>
          </div>
          
          <div className="w-full flex flex-col items-center">
             <div className="w-full rounded-[2rem] border border-[var(--color-border)] bg-[#081111] p-8 space-y-6">
                <div className="w-full rounded-[1.5rem] border border-[rgba(143,242,195,0.22)] bg-[rgba(143,242,195,0.08)] p-5 text-center relative">
                  <p className="font-mono text-xs uppercase text-[var(--color-mint)] mb-2">Parent Entity</p>
                  <p className="text-2xl font-semibold">Room</p>
                </div>
                
                <div className="flex justify-center gap-6 relative">
                   <div className="absolute top-0 w-full h-px bg-[rgba(255,255,255,0.1)] -mt-3"></div>
                   <div className="absolute top-0 left-1/4 w-px h-6 bg-[rgba(255,255,255,0.2)] -mt-3"></div>
                   <div className="absolute top-0 right-1/4 w-px h-6 bg-[rgba(255,255,255,0.2)] -mt-3"></div>
                   <div className="absolute top-[-30px] left-1/2 w-px h-[30px] bg-[rgba(255,255,255,0.2)]"></div>

                   <div className="w-full rounded-[1.5rem] border border-[rgba(240,191,99,0.22)] bg-[rgba(240,191,99,0.08)] p-5 text-center mt-3 z-10">
                     <p className="font-mono text-xs uppercase text-[var(--color-gold)] mb-2">Child</p>
                     <p className="text-xl font-semibold">Document</p>
                   </div>
                   <div className="w-full rounded-[1.5rem] border border-[rgba(244,132,111,0.22)] bg-[rgba(244,132,111,0.08)] p-5 text-center mt-3 z-10">
                     <p className="font-mono text-xs uppercase text-[var(--color-rose)] mb-2">Child</p>
                     <p className="text-xl font-semibold">Grant</p>
                   </div>
                </div>

                <div className="mt-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 font-mono text-xs text-[var(--color-sand)] overflow-hidden opacity-80">
                  <span className="text-purple-400">query</span><br/>
                  &nbsp;&nbsp;.<span className="text-blue-400">where</span>(eq(<span className="text-green-300">"project"</span>, PROJECT_ATTRIBUTE))<br/>
                  &nbsp;&nbsp;.<span className="text-blue-400">where</span>(eq(<span className="text-green-300">"room_key"</span>, parentKey))
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Slide 5: Call to Action */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6">
         <div className="max-w-4xl w-full text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-[-0.05em]">
              Ready to explore?
            </h2>
            <p className="text-2xl text-[rgba(244,236,215,0.7)]">
              This isn't a mock backend. The live app writes directly to Arkiv Braga.
            </p>
            <div className="flex justify-center gap-6 pt-8">
               <Link
                  href="/"
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--color-sand)] px-8 py-4 text-lg font-semibold text-[#09201c] transition hover:scale-105"
                >
                  <PlaySquare className="w-5 h-5" />
                  Launch Live Demo
                </Link>
            </div>
         </div>
      </section>
    </main>
  );
}
