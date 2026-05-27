"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, Vault } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Hex, type WalletClient } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import {
  fetchProjectRooms,
  buildRoomEntityInput,
  getArkivWalletClient,
  type BrowserEthereumProvider,
  isBrowserEthereumProvider,
} from "@/lib/arkiv";
import { CHAIN, ENTITY_TYPES, PROJECT_ATTRIBUTE } from "@/lib/constants";
import { cn, formatAddress } from "@/lib/utils";

type FormState = {
  name: string;
  description: string;
  sensitivity: "strict" | "internal" | "shared";
  tags: string;
};

const initialFormState: FormState = {
  name: "",
  description: "",
  sensitivity: "strict",
  tags: "due-diligence, founders, confidential",
};



function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getWalletMessage(error: Error) {
  return "shortMessage" in error &&
    typeof error.shortMessage === "string" &&
    error.shortMessage.length > 0
    ? error.shortMessage
    : error.message;
}

async function createRoomWithWallet({
  walletClient,
  owner,
  provider,
  values,
}: {
  walletClient: WalletClient;
  owner: Hex;
  provider: BrowserEthereumProvider;
  values: FormState;
}) {
  const roomId = `${slugify(values.name)}-${Date.now().toString().slice(-6)}`;
  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 6);

  const roomInput = buildRoomEntityInput({
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.room,
    owner,
    roomId,
    name: values.name.trim(),
    description: values.description.trim(),
    sensitivity: values.sensitivity,
    tags,
  });

  if (!walletClient.account) {
    throw new Error("Connected wallet account not available.");
  }

  const arkivWalletClient = getArkivWalletClient({
    account: walletClient.account,
    provider,
  });
  const creation = await arkivWalletClient.createEntity(roomInput);
  await arkivWalletClient.waitForTransactionReceipt({ hash: creation.txHash });

  return creation;
}

export function CreateRoomPanel() {
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId: CHAIN.id });
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialFormState);
  const canSubmit =
    isConnected &&
    chainId === CHAIN.id &&
    !!walletClient &&
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 12;

  const roomsQuery = useQuery({
    queryKey: ["project-rooms"],
    queryFn: () => fetchProjectRooms(20),
    staleTime: 15_000,
  });

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet first.");
      }

      if (chainId !== CHAIN.id) {
        throw new Error("Switch your wallet to Braga before creating a room.");
      }

      if (!walletClient) {
        throw new Error("Wallet client not ready yet. Reconnect and try again.");
      }

      const provider = await connector?.getProvider();
      if (!isBrowserEthereumProvider(provider)) {
        throw new Error("Connected wallet provider not available.");
      }

      return createRoomWithWallet({
        walletClient,
        owner: address,
        provider,
        values: form,
      });
    },
    onSuccess(result) {
      toast.success("Room created on Arkiv Braga.");
      setForm(initialFormState);
      queryClient.invalidateQueries({ queryKey: ["project-rooms"] });
      navigator.clipboard
        .writeText(result.entityKey)
        .then(() => toast.success("Entity key copied to clipboard."))
        .catch(() => undefined);
    },
    onError(error) {
      toast.error(getWalletMessage(error));
    },
  });

  return (
    <section className="max-w-2xl mx-auto">
      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Step 1
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Create the room first
            </h2>
          </div>
          <Vault className="h-8 w-8 text-[var(--color-mint)]" />
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[rgba(143,242,195,0.16)] bg-[rgba(143,242,195,0.08)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.76)]">
          Start here. This writes the parent `Room` entity that the document and grant steps depend
          on.
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createRoomMutation.mutate();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Room name</span>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Investor DD"
              className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Description</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Private diligence documents and short-lived wallet access."
              rows={4}
              className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Sensitivity</span>
              <select
                value={form.sensitivity}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sensitivity: event.target.value as FormState["sensitivity"],
                  }))
                }
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
              >
                <option value="strict">strict</option>
                <option value="internal">internal</option>
                <option value="shared">shared</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Tags</span>
              <input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="legal, cap-table, investor"
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
              />
            </label>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
            {isConnected
              ? `Owner wallet: ${formatAddress(address)}`
              : "Connect a wallet first so the form can sign and publish the room."}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || createRoomMutation.isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-[#09201c] transition hover:translate-y-[-1px]",
              (!canSubmit || createRoomMutation.isPending) && "cursor-not-allowed opacity-80",
            )}
          >
            {createRoomMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Create room on Braga
          </button>
        </form>
      </div>


    </section>
  );
}
