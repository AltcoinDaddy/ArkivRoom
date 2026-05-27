"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { Navbar } from "@/components/navbar";
import { CreateRoomPanel } from "@/components/create-room-panel";
import { CreateDocumentPanel } from "@/components/create-document-panel";
import { CreateGrantPanel } from "@/components/create-grant-panel";
import { AccessGuard } from "@/components/access-guard";
import { CHAIN } from "@/lib/constants";
import { LockKeyhole, FileText, KeyRound, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = "rooms" | "documents" | "grants";

export default function AppConsole() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [activeTab, setActiveTab] = useState<ActiveTab>("rooms");

  const isReady = isConnected && chainId === CHAIN.id;

  const tabs = [
    {
      id: "rooms" as ActiveTab,
      name: "Rooms Console",
      description: "Manage Parent Vault Containers",
      icon: LockKeyhole,
      colorClass: "text-[var(--color-mint)] border-[rgba(143,242,195,0.2)] bg-[rgba(143,242,195,0.03)]",
      activeColorClass: "bg-[rgba(143,242,195,0.08)] text-[var(--color-mint)] border-[rgba(143,242,195,0.25)] shadow-[0_0_20px_rgba(143,242,195,0.1)]",
    },
    {
      id: "documents" as ActiveTab,
      name: "Documents Console",
      description: "Attach Sensitive Records",
      icon: FileText,
      colorClass: "text-[var(--color-gold)] border-[rgba(240,191,99,0.2)] bg-[rgba(240,191,99,0.03)]",
      activeColorClass: "bg-[rgba(240,191,99,0.08)] text-[var(--color-gold)] border-[rgba(240,191,99,0.25)] shadow-[0_0_20px_rgba(240,191,99,0.1)]",
    },
    {
      id: "grants" as ActiveTab,
      name: "Access Control Console",
      description: "Issue Time-Bound Permissions",
      icon: KeyRound,
      colorClass: "text-[var(--color-rose)] border-[rgba(244,132,111,0.2)] bg-[rgba(244,132,111,0.03)]",
      activeColorClass: "bg-[rgba(244,132,111,0.08)] text-[var(--color-rose)] border-[rgba(244,132,111,0.25)] shadow-[0_0_20px_rgba(244,132,111,0.1)]",
    },
  ];

  return (
    <>
      <Navbar />
      
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-28 md:py-32 sm:px-10 lg:px-12 gap-10">
        
        {!isReady ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <AccessGuard />
          </div>
        ) : (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Intro section */}
            <section className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 mt-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(244,236,215,0.1)] bg-[rgba(255,255,255,0.02)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[rgba(244,236,215,0.5)]">
                    <Cpu className="h-3 w-3" />
                    Sovereign Cryptographic Ledger Console
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-[var(--color-sand)] sm:text-5xl">
                    Vault Control Center
                  </h1>
                  <p className="max-w-3xl text-sm sm:text-base text-[rgba(244,236,215,0.6)]">
                    Create cryptographic rooms, attach end-to-end encrypted records, and coordinate access grants directly settled on the Arkiv Braga testnet.
                  </p>
                </div>

                {/* Micro connection panel */}
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-4 backdrop-blur-xl shrink-0">
                  <span className={cn(
                    "h-3 w-3 rounded-full shrink-0",
                    isReady ? "bg-[var(--color-mint)] shadow-[0_0_12px_var(--color-mint)]" : "bg-[rgba(244,236,215,0.2)] animate-pulse"
                  )} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand)]">
                      {isReady ? "Braga Testnet Active" : "Connection Locked"}
                    </p>
                    <p className="text-[10px] font-mono text-[rgba(244,236,215,0.5)] mt-0.5 truncate max-w-[180px]">
                      {isReady && address ? address : "Connect wallet on Braga chain"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Dynamic Multi-Console Tab Switcher */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isTabActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-start gap-4 rounded-[1.5rem] border p-5 text-left transition-all duration-300 relative overflow-hidden group cursor-pointer",
                      isTabActive
                        ? tab.activeColorClass
                        : "border-[var(--color-border)] bg-[rgba(255,255,255,0.01)] text-[rgba(244,236,215,0.5)] hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(244,236,215,0.2)]"
                    )}
                  >
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                      isTabActive
                        ? "bg-[rgba(255,255,255,0.05)] scale-105"
                        : "bg-[rgba(255,255,255,0.02)]"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={cn(
                        "font-semibold text-base transition-colors",
                        isTabActive ? "text-[var(--color-sand)] font-bold" : "text-[rgba(244,236,215,0.7)] group-hover:text-[var(--color-sand)]"
                      )}>
                        {tab.name}
                      </h3>
                      <p className="text-xs text-[rgba(244,236,215,0.55)] font-light leading-relaxed">
                        {tab.description}
                      </p>
                    </div>
                    
                    {/* Active Indicator Bar */}
                    {isTabActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-current" />
                    )}
                  </button>
                );
              })}
            </section>

            {/* Tab Panel Render Container */}
            <section className="bg-[rgba(255,255,255,0.01)] rounded-[2.5rem] p-1 border border-[rgba(244,236,215,0.03)] shadow-2xl relative overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 rounded-[2.35rem] bg-[rgba(13,23,23,0.3)] backdrop-blur-3xl min-h-[500px]">
                {activeTab === "rooms" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CreateRoomPanel />
                  </div>
                )}
                
                {activeTab === "documents" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CreateDocumentPanel />
                  </div>
                )}
                
                {activeTab === "grants" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CreateGrantPanel />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

      </main>
    </>
  );
}
