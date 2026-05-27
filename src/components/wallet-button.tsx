"use client";

import { LoaderCircle, LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { CHAIN } from "@/lib/constants";
import { cn, formatAddress } from "@/lib/utils";

function getErrorMessage(error: Error) {
  return "shortMessage" in error &&
    typeof error.shortMessage === "string" &&
    error.shortMessage.length > 0
    ? error.shortMessage
    : error.message;
}

export function WalletButton() {
  const connectors = useConnectors();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const injectedConnector = connectors[0];
  const onWrongChain = isConnected && chainId !== CHAIN.id;
  const isBusy = isConnecting || isSwitching;

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
    <div className="flex flex-wrap items-center justify-end gap-3">
      {!isConnected ? (
        <button
          type="button"
          onClick={handleConnect}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(143,242,195,0.12)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(143,242,195,0.4)] hover:bg-[rgba(143,242,195,0.18)]",
            isBusy && "cursor-wait opacity-80",
          )}
          disabled={isBusy}
        >
          {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          Connect wallet
        </button>
      ) : onWrongChain ? (
        <button
          type="button"
          onClick={handleSwitch}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[rgba(244,132,111,0.35)] bg-[rgba(244,132,111,0.12)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:bg-[rgba(244,132,111,0.18)]",
            isBusy && "cursor-wait opacity-80",
          )}
          disabled={isBusy}
        >
          {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
          Switch to Braga
        </button>
      ) : (
        <>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(143,242,195,0.25)] bg-[rgba(143,242,195,0.1)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)]">
            <Wallet className="h-4 w-4 text-[var(--color-mint)]" />
            {formatAddress(address)}
          </div>
          <button
            type="button"
            onClick={() => disconnect()}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-semibold text-[rgba(244,236,215,0.82)] transition hover:border-[rgba(244,236,215,0.28)] hover:text-[var(--color-sand)]"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
