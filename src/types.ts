export type RelationshipType =
  | "friend"
  | "collaborator"
  | "mentor"
  | "client"
  | "family"
  | "romantic"
  | "ex"
  | "weak_tie"
  | "community"
  | "other";

export type Warmth = "cold" | "cool" | "neutral" | "warm" | "hot";
export type Sensitivity = "normal" | "sensitive" | "private";

export type ContactMethod = {
  type: "phone" | "email" | "instagram" | "twitter" | "signal" | "whatsapp" | "other";
  value: string;
};

export type Person = {
  id: string;
  name: string;
  aliases: string[];
  relationshipTypes: RelationshipType[];
  city?: string;
  timezone?: string;
  contactMethods: ContactMethod[];
  importance: 1 | 2 | 3 | 4 | 5;
  warmth: Warmth;
  trust: 1 | 2 | 3 | 4 | 5;
  strategicRelevance: 1 | 2 | 3 | 4 | 5;
  sensitivity: Sensitivity;
  lastContactAt?: string;
  nextContactAt?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

export type RelationshipNote = {
  id: string;
  personIds: string[];
  occurredAt: string;
  sourceType: "manual" | "call" | "dinner" | "meeting" | "text_summary" | "memory";
  rawText: string;
  sensitivity: Sensitivity;
  createdAt: string;
};

export type Memory = {
  id: string;
  personId: string;
  sourceNoteId: string;
  text: string;
  category: "preference" | "life_context" | "boundary" | "history" | "interest" | "risk" | "other";
  confidence: "low" | "medium" | "high";
  sensitivity: Sensitivity;
  confirmed: boolean;
};

export type OpenLoop = {
  id: string;
  personId: string;
  sourceNoteId?: string;
  title: string;
  description?: string;
  dueAt?: string;
  status: "open" | "planned" | "done" | "dropped";
};

export type NextMove = {
  id: string;
  personId: string;
  type: "message" | "invite" | "intro" | "apology" | "ask" | "support" | "check_in" | "collaboration";
  draft: string;
  rationale: string;
  risk: "low" | "medium" | "high";
  status: "idea" | "queued" | "done" | "dismissed";
};

export type Interaction = {
  id: string;
  personIds: string[];
  date: string;
  channel: string;
  summary: string;
  emotionalRead: string;
  followUps: string;
  reflection: string;
};

export type CrmData = {
  people: Person[];
  notes: RelationshipNote[];
  memories: Memory[];
  openLoops: OpenLoop[];
  nextMoves: NextMove[];
  interactions: Interaction[];
};

export type ExtractionSuggestion = {
  id: string;
  kind: "memory" | "openLoop";
  personId: string;
  title: string;
  body: string;
  basis: string;
  sensitivity: Sensitivity;
  category?: Memory["category"];
  dueAt?: string;
  confidence?: Memory["confidence"];
};
