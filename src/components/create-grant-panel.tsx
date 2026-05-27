"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, LoaderCircle, RefreshCw, ShieldPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { type Hex, type WalletClient } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import {
  buildGrantEntityInput,
  fetchProjectDocuments,
  fetchProjectGrants,
  fetchProjectRooms,
  getArkivWalletClient,
} from "@/lib/arkiv";
import { CHAIN, ENTITY_TYPES, PROJECT_ATTRIBUTE } from "@/lib/constants";
import { cn, formatAddress } from "@/lib/utils";

type WindowWithEthereum = Window & {
  ethereum?: {
    request: (...args: unknown[]) => Promise<unknown>;
  };
};

type Scope = "room" | "document";

type FormState = {
  roomKey: string;
  scope: Scope;
  documentKey: string;
  recipient: string;
  permission: "view" | "comment" | "download";
  expiresInDays: string;
};

const initialFormState: FormState = {
  roomKey: "",
  scope: "room",
  documentKey: "",
  recipient: "",
  permission: "view",
  expiresInDays: "7",
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

function buildExpiry(days: string) {
  const numericDays = Number(days);
  const safeDays = Number.isFinite(numericDays) && numericDays > 0 ? numericDays : 7;
  return new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000).toISOString();
}

async function createGrantWithWallet({
  walletClient,
  owner,
  values,
}: {
  walletClient: WalletClient;
  owner: Hex;
  values: FormState & { roomId: string; documentId?: string };
}) {
  const browserWindow = window as WindowWithEthereum;

  if (!browserWindow.ethereum) {
    throw new Error("Injected wallet provider not found.");
  }

  if (!walletClient.account) {
    throw new Error("Connected wallet account not available.");
  }

  const scopeId = values.scope === "document" ? (values.documentId ?? "document") : "room-wide";
  const grantId = `${slugify(values.roomId)}-${slugify(values.recipient)}-${slugify(scopeId)}-${Date.now()
    .toString()
    .slice(-6)}`;

  const grantInput = buildGrantEntityInput({
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.grant,
    owner,
    roomId: values.roomId,
    roomKey: values.roomKey as Hex,
    documentId: values.scope === "document" ? values.documentId : undefined,
    documentKey: values.scope === "document" ? (values.documentKey as Hex) : undefined,
    grantId,
    recipient: values.recipient.trim() as Hex,
    permission: values.permission,
    expiresAt: buildExpiry(values.expiresInDays),
  });

  const arkivWalletClient = getArkivWalletClient({
    account: walletClient.account,
    provider: browserWindow.ethereum,
  });
  const creation = await arkivWalletClient.createEntity(grantInput);
  await arkivWalletClient.waitForTransactionReceipt({ hash: creation.txHash });

  return creation;
}

export function CreateGrantPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId: CHAIN.id });
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialFormState);

  const roomsQuery = useQuery({
    queryKey: ["project-rooms"],
    queryFn: () => fetchProjectRooms(50),
    staleTime: 15_000,
  });

  const documentsQuery = useQuery({
    queryKey: ["project-documents"],
    queryFn: () => fetchProjectDocuments(60),
    staleTime: 15_000,
  });

  const grantsQuery = useQuery({
    queryKey: ["project-grants"],
    queryFn: () => fetchProjectGrants(30),
    staleTime: 15_000,
  });

  const selectedRoom = (roomsQuery.data ?? []).find((room) => room.key === form.roomKey);
  const roomDocuments = useMemo(
    () => (documentsQuery.data ?? []).filter((document) => document.roomKey === form.roomKey),
    [documentsQuery.data, form.roomKey],
  );
  const selectedDocument = roomDocuments.find((document) => document.key === form.documentKey);
  const canSubmit =
    isConnected &&
    chainId === CHAIN.id &&
    !!walletClient &&
    !!selectedRoom &&
    form.recipient.trim().length > 0 &&
    (form.scope === "room" || !!selectedDocument);

  const createGrantMutation = useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet first.");
      }

      if (chainId !== CHAIN.id) {
        throw new Error("Switch your wallet to Braga before creating a grant.");
      }

      if (!walletClient) {
        throw new Error("Wallet client not ready yet. Reconnect and try again.");
      }

      if (!selectedRoom) {
        throw new Error("Choose a room first.");
      }

      if (form.scope === "document" && !selectedDocument) {
        throw new Error("Choose a document for a document-scoped grant.");
      }

      return createGrantWithWallet({
        walletClient,
        owner: address,
        values: {
          ...form,
          roomId: selectedRoom.roomId,
          documentId: selectedDocument?.documentId,
        },
      });
    },
    onSuccess() {
      toast.success("Grant created on Arkiv Braga.");
      setForm((current) => ({
        ...initialFormState,
        roomKey: current.roomKey,
      }));
      queryClient.invalidateQueries({ queryKey: ["project-grants"] });
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
              Step 3
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Grant another wallet access
            </h2>
          </div>
          <ShieldPlus className="h-8 w-8 text-[var(--color-rose)]" />
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[rgba(244,132,111,0.16)] bg-[rgba(244,132,111,0.08)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.76)]">
          Finish the flow by giving another wallet room-wide access or document-specific access with
          an expiry.
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createGrantMutation.mutate();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Room</span>
            <select
              value={form.roomKey}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  roomKey: event.target.value,
                  documentKey: "",
                }))
              }
              className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
            >
              <option value="">Select a room</option>
              {(roomsQuery.data ?? []).map((room) => (
                <option key={room.key} value={room.key}>
                  {room.name} ({room.roomId})
                </option>
              ))}
            </select>
          </label>

          {selectedRoom ? (
            <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                Parent room entity key
              </p>
              <p className="mt-2 truncate font-mono text-xs text-[var(--color-sand)]">{selectedRoom.key}</p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Grant scope</span>
              <select
                value={form.scope}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    scope: event.target.value as Scope,
                    documentId: "",
                  }))
                }
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
              >
                <option value="room">room-wide</option>
                <option value="document">single document</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Permission</span>
              <select
                value={form.permission}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    permission: event.target.value as FormState["permission"],
                  }))
                }
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
              >
                <option value="view">view</option>
                <option value="comment">comment</option>
                <option value="download">download</option>
              </select>
            </label>
          </div>

          {form.scope === "document" ? (
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Document</span>
              <select
                value={form.documentKey}
                onChange={(event) =>
                  setForm((current) => ({ ...current, documentKey: event.target.value }))
                }
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
              >
                <option value="">Select a document</option>
                {roomDocuments.map((document) => (
                  <option key={document.key} value={document.key}>
                    {document.title} ({document.documentId})
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Recipient wallet</span>
              <input
                value={form.recipient}
                onChange={(event) =>
                  setForm((current) => ({ ...current, recipient: event.target.value }))
                }
                placeholder="0x..."
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Expires in days</span>
              <input
                value={form.expiresInDays}
                onChange={(event) =>
                  setForm((current) => ({ ...current, expiresInDays: event.target.value }))
                }
                inputMode="numeric"
                placeholder="7"
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
              />
            </label>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
            {isConnected
              ? `Grant issuer: ${formatAddress(address)}`
              : "Connect a wallet first so the grant can be signed by the room owner."}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || createGrantMutation.isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-rose)] px-5 py-3 text-sm font-semibold text-[#240d09] transition hover:translate-y-[-1px]",
              (!canSubmit || createGrantMutation.isPending) && "cursor-not-allowed opacity-80",
            )}
          >
            {createGrantMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Create grant on Braga
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Step 3 result
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Grant entities fetched back from Arkiv
            </h2>
          </div>
          <button
            type="button"
            onClick={() => grantsQuery.refetch()}
            disabled={grantsQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] disabled:cursor-wait disabled:opacity-75"
          >
            <RefreshCw className={cn("h-4 w-4", grantsQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {grantsQuery.isLoading ? (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm text-[rgba(244,236,215,0.72)]">
              Loading project-scoped grants from Arkiv...
            </div>
          ) : grantsQuery.isError ? (
            <div className="rounded-[1.35rem] border border-[rgba(244,132,111,0.18)] bg-[rgba(244,132,111,0.08)] p-5 text-sm text-[rgba(244,236,215,0.78)]">
              Could not fetch grants from Braga right now. The access-control query is ready, but the RPC did not respond cleanly.
            </div>
          ) : grantsQuery.data && grantsQuery.data.length > 0 ? (
            grantsQuery.data.map((grant) => (
              <article
                key={grant.key}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgba(244,236,215,0.46)]">
                      {grant.roomId}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-sand)]">
                      {grant.documentId ? "Document grant" : "Room-wide grant"}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
                      Recipient {formatAddress(grant.recipient)} can {grant.permission}
                      {grant.documentId ? ` ${grant.documentId}` : " this room"} until{" "}
                      {new Date(grant.expiresAt).toLocaleString()}.
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(244,132,111,0.18)] bg-[rgba(244,132,111,0.08)] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-rose)]">
                    {grant.permission}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Owner
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-sand)]">
                      {formatAddress(grant.owner)}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Target
                    </p>
                    <p className="mt-2 truncate font-mono text-xs text-[var(--color-sand)]">
                      {grant.documentKey ?? grant.roomKey}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
              No live grants found for this project yet. Create one to show reviewers the access-control
              layer that completes the Privacy story.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
