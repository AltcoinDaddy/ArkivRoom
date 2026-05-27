"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { WalletButton } from "./wallet-button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-5 md:px-8 w-full">
      <div className="mx-auto max-w-7xl rounded-full border border-[var(--color-border)] bg-[rgba(13,23,23,0.7)] px-6 py-3 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(143,242,195,0.08)] border border-[rgba(143,242,195,0.15)] transition-all duration-300 group-hover:border-[var(--color-mint)]">
              <LockKeyhole className="h-4.5 w-4.5 text-[var(--color-mint)]" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[var(--color-sand)] transition-colors duration-300 group-hover:text-white">
              ArkivRoom
            </span>
          </Link>

          <WalletButton />

        </div>
      </div>
    </nav>
  );
}
