import { create } from "zustand";
import { ENTITY_TYPES, PROJECT_ATTRIBUTE, type EntityType } from "@/lib/constants";

type Panel = "rooms" | "queries" | "flow";

type ChecklistItem = {
  label: string;
  copy: string;
  status: "ready" | "next";
};

type DemoStep = {
  title: string;
  copy: string;
};

type EntityBlueprint = {
  entityType: EntityType;
  title: string;
  copy: string;
  attributes: string[];
};

type PreviewRoom = {
  id: string;
  name: string;
  description: string;
  sensitivity: "strict" | "internal" | "shared";
  documents: number;
  grants: number;
  owner: string;
};

type Highlight = {
  label: string;
  value: string;
  copy: string;
};

type ArkivRoomState = {
  activePanel: Panel;
  checklist: ChecklistItem[];
  demoFlow: DemoStep[];
  entityBlueprints: EntityBlueprint[];
  projectHighlights: Highlight[];
  projectAttribute: string;
  rooms: PreviewRoom[];
  setActivePanel: (panel: Panel) => void;
};

export const useArkivRoomStore = create<ArkivRoomState>((set) => ({
  activePanel: "rooms",
  checklist: [
    {
      label: "Unique project scoping",
      copy: "The starter exposes one project attribute and uses it in both entity builders and query helpers.",
      status: "ready",
    },
    {
      label: "Three entity types",
      copy: "Room, Document, and Grant give us a clear architecture judges can understand instantly.",
      status: "ready",
    },
    {
      label: "Wallet and Braga setup",
      copy: "Injected-wallet connection is live and the write helpers are wired to Arkiv Braga.",
      status: "ready",
    },
    {
      label: "Live create + readback flow",
      copy: "Rooms, documents, and grants can now be created from the UI and fetched back through project-scoped Arkiv queries.",
      status: "ready",
    },
  ],
  demoFlow: [
    {
      title: "Create a private room",
      copy: "Owner names a room like Investor DD or Medical Archive and stores the payload with the Arkiv project scope.",
    },
    {
      title: "Attach sensitive records",
      copy: "Documents inherit the same project signature plus their room relationship, owner, and access tier.",
    },
    {
      title: "Grant wallet-based access",
      copy: "A Grant entity links a recipient wallet to a room or document with permission and expiry metadata.",
    },
    {
      title: "Query the exact project slice",
      copy: "Reviewers can see that every fetch starts with the same project attribute instead of mixing global data.",
    },
  ],
  entityBlueprints: [
    {
      entityType: ENTITY_TYPES.room,
      title: "Room",
      copy: "Container for a confidential workspace with owner, sensitivity, and the long-lived identity we anchor later documents and grants to.",
      attributes: ["project", "entity_type", "room_id", "owner", "sensitivity"],
    },
    {
      entityType: ENTITY_TYPES.document,
      title: "Document",
      copy: "Stores title, summary, URI, and access tier for one file or record that belongs to a room.",
      attributes: ["project", "entity_type", "room_id", "document_id", "owner", "access_tier"],
    },
    {
      entityType: ENTITY_TYPES.grant,
      title: "Grant",
      copy: "Captures who can access which room or document, with permission and expiry tracked in the payload and attributes.",
      attributes: ["project", "entity_type", "room_id", "document_id", "recipient", "permission"],
    },
  ],
  projectHighlights: [
    {
      label: "Theme",
      value: "Privacy",
      copy: "Direct fit for the user-owned data angle in the challenge brief.",
    },
    {
      label: "Chain",
      value: "Braga testnet",
      copy: "Uses the official Arkiv Braga chain export and RPC defaults from the SDK.",
    },
    {
      label: "Scope",
      value: PROJECT_ATTRIBUTE,
      copy: "One identifier ties every entity write and every fetch back to ArkivRoom.",
    },
  ],
  projectAttribute: PROJECT_ATTRIBUTE,
  rooms: [
    {
      id: "room-investor-dd",
      name: "Investor DD",
      description: "A private room for diligence files, founder financials, and legal notes shared with a shortlist of wallets.",
      sensitivity: "strict",
      documents: 2,
      grants: 1,
      owner: "0x6186B0DbA9652262942d5A465d49686eb560834C",
    },
    {
      id: "room-medical-archive",
      name: "Medical Archive",
      description: "Health records with room-wide grants for a care provider wallet and document-level access for specialists.",
      sensitivity: "internal",
      documents: 3,
      grants: 2,
      owner: "0xA892c9045B1474d6fB38BcE6520fA1D50354319b",
    },
  ],
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
