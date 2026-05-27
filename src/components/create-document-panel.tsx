"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FilePlus2, LoaderCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Hex, type WalletClient } from "viem";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import {
  buildDocumentEntityInput,
  fetchProjectDocuments,
  fetchProjectRooms,
  getArkivWalletClient,
} from "@/lib/arkiv";
import { CHAIN, ENTITY_TYPES, PROJECT_ATTRIBUTE } from "@/lib/constants";
import { cn, formatAddress } from "@/lib/utils";



type FormState = {
  roomKey: string;
  title: string;
  summary: string;
  uri: string;
  accessTier: "view" | "review" | "download";
};

const initialFormState: FormState = {
  roomKey: "",
  title: "",
  summary: "",
  uri: "https://example.com/private/doc.pdf",
  accessTier: "review",
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

async function createDocumentWithWallet({
  walletClient,
  owner,
  provider,
  values,
}: {
  walletClient: WalletClient;
  owner: Hex;
  provider: any;
  values: FormState & { roomId: string };
}) {
  if (!walletClient.account) {
    throw new Error("Connected wallet account not available.");
  }

  const documentId = `${slugify(values.title)}-${Date.now().toString().slice(-6)}`;
  const documentInput = buildDocumentEntityInput({
    project: PROJECT_ATTRIBUTE,
    entityType: ENTITY_TYPES.document,
    owner,
    roomId: values.roomId,
    roomKey: values.roomKey as Hex,
    documentId,
    title: values.title.trim(),
    summary: values.summary.trim(),
    uri: values.uri.trim(),
    accessTier: values.accessTier,
  });

  const arkivWalletClient = getArkivWalletClient({
    account: walletClient.account,
    provider,
  });
  const creation = await arkivWalletClient.createEntity(documentInput);
  await arkivWalletClient.waitForTransactionReceipt({ hash: creation.txHash });

  return creation;
}

export function CreateDocumentPanel() {
  const { address, isConnected, connector } = useAccount();
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
    queryFn: () => fetchProjectDocuments(30),
    staleTime: 15_000,
  });
  const selectedRoom = (roomsQuery.data ?? []).find((room) => room.key === form.roomKey);
  const canSubmit =
    isConnected &&
    chainId === CHAIN.id &&
    !!walletClient &&
    !!selectedRoom &&
    form.title.trim().length >= 3 &&
    form.summary.trim().length >= 12 &&
    form.uri.trim().length > 0;

  const createDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error("Connect your wallet first.");
      }

      if (chainId !== CHAIN.id) {
        throw new Error("Switch your wallet to Braga before creating a document.");
      }

      if (!walletClient) {
        throw new Error("Wallet client not ready yet. Reconnect and try again.");
      }

      if (!selectedRoom) {
        throw new Error("Choose a room first.");
      }

      const provider = await connector?.getProvider();
      if (!provider) {
        throw new Error("Connected wallet provider not available.");
      }

      return createDocumentWithWallet({
        walletClient,
        owner: address,
        provider,
        values: {
          ...form,
          roomId: selectedRoom.roomId,
        },
      });
    },
    onSuccess() {
      toast.success("Document created on Arkiv Braga.");
      setForm((current) => ({
        ...initialFormState,
        roomKey: current.roomKey,
      }));
      queryClient.invalidateQueries({ queryKey: ["project-documents"] });
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
              Step 2
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Add a document to that room
            </h2>
          </div>
          <FilePlus2 className="h-8 w-8 text-[var(--color-gold)]" />
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[rgba(240,191,99,0.16)] bg-[rgba(240,191,99,0.08)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.76)]">
          This step becomes useful after Step 1. Pick an existing room, then attach one sensitive
          record to it.
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            createDocumentMutation.mutate();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Room</span>
            <select
              value={form.roomKey}
              onChange={(event) => setForm((current) => ({ ...current, roomKey: event.target.value }))}
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

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Document title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Q2 revenue memo"
              className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-sand)]">Summary</span>
            <textarea
              value={form.summary}
              onChange={(event) =>
                setForm((current) => ({ ...current, summary: event.target.value }))
              }
              placeholder="Summarize what the recipient should know before opening the file."
              rows={4}
              className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Document URI</span>
              <input
                value={form.uri}
                onChange={(event) => setForm((current) => ({ ...current, uri: event.target.value }))}
                placeholder="https://..."
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition placeholder:text-[rgba(244,236,215,0.34)] focus:border-[rgba(143,242,195,0.4)]"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-sand)]">Access tier</span>
              <select
                value={form.accessTier}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    accessTier: event.target.value as FormState["accessTier"],
                  }))
                }
                className="w-full rounded-[1rem] border border-[var(--color-border)] bg-[#081111] px-4 py-3 text-sm text-[var(--color-sand)] outline-none transition focus:border-[rgba(143,242,195,0.4)]"
              >
                <option value="view">view</option>
                <option value="review">review</option>
                <option value="download">download</option>
              </select>
            </label>
          </div>

          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-6 text-[rgba(244,236,215,0.72)]">
            {isConnected
              ? `Document creator: ${formatAddress(address)}`
              : "Connect a wallet first so the document can be stored by its owner."}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || createDocumentMutation.isPending}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 py-3 text-sm font-semibold text-[#1d1404] transition hover:translate-y-[-1px]",
              (!canSubmit || createDocumentMutation.isPending) && "cursor-not-allowed opacity-80",
            )}
          >
            {createDocumentMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <FilePlus2 className="h-4 w-4" />
            )}
            Create document on Braga
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[rgba(244,236,215,0.54)]">
              Step 2 result
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--color-sand)]">
              Document entities fetched back from Arkiv
            </h2>
          </div>
          <button
            type="button"
            onClick={() => documentsQuery.refetch()}
            disabled={documentsQuery.isFetching}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-sand)] transition hover:border-[rgba(244,236,215,0.24)] disabled:cursor-wait disabled:opacity-75"
          >
            <RefreshCw className={cn("h-4 w-4", documentsQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {documentsQuery.isLoading ? (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm text-[rgba(244,236,215,0.72)]">
              Loading project-scoped documents from Arkiv...
            </div>
          ) : documentsQuery.isError ? (
            <div className="rounded-[1.35rem] border border-[rgba(244,132,111,0.18)] bg-[rgba(244,132,111,0.08)] p-5 text-sm text-[rgba(244,236,215,0.78)]">
              Could not fetch documents from Braga right now. The project-scoped query is ready, but the RPC did not respond cleanly.
            </div>
          ) : documentsQuery.data && documentsQuery.data.length > 0 ? (
            documentsQuery.data.map((document) => (
              <article
                key={document.key}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgba(244,236,215,0.46)]">
                      {document.roomId}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[var(--color-sand)]">
                      {document.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
                      {document.summary}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[rgba(240,191,99,0.18)] bg-[rgba(240,191,99,0.08)] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">
                    {document.accessTier}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Owner
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-sand)]">
                      {formatAddress(document.owner)}
                    </p>
                  </div>
                  <div className="rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                      Room key
                    </p>
                    <p className="mt-2 truncate font-mono text-xs text-[var(--color-sand)]">{document.roomKey}</p>
                  </div>
                </div>
                <div className="mt-3 rounded-[1rem] border border-[var(--color-border)] bg-[#081111] p-3">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-[rgba(244,236,215,0.46)]">
                    URI
                  </p>
                  <p className="mt-2 truncate font-mono text-xs text-[var(--color-sand)]">{document.uri}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] p-5 text-sm leading-7 text-[rgba(244,236,215,0.72)]">
              No live documents found for this project yet. Create a room, attach a document, and then
              refresh this panel.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
