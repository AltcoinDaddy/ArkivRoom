"use client";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { Navbar } from "@/components/navbar";
import { CreateRoomPanel } from "@/components/create-room-panel";
import { CreateDocumentPanel } from "@/components/create-document-panel";
import { CreateGrantPanel } from "@/components/create-grant-panel";
import { CHAIN } from "@/lib/constants";
import { LockKeyhole, FileText, KeyRound } from "lucide-react";
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
      activeColorClass:
        "bg-[rgba(143,242,195,0.08)] text-[var(--color-mint)] border-[rgba(143,242,195,0.25)] shadow-[0_0_20px_rgba(143,242,195,0.1)]",
    },
    {
      id: "documents" as ActiveTab,
      name: "Documents Console",
      description: "Attach Sensitive Records",
      icon: FileText,
      activeColorClass:
        "bg-[rgba(240,191,99,0.08)] text-[var(--color-gold)] border-[rgba(240,191,99,0.25)] shadow-[0_0_20px_rgba(240,191,99,0.1)]",
    },
    {
      id: "grants" as ActiveTab,
      name: "Access Control Console",
      description: "Issue Time-Bound Permissions",
      icon: KeyRound,
      activeColorClass:
        "bg-[rgba(244,132,111,0.08)] text-[var(--color-rose)] border-[rgba(244,132,111,0.25)] shadow-[0_0_20px_rgba(244,132,111,0.1)]",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-28 sm:px-10 md:py-32 lg:px-12">
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="mt-4 flex flex-col gap-6 border-b border-[var(--color-border)] pb-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--color-sand)] sm:text-5xl">
                  Vault Control Center
                </h1>
                <p className="max-w-3xl text-sm text-[rgba(244,236,215,0.6)] sm:text-base">
                  Create cryptographic rooms, attach end-to-end encrypted records, and coordinate
                  access grants directly settled on the Arkiv Braga testnet.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-4 backdrop-blur-xl">
                <span
                  className={cn(
                    "h-3 w-3 rounded-full shrink-0",
                    isReady
                      ? "bg-[var(--color-mint)] shadow-[0_0_12px_var(--color-mint)]"
                      : "bg-[var(--color-gold)] shadow-[0_0_12px_var(--color-gold)]",
                  )}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand)]">
                    {isReady ? "Braga Testnet Active" : "Read Mode Active"}
                  </p>
                  <p className="mt-0.5 max-w-[220px] truncate font-mono text-[10px] text-[rgba(244,236,215,0.5)]">
                    {isReady && address ? address : "Connect wallet on Braga to publish entities"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isTabActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "group relative flex items-start gap-4 overflow-hidden rounded-[1.5rem] border p-5 text-left transition-all duration-300",
                    isTabActive
                      ? tab.activeColorClass
                      : "border-[var(--color-border)] bg-[rgba(255,255,255,0.01)] text-[rgba(244,236,215,0.5)] hover:border-[rgba(244,236,215,0.2)] hover:bg-[rgba(255,255,255,0.03)]",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                      isTabActive ? "scale-105 bg-[rgba(255,255,255,0.05)]" : "bg-[rgba(255,255,255,0.02)]",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={cn(
                        "text-base font-semibold transition-colors",
                        isTabActive
                          ? "font-bold text-[var(--color-sand)]"
                          : "text-[rgba(244,236,215,0.7)] group-hover:text-[var(--color-sand)]",
                      )}
                    >
                      {tab.name}
                    </h3>
                    <p className="text-xs font-light leading-relaxed text-[rgba(244,236,215,0.55)]">
                      {tab.description}
                    </p>
                  </div>

                  {isTabActive ? <div className="absolute inset-y-0 left-0 w-1 bg-current" /> : null}
                </button>
              );
            })}
          </section>

          <section className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(244,236,215,0.03)] bg-[rgba(255,255,255,0.01)] p-1 shadow-2xl">
            <div className="min-h-[500px] rounded-[2.35rem] bg-[rgba(13,23,23,0.3)] p-4 backdrop-blur-3xl sm:p-6 md:p-8">
              {activeTab === "rooms" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CreateRoomPanel />
                </div>
              ) : null}

              {activeTab === "documents" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CreateDocumentPanel />
                </div>
              ) : null}

              {activeTab === "grants" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CreateGrantPanel />
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
