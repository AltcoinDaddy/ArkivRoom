"use client";

import { Check, ArrowRight, LoaderCircle, Cpu, HelpCircle, Wallet } from "lucide-react";
import { useAccount, useChainId, useConnect, useConnectors, useSwitchChain } from "wagmi";
import { CHAIN } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function getErrorMessage(error: Error) {
  return "shortMessage" in error &&
    typeof error.shortMessage === "string" &&
    error.shortMessage.length > 0
    ? error.shortMessage
    : error.message;
}

export function AccessGuard() {
  const connectors = useConnectors();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending: isConnecting } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const injectedConnector = connectors[0];
  const onWrongChain = isConnected && chainId !== CHAIN.id;
  const isBusy = isConnecting || isSwitching;

  // Step calculations
  const step1Completed = isConnected;
  const step2Completed = isConnected && !onWrongChain;
  
  const step1Active = !isConnected;
  const step2Active = isConnected && onWrongChain;

  const handleConnect = () => {
    if (!injectedConnector) {
      toast.error("No injected wallet found. Open MetaMask or Rabby first.");
      return;
    }

    connect(
      { connector: injectedConnector, chainId: CHAIN.id },
      {
        onError(error) {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  const handleSwitch = () => {
    switchChain(
      { chainId: CHAIN.id },
      {
        onError(error) {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  return (
    <div className="relative flex min-h-[65vh] w-full flex-col items-center justify-center px-4 py-8 md:py-16">
      
      {/* ── Background Cyber Glows ── */}
      <div className="absolute -top-12 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,242,195,0.06)_0%,transparent_70%)] blur-2xl pointer-events-none" />
      {onWrongChain && (
        <div className="absolute -top-12 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,132,111,0.05)_0%,transparent_70%)] blur-2xl pointer-events-none" />
      )}

      {/* ── Visual Onboarding Card ── */}
      <div className="relative w-full max-w-[480px] rounded-[2rem] border border-[var(--color-border)] bg-[rgba(16,34,34,0.65)] p-8 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 hover:border-[rgba(244,236,215,0.2)] overflow-hidden group">
        
        {/* Top Scanline Glow */}
        <div className={cn(
          "absolute inset-x-0 top-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse",
          onWrongChain ? "bg-[var(--color-rose)]" : "bg-[var(--color-mint)]"
        )} />

        {/* Card Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-sand)] sm:text-3xl">
            Let&apos;s get you set up
          </h2>
          <p className="mt-2 text-sm text-[rgba(244,236,215,0.55)] font-light">
            Follow these two simple steps to access your secure document dashboard.
          </p>
        </div>

        {/* ── Vertical Stepper ── */}
        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[rgba(244,236,215,0.1)]">
          
          {/* Progress fill line */}
          <div 
            className={cn(
              "absolute left-3.5 top-2 w-[1px] bg-[var(--color-mint)] transition-all duration-500",
              step1Completed && !step2Active ? "bottom-2" : step1Completed ? "h-10" : "h-0"
            )}
          />

          {/* STEP 1: Connect Wallet */}
          <div className={cn(
            "relative transition-opacity duration-300",
            !step1Active && !step1Completed && "opacity-40"
          )}>
            {/* Step Bubble */}
            <div className={cn(
              "absolute -left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border transition-all duration-300",
              step1Completed 
                ? "bg-[rgba(143,242,195,0.15)] border-[var(--color-mint)] text-[var(--color-mint)] shadow-[0_0_10px_rgba(143,242,195,0.2)]" 
                : step1Active
                  ? "bg-[rgba(240,191,99,0.1)] border-[var(--color-gold)] text-[var(--color-gold)] animate-pulse"
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(244,236,215,0.1)] text-[rgba(244,236,215,0.4)]"
            )}>
              {step1Completed ? <Check className="h-3.5 w-3.5" /> : "1"}
            </div>

            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-semibold tracking-wide transition-colors",
                step1Active ? "text-[var(--color-sand)]" : step1Completed ? "text-[rgba(244,236,215,0.7)]" : "text-[rgba(244,236,215,0.4)]"
              )}>
                Step 1: Connect Wallet
              </h3>
              <p className="text-xs text-[rgba(244,236,215,0.5)] font-light leading-relaxed">
                Connect MetaMask or Rabby to identify your secure rooms and files.
              </p>
            </div>
          </div>

          {/* STEP 2: Switch to Braga Network */}
          <div className={cn(
            "relative transition-opacity duration-300",
            !step2Active && !step2Completed && "opacity-40"
          )}>
            {/* Step Bubble */}
            <div className={cn(
              "absolute -left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border transition-all duration-300",
              step2Completed 
                ? "bg-[rgba(143,242,195,0.15)] border-[var(--color-mint)] text-[var(--color-mint)] shadow-[0_0_10px_rgba(143,242,195,0.2)]" 
                : step2Active
                  ? "bg-[rgba(244,132,111,0.1)] border-[var(--color-rose)] text-[var(--color-rose)] animate-pulse"
                  : "bg-[rgba(255,255,255,0.02)] border-[rgba(244,236,215,0.1)] text-[rgba(244,236,215,0.4)]"
            )}>
              {step2Completed ? <Check className="h-3.5 w-3.5" /> : "2"}
            </div>

            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-semibold tracking-wide transition-colors",
                step2Active ? "text-[var(--color-sand)]" : step2Completed ? "text-[rgba(244,236,215,0.7)]" : "text-[rgba(244,236,215,0.4)]"
              )}>
                Step 2: Switch Network to Braga
              </h3>
              <p className="text-xs text-[rgba(244,236,215,0.5)] font-light leading-relaxed">
                Ensure your wallet is connected to the Braga Testnet ledger.
              </p>
            </div>
          </div>

          {/* STEP 3: Enter Vault */}
          <div className={cn(
            "relative transition-opacity duration-300",
            !step2Completed && "opacity-40"
          )}>
            {/* Step Bubble */}
            <div className={cn(
              "absolute -left-8 top-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border border-dashed transition-all duration-300",
              step2Completed
                ? "bg-[rgba(143,242,195,0.05)] border-[var(--color-mint)] text-[var(--color-mint)]"
                : "bg-[rgba(255,255,255,0.01)] border-[rgba(244,236,215,0.08)] text-[rgba(244,236,215,0.3)]"
            )}>
              {step2Completed ? <Check className="h-3.5 w-3.5 animate-pulse" /> : "3"}
            </div>

            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-semibold tracking-wide transition-colors",
                step2Completed ? "text-[var(--color-sand)]" : "text-[rgba(244,236,215,0.4)]"
              )}>
                Step 3: Ready to Enter
              </h3>
              <p className="text-xs text-[rgba(244,236,215,0.5)] font-light leading-relaxed">
                Unlock full access to view, upload, and grant file approvals.
              </p>
            </div>
          </div>

        </div>

        {/* ── Responsive Action Button ── */}
        <div className="mt-10 space-y-4">
          {step1Active ? (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isBusy}
              className={cn(
                "group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--color-mint)] py-4 text-sm font-semibold text-[#09201c] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_rgba(143,242,195,0.15)]",
                isBusy && "cursor-wait opacity-80"
              )}
            >
              {isBusy ? (
                <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Wallet className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
              )}
              Connect Web3 Wallet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : onWrongChain ? (
            <button
              type="button"
              onClick={handleSwitch}
              disabled={isBusy}
              className={cn(
                "group relative inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[var(--color-rose)] py-4 text-sm font-semibold text-[#240d09] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_rgba(244,132,111,0.15)]",
                isBusy && "cursor-wait opacity-80"
              )}
            >
              {isBusy ? (
                <LoaderCircle className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <Cpu className="h-4.5 w-4.5 transition-transform group-hover:rotate-12" />
              )}
              Switch Network to Braga
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <div className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-mint)] bg-[rgba(143,242,195,0.05)] text-sm font-semibold text-[var(--color-mint)]">
              <Check className="h-4 w-4" /> Ready to Enter
            </div>
          )}

          {/* Faucet Support */}
          <div className="flex justify-center">
            <a
              href="https://braga.holesky.arkiv.network"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[rgba(244,236,215,0.4)] hover:text-[rgba(244,236,215,0.8)] transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Need Golem (GLM) testnet gas tokens?
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
