"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus, RefreshCw, Vault } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Hex, type WalletClient } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { fetchProjectRooms, buildRoomEntityInput, getArkivWalletClient } from "@/lib/arkiv";
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

type WindowWithEthereum = Window & {
  ethereum?: {
    request: (...args: unknown[]) => Promise<unknown>;
  };
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
  values,
}: {
  walletClient: WalletClient;
  owner: Hex;
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

  const browserWindow = window as WindowWithEthereum;

  if (!browserWindow.ethereum) {
    throw new Error("Injected wallet provider not found.");
  }

  if (!walletClient.account) {
    throw new Error("Connected wallet account not available.");
  }

  const arkivWalletClient = getArkivWalletClient({
    account: walletClient.account,
    provider: browserWindow.ethereum,
  });
  const creation = await arkivWalletClient.createEntity(roomInput);
  await arkivWalletClient.waitForTransactionReceipt({ hash: creation.txHash });

  return creation;
}

export function CreateRoomPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId: CHAIN.id });
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialFormState);

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

      return createRoomWithWallet({
        walletClient,
        owner: address,
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
    <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Create room
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Ship the happy path
            </h2>
          </div>
          <Vault className="h-8 w-8 text-[var(--color-mint)]" />
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[rgba(143,242,195,0.16)] bg-[rgba(143,242,195,0.08)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.76)]">
          This form writes a real `Room` entity with your `PROJECT_ATTRIBUTE`, room metadata, and a
          30-day expiry.
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
              placeholder="Private diligence documents and short-lived reviewer access."
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
            disabled={createRoomMutation.isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-mint)] px-5 py-3 text-sm font-semibold text-[#09201c] transition hover:translate-y-[-1px]",
              createRoomMutation.isPending && "cursor-wait opacity-80",
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

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Live project rooms
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Scoped readback from Arkiv
            </h2>
          </div>
          <button
            type="button"
            onClick={() => roomsQuery.refetch()}
            disabled={roomsQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] disabled:cursor-wait disabled:opacity-75"
          >
            <RefreshCw className={cn("h-4 w-4", roomsQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {roomsQuery.isLoading ? (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm text-[rgba(244,236,215,0.72)]">
              Loading project-scoped rooms from Arkiv...
            </div>
          ) : roomsQuery.isError ? (
            <div className="rounded-[1.35rem] border border-[rgba(244,132,111,0.18)] bg-[rgba(244,132,111,0.08)] p-5 text-sm text-[rgba(244,236,215,0.78)]">
              Could not fetch rooms from Braga right now. The query helper is ready, but the RPC did not respond cleanly.
            </div>
          ) : roomsQuery.data && roomsQuery.data.length > 0 ? (
            roomsQuery.data.map((room) => (
              <article
                key={room.key}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgba(244,236,215,0.46)]">
                      {room.roomId}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--color-sand)]">{room.name}</h3>
                    <p className="mt-2 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
                      {room.description}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(143,242,195,0.18)] bg-[rgba(143,242,195,0.08)] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-mint)]">
                    {room.sensitivity}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {room.tags.map((tag) => (
                    <span
                      key={`${room.key}-${tag}`}
                      className="rounded-full border border-[var(--color-border)] bg-[#081111] px-3 py-1.5 font-mono text-xs text-[var(--color-gold)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Owner
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-sand)]">
                      {formatAddress(room.owner)}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Entity key
                    </p>
                    <p className="mt-2 truncate font-mono text-xs text-[var(--color-sand)]">{room.key}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
              No live rooms found for this project attribute yet. Use the form on the left to create the
              first one and then refresh this panel.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
