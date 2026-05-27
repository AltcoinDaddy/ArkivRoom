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
  ServerOff
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
          SLIDE 1: HERO / HOOK
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 relative overflow-hidden group">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(143,242,195,0.12),transparent_60%)]" />
        
        <div className="max-w-6xl w-full flex flex-col gap-14 z-10 mt-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(244,236,215,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(244,236,215,0.8)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              ETHNS Arkiv Challenge Submission
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-[-0.05em] text-white">
              ArkivRoom
            </h1>
            <p className="text-2xl md:text-4xl font-light text-[rgba(244,236,215,0.7)] max-w-4xl leading-[1.3]">
              The privacy layer for wallet-owned confidential collaboration.
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
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
           <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Scroll</p>
           <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"></div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 2: THE PROBLEM
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-center">
          <div className="space-y-8">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-rose)]">
              01 / The Problem
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              Web3 solves transactions, but fails at private collaboration.
            </h2>
            <p className="text-xl leading-relaxed text-[rgba(244,236,215,0.65)]">
              Most decentralized applications force teams into an uncomfortable compromise: broadcast your sensitive data to the world, or fall back to centralized Web2 databases.
            </p>
          </div>
          
          <div className="space-y-5">
            <div className="p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818] hover:border-[var(--color-rose)]/30 transition-colors">
               <ServerOff className="w-6 h-6 text-[var(--color-rose)] mb-4" />
               <h3 className="text-xl font-medium text-white mb-2">The Off-Chain Trap</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Teams rely on centralized cloud storage (AWS, Google Drive) for sensitive data, defeating the purpose of decentralized identity entirely.</p>
            </div>
            <div className="p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-[#0c1818] hover:border-[var(--color-gold)]/30 transition-colors">
               <Database className="w-6 h-6 text-[var(--color-gold)] mb-4" />
               <h3 className="text-xl font-medium text-white mb-2">Structureless Storage</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Existing DApps stop at raw storage (like IPFS) without providing structured ownership, time-bound grants, or queryable relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 3: THE SOLUTION
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full">
           <div className="space-y-6 max-w-3xl mb-16">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)]">
              02 / The Solution
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              ArkivRoom: The privacy workflow layer.
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.65)] leading-relaxed">
              We built a decentralized, wallet-to-wallet confidential workspace where the data structure, ownership, and access grants all live strictly on Arkiv Braga.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[2rem] border border-[rgba(143,242,195,0.2)] bg-[linear-gradient(180deg,rgba(143,242,195,0.05),transparent)] hover:-translate-y-1 transition-transform">
              <LockKeyhole className="h-8 w-8 text-[var(--color-mint)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">1. The Room</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-base mb-6">The parent entity for a private workspace. It defines the confidential container that documents and grants inherit from.</p>
            </div>
            
            <div className="p-8 rounded-[2rem] border border-[rgba(240,191,99,0.2)] bg-[linear-gradient(180deg,rgba(240,191,99,0.05),transparent)] hover:-translate-y-1 transition-transform">
              <FileLock2 className="h-8 w-8 text-[var(--color-gold)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">2. The Document</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-base mb-6">A sensitive record attached to a room. It keeps both human-readable IDs and the parent room entity key.</p>
            </div>
            
            <div className="p-8 rounded-[2rem] border border-[rgba(244,132,111,0.2)] bg-[linear-gradient(180deg,rgba(244,132,111,0.05),transparent)] hover:-translate-y-1 transition-transform">
              <KeyRound className="h-8 w-8 text-[var(--color-rose)] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-3">3. The Grant</h3>
              <p className="text-[rgba(244,236,215,0.6)] text-base mb-6">A permission entity that gives another wallet room-wide or document-level access with a strict expiry date.</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 4: REAL WORLD USE CASES
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full">
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
              03 / Market Fit
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white">
              Where does ArkivRoom fit?
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.65)]">
              Real-world scenarios that desperately need wallet-based privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Briefcase className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">Investor Due Diligence</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Startups can share sensitive cap tables, metrics, and strategy documents securely with specific VCs' wallet addresses.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <Users className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">DAO Treasury Ops</h3>
               <p className="text-[rgba(244,236,215,0.6)]">DAOs can finally manage private payroll, contractor agreements, and legal documents without relying on centralized tools.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <FlaskConical className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-medium text-white">Medical & IP Research</h3>
               <p className="text-[rgba(244,236,215,0.6)]">Confidential research and intellectual property can be mapped securely to identities using time-bound access grants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 5: WHY ARKIV? (THE SECRET SAUCE)
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-center">
           <div className="space-y-6">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-mint)]">
              04 / The Tech
            </p>
            <h2 className="text-5xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              Why we built on Arkiv Braga.
            </h2>
            <p className="text-lg text-[rgba(244,236,215,0.65)] pt-4">
              We aren't just storing data on a blockchain. We are utilizing Arkiv's native primitives to enforce security.
            </p>
          </div>
          
          <div className="space-y-4">
             <div className="flex gap-5 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-start">
                <ShieldCheck className="w-8 h-8 text-[var(--color-mint)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Native Ownership Attributes</h3>
                  <p className="text-[rgba(244,236,215,0.6)]">Ownership and creator attribution come directly from Arkiv's `$owner` and `$creator` attributes. No complex smart contract logic required.</p>
                </div>
             </div>
             <div className="flex gap-5 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-start">
                <Blocks className="w-8 h-8 text-[var(--color-gold)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Strict Project Scoping</h3>
                  <p className="text-[rgba(244,236,215,0.6)]">Every entity write and every query mandates the `arkivroom::privacy::braga::v1` attribute, creating an impenetrable application silo on a public layer.</p>
                </div>
             </div>
             <div className="flex gap-5 bg-[#0c1818] p-6 rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] items-start">
                <Database className="w-8 h-8 text-[var(--color-rose)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">Relational Mapping</h3>
                  <p className="text-[rgba(244,236,215,0.6)]">We map complex hierarchical relationships on a flat datastore by threading parent keys (e.g., `roomKey`) into the custom attributes of child entities.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 6: DEMO WORKFLOW (HOW TO VERIFY)
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 bg-[#0a1515]">
        <div className="max-w-6xl w-full">
           <div className="space-y-4 max-w-3xl mb-16">
             <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-sand)] opacity-60">
              05 / Verification
            </p>
            <h2 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-white leading-[1.1]">
              How to verify the build.
            </h2>
            <p className="text-xl text-[rgba(244,236,215,0.65)]">
              You can test the entire lifecycle in under two minutes directly from the browser.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { step: "1", title: "Connect", desc: "Connect a wallet to the Braga testnet.", color: "text-[var(--color-sand)]" },
               { step: "2", title: "Create", desc: "Create a Room (e.g., 'Series A Due Diligence').", color: "text-[var(--color-mint)]" },
               { step: "3", title: "Attach", desc: "Add a Document to the newly created room.", color: "text-[var(--color-gold)]" },
               { step: "4", title: "Grant", desc: "Issue a time-bound Grant to another wallet.", color: "text-[var(--color-rose)]" }
             ].map((item) => (
                <div key={item.step} className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl relative overflow-hidden">
                   <div className={`text-6xl font-black absolute -right-4 -bottom-6 opacity-[0.03] ${item.color}`}>{item.step}</div>
                   <p className={`font-mono text-xs uppercase tracking-[0.2em] mb-4 ${item.color}`}>Step {item.step}</p>
                   <h3 className="text-2xl font-semibold text-white mb-2">{item.title}</h3>
                   <p className="text-sm text-[rgba(244,236,215,0.6)] leading-relaxed">{item.desc}</p>
                </div>
             ))}
          </div>
          
          <div className="mt-8 p-6 rounded-2xl bg-[rgba(143,242,195,0.05)] border border-[rgba(143,242,195,0.1)] flex items-center justify-between">
             <div>
                <h3 className="text-xl font-medium text-white mb-1">Step 5: Verify on the Network</h3>
                <p className="text-[rgba(244,236,215,0.6)]">Refresh the Live Data panels to instantly query the Arkiv Network and pull your project-scoped records.</p>
             </div>
             <Database className="w-10 h-10 text-[var(--color-mint)] opacity-50" />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          SLIDE 7: CALL TO ACTION
      -------------------------------------------------------------------------- */}
      <section className="snap-start snap-always h-screen w-full flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
         <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem] bg-[radial-gradient(circle_at_bottom,rgba(240,191,99,0.1),transparent_60%)]" />
         
         <div className="max-w-4xl w-full text-center space-y-10 z-10">
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
