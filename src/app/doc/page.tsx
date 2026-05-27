import type { Metadata } from "next";
import {
  Blocks,
  Database,
  FileLock2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  PlaySquare,
  Briefcase,
  Users,
  FlaskConical,
  ChevronRight,
  ServerOff,
  Lightbulb,
  Code2,
  Cpu
} from "lucide-react";
import Link from "next/link";
import { CHAIN, PROJECT_ATTRIBUTE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ArkivRoom — Pitch Deck",
  description: "Official pitch presentation for ArkivRoom.",
};

export default function PresentationDeck() {
  return (
    <main className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-[var(--color-bg)] text-[var(--color-sand)] scroll-smooth">
      
      {/* Persistent Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center pointer-events-none">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)] bg-[rgba(143,242,195,0.08)] px-3 py-1.5 rounded-full border border-[rgba(143,242,195,0.18)]">
          ArkivRoom / Pitch Deck
        </div>
        <div className="pointer-events-auto">
           <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(8,17,17,0.8)] backdrop-blur px-5 py-2.5 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] hover:bg-[rgba(255,255,255,0.03)]"
            >
              Launch Live App
              <ChevronRight className="w-4 h-4 text-[var(--color-mint)]" />
            </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------------------
          SLIDE 1: INTRODUCTION / HERO
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 relative overflow-hidden group">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(143,242,195,0.12),transparent_60%)]" />
        
        <div className="max-w-6xl w-full flex flex-col gap-14 z-10 mt-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(244,236,215,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(244,236,215,0.8)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              Project Introduction
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.05em] text-white">
              ArkivRoom
            </h1>
            <p className="text-2xl md:text-4xl font-light text-[rgba(244,236,215,0.7)] max-w-4xl leading-[1.3]">
              A decentralized alternative to traditional data rooms. Built for wallet-owned confidential collaboration on Arkiv Braga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[rgba(255,255,255,0.06)] pt-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-mint)] mb-2">Theme</p>
              <p className="text-2xl font-medium text-white">Privacy</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">Network</p>
              <p className="text-2xl font-medium text-white">{CHAIN.name}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-rose)] mb-2">Project Attribute</p>
              <p className="text-sm font-mono text-white/80 bg-white/5 inline-block px-3 py-1.5 rounded-md border border-white/10 mt-1">{PROJECT_ATTRIBUTE}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
           <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</p>
           <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 2: THE INSPIRATION
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              01 / The Inspiration
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              Why build a Web3 data room?
            </h2>
            <p className="text-xl leading-relaxed text-[rgba(244,236,215,0.65)]">
              Traditional data rooms (like Carta, DocuSign, or Firmex) are black boxes that own your sensitive data. Web3 has solved decentralized identity and money, but when it comes to sharing confidential documents natively... there is a massive gap.
            </p>
          </div>
          
          <div className="p-10 rounded-[2rem] border border-[rgba(240,191,99,0.2)] bg-[linear-gradient(180deg,rgba(240,191,99,0.05),transparent)]">
            <Lightbulb className="w-12 h-12 text-[var(--color-gold)] mb-8" />
            <p className="text-2xl text-white font-medium leading-snug">
              "We were inspired to bridge this gap. What if DAOs, researchers, and startups could manage private due diligence documents with the same cryptographic security they use to manage their treasuries?"
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 3: THE PROBLEM
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-rose)]">
              02 / The Problem
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              Privacy gets lost when collaboration moves on-chain.
            </h2>
            <p className="text-xl leading-relaxed text-[rgba(244,236,215,0.65)]">
              Most decentralized applications force teams into an uncomfortable compromise.
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818] hover:border-[var(--color-rose)]/30 transition-colors">
               <ServerOff className="w-6 h-6 text-[var(--color-rose)] mb-4" />
               <h3 className="text-xl font-medium text-white mb-2">The Off-Chain Trap</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Teams fall back to centralized cloud storage (AWS, Google Drive) for sensitive data, defeating the purpose of decentralized architecture.</p>
            </div>
            <div className="p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818] hover:border-[var(--color-rose)]/30 transition-colors">
               <Database className="w-6 h-6 text-[var(--color-rose)] mb-4" />
               <h3 className="text-xl font-medium text-white mb-2">Structureless Public Storage</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Existing Web3 networks stop at raw storage (IPFS) without providing native ownership, access controls, or queryable relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 4: THE SOLUTION
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full text-center space-y-12">
           <div className="space-y-6 max-w-4xl mx-auto mb-16">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)]">
              03 / The Solution
            </p>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              A complete privacy workflow layer.
            </h2>
            <p className="text-2xl text-[rgba(244,236,215,0.65)] leading-relaxed">
              ArkivRoom is a decentralized workspace where wallets cryptographically own Rooms, attach sensitive Documents, and issue time-bound access Grants to other wallets—all settled on Arkiv Braga.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 5: TARGET AUDIENCE
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              04 / Target Audience
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white">
              Who is this meant for?
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.65)]">
              ArkivRoom empowers Web3-native organizations to handle sensitive off-chain data securely.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[2rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818]">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Briefcase className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">Startups & VCs</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Managing Investor Due Diligence. Startups can share cap tables and financial metrics securely with specific VC wallet addresses.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[2rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818]">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Users className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">DAO Treasury Ops</h3>
               <p className="text-[rgba(244,236,215,0.6)]">DAOs can finally manage private payroll, contractor agreements, and legal documents without relying on centralized corporate tools.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-[2rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818]">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <FlaskConical className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">Researchers & Creators</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Confidential medical research, IP, and proprietary algorithms can be mapped securely to identities using strict, time-bound grants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 6: WHAT WAS USED IN BUILDING IT (TECH STACK)
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
           <div className="space-y-6">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)]">
              05 / Tech Stack
            </p>
            <h2 className="text-5xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              What was used in building it.
            </h2>
            <p className="text-lg text-[rgba(244,236,215,0.65)] pt-4">
              ArkivRoom is built using modern, production-ready Web3 infrastructure.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
             <div className="flex gap-4 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-center">
                <Database className="w-8 h-8 text-[var(--color-mint)] shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-white">Arkiv SDK</h3>
                  <p className="text-sm text-[rgba(244,236,215,0.6)] mt-1">Data modeling & queries.</p>
                </div>
             </div>
             <div className="flex gap-4 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-center">
                <Cpu className="w-8 h-8 text-[var(--color-gold)] shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-white">Arkiv Braga</h3>
                  <p className="text-sm text-[rgba(244,236,215,0.6)] mt-1">Testnet settlement layer.</p>
                </div>
             </div>
             <div className="flex gap-4 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-center">
                <Code2 className="w-8 h-8 text-white shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-white">Next.js 16</h3>
                  <p className="text-sm text-[rgba(244,236,215,0.6)] mt-1">React application framework.</p>
                </div>
             </div>
             <div className="flex gap-4 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-center">
                <LockKeyhole className="w-8 h-8 text-[var(--color-rose)] shrink-0" />
                <div>
                  <h3 className="text-xl font-medium text-white">Wagmi & Viem</h3>
                  <p className="text-sm text-[rgba(244,236,215,0.6)] mt-1">Wallet connection & hooks.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 7: ARCHITECTURE & HOW IT WORKS
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full">
           <div className="space-y-4 max-w-3xl mb-12">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)]">
              06 / How it works
            </p>
            <h2 className="text-5xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              The Arkiv Architecture
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.65)]">
              We leverage 3 core entities and native `$owner` attributes to build relationships on a flat datastore.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)] relative">
              <LockKeyhole className="h-8 w-8 text-[var(--color-mint)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">1. The Room</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-sm mb-6">The parent entity. Defines the container that documents and grants inherit from.</p>
              <div className="text-xs font-mono text-[var(--color-mint)] opacity-80">Parent Key Generated</div>
            </div>
            
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
              <FileLock2 className="h-8 w-8 text-[var(--color-gold)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">2. The Document</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-sm mb-6">A sensitive record attached to a room. Inherits the parent `roomKey`.</p>
              <div className="text-xs font-mono text-[var(--color-gold)] opacity-80">Linked via roomKey</div>
            </div>
            
            <div className="p-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.02)]">
              <KeyRound className="h-8 w-8 text-[var(--color-rose)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">3. The Grant</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-sm mb-6">Gives a specific wallet access, restricted by an expiry date.</p>
              <div className="text-xs font-mono text-[var(--color-rose)] opacity-80">Linked via roomKey</div>
            </div>
          </div>
          
          <div className="mt-8 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
             <div>
                <h4 className="text-white font-medium mb-1">Strict Project Scoping</h4>
                <p className="text-sm text-[rgba(244,236,215,0.6)]">Every read and write is strictly siloed using the global project attribute.</p>
             </div>
             <div className="font-mono text-xs text-[var(--color-sand)] bg-black/40 p-4 rounded-xl">
                .where(eq("project", "{PROJECT_ATTRIBUTE}"))
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 8: CALL TO ACTION
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-[#0a1515]">
         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem] bg-[radial-gradient(circle_at_bottom,rgba(240,191,99,0.1),transparent_60%)]" />
         
         <div className="max-w-4xl w-full text-center space-y-10 z-10">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              07 / Live Demo
            </p>
            <h2 className="text-6xl md:text-8xl font-semibold tracking-[-0.05em] text-white">
              Ready to verify?
            </h2>
            <p className="text-2xl md:text-3xl font-light text-[rgba(244,236,215,0.7)] leading-snug">
              This isn't a mock backend. The live application reads and writes directly to the Arkiv Braga testnet.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10">
               <Link
                  href="/"
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-3 rounded-full bg-[var(--color-sand)] px-10 py-5 text-xl font-bold text-[#09201c] transition-transform hover:scale-105 shadow-[0_0_40px_rgba(244,236,215,0.2)]"
                >
                  <PlaySquare className="w-6 h-6" />
                  Launch Live Demo
                </Link>
                <Link
                  href="https://explorer.braga.hoodi.arkiv.network/"
                  target="_blank"
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-3 rounded-full border border-[rgba(244,236,215,0.2)] bg-black/50 backdrop-blur px-10 py-5 text-xl font-semibold text-white transition hover:bg-white/5"
                >
                  Open Braga Explorer
                </Link>
            </div>
            
            <div className="pt-20 border-t border-white/10 mt-20 flex justify-between items-center text-sm font-mono uppercase tracking-[0.2em] text-[rgba(244,236,215,0.4)]">
               <p>ArkivRoom</p>
               <p>End of Presentation</p>
            </div>
         </div>
      </section>

    </main>
  );
}
