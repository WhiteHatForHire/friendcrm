import type { SupabaseClient } from "@supabase/supabase-js";

import type { CrmData, Interaction, Memory, NextMove, OpenLoop, Person, RelationshipNote } from "../types";

type SupabaseRow = Record<string, unknown>;

export async function fetchSupabaseCrmData(client: SupabaseClient, ownerId: string): Promise<CrmData> {
  const [people, notes, memories, openLoops, nextMoves, interactions] = await Promise.all([
    selectRows(client, "people", ownerId),
    selectRows(client, "relationship_notes", ownerId),
    selectRows(client, "memories", ownerId),
    selectRows(client, "open_loops", ownerId),
    selectRows(client, "next_moves", ownerId),
    selectRows(client, "interactions", ownerId)
  ]);

  return {
    people: people.map(rowToPerson),
    notes: notes.map(rowToNote),
    memories: memories.map(rowToMemory),
    openLoops: openLoops.map(rowToOpenLoop),
    nextMoves: nextMoves.map(rowToNextMove),
    interactions: interactions.map(rowToInteraction)
  };
}

export async function pushSupabaseCrmData(client: SupabaseClient, ownerId: string, data: CrmData) {
  const safeData = prepareCrmDataForHostedSync(data);

  await Promise.all([
    upsertRows(client, "people", safeData.people.map((person) => personToRow(ownerId, person))),
    upsertRows(client, "relationship_notes", safeData.notes.map((note) => noteToRow(ownerId, note))),
    upsertRows(client, "memories", safeData.memories.map((memory) => memoryToRow(ownerId, memory))),
    upsertRows(client, "open_loops", safeData.openLoops.map((loop) => openLoopToRow(ownerId, loop))),
    upsertRows(client, "next_moves", safeData.nextMoves.map((move) => nextMoveToRow(ownerId, move))),
    upsertRows(client, "interactions", safeData.interactions.map((interaction) => interactionToRow(ownerId, interaction)))
  ]);
}

export function prepareCrmDataForHostedSync(data: CrmData): CrmData {
  return {
    ...data,
    memories: data.memories.filter((memory) => memory.confirmed)
  };
}

async function selectRows(client: SupabaseClient, table: string, ownerId: string) {
  const { data, error } = await client
    .from(table)
    .select("*")
    .eq("owner_id", ownerId)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SupabaseRow[];
}

async function upsertRows(client: SupabaseClient, table: string, rows: SupabaseRow[]) {
  if (!rows.length) return;
  const { error } = await client.from(table).upsert(rows, { onConflict: "owner_id,local_id" });
  if (error) throw error;
}

function personToRow(ownerId: string, person: Person): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: person.id,
    name: person.name,
    aliases: person.aliases,
    relationship_types: person.relationshipTypes,
    city: person.city,
    timezone: person.timezone,
    contact_methods: person.contactMethods,
    profile_photo_url: person.profilePhotoUrl,
    importance: person.importance,
    warmth: person.warmth,
    trust: person.trust,
    strategic_relevance: person.strategicRelevance,
    sensitivity: person.sensitivity,
    last_contact_at: person.lastContactAt,
    next_contact_at: person.nextContactAt,
    summary: person.summary,
    created_at: person.createdAt,
    updated_at: person.updatedAt
  };
}

function noteToRow(ownerId: string, note: RelationshipNote): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: note.id,
    local_person_ids: note.personIds,
    occurred_at: note.occurredAt,
    source_type: note.sourceType,
    raw_text: note.rawText,
    sensitivity: note.sensitivity,
    created_at: note.createdAt
  };
}

function memoryToRow(ownerId: string, memory: Memory): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: memory.id,
    local_person_id: memory.personId,
    local_source_note_id: memory.sourceNoteId,
    text: memory.text,
    category: memory.category,
    confidence: memory.confidence,
    sensitivity: memory.sensitivity,
    confirmed: memory.confirmed
  };
}

function openLoopToRow(ownerId: string, loop: OpenLoop): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: loop.id,
    local_person_id: loop.personId,
    local_source_note_id: loop.sourceNoteId,
    title: loop.title,
    description: loop.description,
    due_at: loop.dueAt,
    sensitivity: loop.sensitivity,
    status: loop.status
  };
}

function nextMoveToRow(ownerId: string, move: NextMove): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: move.id,
    local_person_id: move.personId,
    type: move.type,
    draft: move.draft,
    rationale: move.rationale,
    risk: move.risk,
    status: move.status
  };
}

function interactionToRow(ownerId: string, interaction: Interaction): SupabaseRow {
  return {
    owner_id: ownerId,
    local_id: interaction.id,
    local_person_ids: interaction.personIds,
    date: interaction.date,
    channel: interaction.channel,
    summary: interaction.summary,
    emotional_read: interaction.emotionalRead,
    follow_ups: interaction.followUps,
    reflection: interaction.reflection
  };
}

function rowToPerson(row: SupabaseRow): Person {
  return {
    id: asString(row.local_id, row.id),
    name: asString(row.name),
    aliases: asStringArray(row.aliases),
    relationshipTypes: asStringArray(row.relationship_types) as Person["relationshipTypes"],
    city: optionalString(row.city),
    timezone: optionalString(row.timezone),
    contactMethods: Array.isArray(row.contact_methods) ? (row.contact_methods as Person["contactMethods"]) : [],
    profilePhotoUrl: optionalString(row.profile_photo_url),
    importance: asRating(row.importance),
    warmth: asString(row.warmth, "neutral") as Person["warmth"],
    trust: asRating(row.trust),
    strategicRelevance: asRating(row.strategic_relevance),
    sensitivity: asString(row.sensitivity, "normal") as Person["sensitivity"],
    lastContactAt: optionalString(row.last_contact_at),
    nextContactAt: optionalString(row.next_contact_at),
    summary: optionalString(row.summary),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at)
  };
}

function rowToNote(row: SupabaseRow): RelationshipNote {
  return {
    id: asString(row.local_id, row.id),
    personIds: asStringArray(row.local_person_ids),
    occurredAt: asString(row.occurred_at),
    sourceType: asString(row.source_type, "manual") as RelationshipNote["sourceType"],
    rawText: asString(row.raw_text),
    sensitivity: asString(row.sensitivity, "normal") as RelationshipNote["sensitivity"],
    createdAt: asString(row.created_at)
  };
}

function rowToMemory(row: SupabaseRow): Memory {
  return {
    id: asString(row.local_id, row.id),
    personId: asString(row.local_person_id, row.person_id),
    sourceNoteId: asString(row.local_source_note_id, row.source_note_id),
    text: asString(row.text),
    category: asString(row.category, "other") as Memory["category"],
    confidence: asString(row.confidence, "medium") as Memory["confidence"],
    sensitivity: asString(row.sensitivity, "normal") as Memory["sensitivity"],
    confirmed: Boolean(row.confirmed)
  };
}

function rowToOpenLoop(row: SupabaseRow): OpenLoop {
  return {
    id: asString(row.local_id, row.id),
    personId: asString(row.local_person_id, row.person_id),
    sourceNoteId: optionalString(row.local_source_note_id) ?? optionalString(row.source_note_id),
    title: asString(row.title),
    description: optionalString(row.description),
    dueAt: optionalString(row.due_at),
    sensitivity: asString(row.sensitivity, "normal") as OpenLoop["sensitivity"],
    status: asString(row.status, "open") as OpenLoop["status"]
  };
}

function rowToNextMove(row: SupabaseRow): NextMove {
  return {
    id: asString(row.local_id, row.id),
    personId: asString(row.local_person_id, row.person_id),
    type: asString(row.type, "message") as NextMove["type"],
    draft: asString(row.draft),
    rationale: asString(row.rationale),
    risk: asString(row.risk, "medium") as NextMove["risk"],
    status: asString(row.status, "idea") as NextMove["status"]
  };
}

function rowToInteraction(row: SupabaseRow): Interaction {
  return {
    id: asString(row.local_id, row.id),
    personIds: asStringArray(row.local_person_ids),
    date: asString(row.date),
    channel: asString(row.channel),
    summary: asString(row.summary),
    emotionalRead: asString(row.emotional_read),
    followUps: asString(row.follow_ups),
    reflection: asString(row.reflection)
  };
}

function asString(value: unknown, fallback: unknown = "") {
  if (typeof value === "string") return value;
  if (typeof fallback === "string") return fallback;
  return "";
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asRating(value: unknown): 1 | 2 | 3 | 4 | 5 {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5 ? value : 3;
}
