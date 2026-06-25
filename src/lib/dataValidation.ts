import type { CrmData } from "../types";

export type DataValidationResult = { ok: true; value: CrmData } | { ok: false; errors: string[] };
export type CrmDataExportEnvelope = {
  schemaVersion: 1;
  exportedAt: string;
  app: "friend-crm";
  data: CrmData;
};
export type NormalizedCrmDataExportResult =
  | {
      ok: true;
      value: CrmData;
      envelope: CrmDataExportEnvelope;
      sourceVersion: 1 | "unversioned";
    }
  | { ok: false; errors: string[] };

export const CURRENT_CRM_SCHEMA_VERSION = 1;
export const SUPPORTED_CRM_SCHEMA_VERSIONS = [1] as const;

type ExportEnvelopeCandidate = {
  schemaVersion: number;
  exportedAt?: unknown;
  app: "friend-crm";
  data: unknown;
};

type CrmDataMigration = (envelope: ExportEnvelopeCandidate) => NormalizedCrmDataExportResult;

const crmDataMigrations: Record<(typeof SUPPORTED_CRM_SCHEMA_VERSIONS)[number], CrmDataMigration> = {
  1: migrateSchemaVersionOne
};

const relationshipTypes = [
  "friend",
  "collaborator",
  "mentor",
  "client",
  "family",
  "romantic",
  "ex",
  "weak_tie",
  "community",
  "other"
];
const contactMethodTypes = ["phone", "email", "instagram", "twitter", "x", "linkedin", "website", "signal", "whatsapp", "other"];
const warmthValues = ["cold", "cool", "neutral", "warm", "hot"];
const sensitivityValues = ["normal", "sensitive", "private"];
const sourceTypes = ["manual", "call", "dinner", "meeting", "text_summary", "memory"];
const memoryCategories = ["preference", "life_context", "boundary", "history", "interest", "risk", "other"];
const confidenceValues = ["low", "medium", "high"];
const loopStatuses = ["open", "planned", "done", "dropped"];
const moveTypes = ["message", "invite", "intro", "apology", "ask", "support", "check_in", "collaboration"];
const moveRisks = ["low", "medium", "high"];
const moveStatuses = ["idea", "queued", "done", "dismissed"];

export function validateCrmData(value: unknown): DataValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ["Data must be an object."] };
  }

  const data = value as Partial<Record<keyof CrmData, unknown>>;
  requireArray(data.people, "people", errors);
  requireArray(data.notes, "notes", errors);
  requireArray(data.memories, "memories", errors);
  requireArray(data.openLoops, "openLoops", errors);
  requireArray(data.nextMoves, "nextMoves", errors);
  requireArray(data.interactions, "interactions", errors);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const personIds = new Set<string>();
  const noteIds = new Set<string>();

  validatePeople(data.people as unknown[], personIds, errors);
  validateNotes(data.notes as unknown[], personIds, noteIds, errors);
  validateMemories(data.memories as unknown[], personIds, noteIds, errors);
  validateOpenLoops(data.openLoops as unknown[], personIds, noteIds, errors);
  validateNextMoves(data.nextMoves as unknown[], personIds, errors);
  validateInteractions(data.interactions as unknown[], personIds, errors);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: value as CrmData };
}

export function parseCrmDataJson(json: string): DataValidationResult {
  try {
    return parseCrmDataExport(JSON.parse(json));
  } catch {
    return { ok: false, errors: ["Import must be valid JSON."] };
  }
}

export function parseCrmDataExport(value: unknown): DataValidationResult {
  const normalized = normalizeCrmDataExport(value);
  if (!normalized.ok) return normalized;

  return { ok: true, value: normalized.value };
}

export function normalizeCrmDataExport(
  value: unknown,
  exportedAt = new Date().toISOString()
): NormalizedCrmDataExportResult {
  if (isExportEnvelope(value)) {
    const migration = crmDataMigrations[value.schemaVersion as (typeof SUPPORTED_CRM_SCHEMA_VERSIONS)[number]];
    if (!migration) {
      return { ok: false, errors: [`Unsupported Friend CRM schema version: ${value.schemaVersion}.`] };
    }
    return migration(value);
  }

  const rawResult = validateCrmData(value);
  if (!rawResult.ok) return rawResult;

  return {
    ok: true,
    value: rawResult.value,
    envelope: createCrmDataExport(rawResult.value, exportedAt),
    sourceVersion: "unversioned"
  };
}

export function createCrmDataExport(data: CrmData, exportedAt = new Date().toISOString()): CrmDataExportEnvelope {
  return {
    schemaVersion: CURRENT_CRM_SCHEMA_VERSION,
    exportedAt,
    app: "friend-crm",
    data
  };
}

export function summarizeCrmData(data: CrmData) {
  const sensitivePeople = data.people.filter((person) => person.sensitivity !== "normal").length;
  const sensitiveNotes = data.notes.filter((note) => note.sensitivity !== "normal").length;
  const sensitiveMemories = data.memories.filter((memory) => memory.sensitivity !== "normal").length;
  const sensitiveOpenLoops = data.openLoops.filter((loop) => loop.sensitivity !== "normal").length;
  const noteDates = data.notes.map((note) => note.occurredAt).sort();

  return {
    people: data.people.length,
    notes: data.notes.length,
    memories: data.memories.length,
    openLoops: data.openLoops.length,
    nextMoves: data.nextMoves.length,
    interactions: data.interactions.length,
    privatePeople: data.people.filter((person) => person.sensitivity === "private").length,
    sensitivePeople,
    sensitiveNotes,
    sensitiveMemories,
    sensitiveOpenLoops,
    sensitiveOrPrivate: sensitivePeople + sensitiveNotes + sensitiveMemories + sensitiveOpenLoops,
    firstPeople: data.people.slice(0, 5).map((person) => person.name),
    oldestNoteDate: noteDates[0],
    newestNoteDate: noteDates[noteDates.length - 1]
  };
}

function migrateSchemaVersionOne(envelope: ExportEnvelopeCandidate): NormalizedCrmDataExportResult {
  const result = validateCrmData(envelope.data);
  if (!result.ok) return result;

  return {
    ok: true,
    value: result.value,
    envelope: {
      schemaVersion: 1,
      exportedAt: normalizeExportedAt(envelope.exportedAt),
      app: "friend-crm",
      data: result.value
    },
    sourceVersion: 1
  };
}

function normalizeExportedAt(value: unknown) {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return value;
  }
  return new Date().toISOString();
}

function validatePeople(values: unknown[], personIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((person, index) => {
    if (!isRecord(person)) {
      errors.push(`people[${index}] must be an object.`);
      return;
    }

    const id = requireString(person.id, `people[${index}].id`, errors);
    if (id) {
      trackUniqueId(id, `people[${index}].id`, seen, errors);
      personIds.add(id);
    }

    requireString(person.name, `people[${index}].name`, errors);
    requireEnumArray(person.relationshipTypes, relationshipTypes, `people[${index}].relationshipTypes`, errors);
    validateContactMethods(person.contactMethods, `people[${index}].contactMethods`, errors);
    requireOptionalString(person.profilePhotoUrl, `people[${index}].profilePhotoUrl`, errors);
    requireOptionalString(person.city, `people[${index}].city`, errors);
    requireOptionalString(person.timezone, `people[${index}].timezone`, errors);
    requireNumberRange(person.importance, 1, 5, `people[${index}].importance`, errors);
    requireEnum(person.warmth, warmthValues, `people[${index}].warmth`, errors);
    requireNumberRange(person.trust, 1, 5, `people[${index}].trust`, errors);
    requireNumberRange(person.strategicRelevance, 1, 5, `people[${index}].strategicRelevance`, errors);
    requireEnum(person.sensitivity, sensitivityValues, `people[${index}].sensitivity`, errors);
    requireOptionalDate(person.lastContactAt, `people[${index}].lastContactAt`, errors);
    requireOptionalDate(person.nextContactAt, `people[${index}].nextContactAt`, errors);
    requireOptionalString(person.summary, `people[${index}].summary`, errors);
    requireDateTime(person.createdAt, `people[${index}].createdAt`, errors);
    requireDateTime(person.updatedAt, `people[${index}].updatedAt`, errors);
  });
}

function validateContactMethods(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }

  value.forEach((method, index) => {
    if (!isRecord(method)) {
      errors.push(`${path}[${index}] must be an object.`);
      return;
    }
    requireEnum(method.type, contactMethodTypes, `${path}[${index}].type`, errors);
    requireString(method.value, `${path}[${index}].value`, errors);
  });
}

function validateNotes(values: unknown[], personIds: Set<string>, noteIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((note, index) => {
    if (!isRecord(note)) {
      errors.push(`notes[${index}] must be an object.`);
      return;
    }

    const id = requireString(note.id, `notes[${index}].id`, errors);
    if (id) {
      trackUniqueId(id, `notes[${index}].id`, seen, errors);
      noteIds.add(id);
    }

    requireReferenceArray(note.personIds, personIds, `notes[${index}].personIds`, errors);
    requireDate(note.occurredAt, `notes[${index}].occurredAt`, errors);
    requireEnum(note.sourceType, sourceTypes, `notes[${index}].sourceType`, errors);
    requireString(note.rawText, `notes[${index}].rawText`, errors);
    requireEnum(note.sensitivity, sensitivityValues, `notes[${index}].sensitivity`, errors);
    requireDateTime(note.createdAt, `notes[${index}].createdAt`, errors);
  });
}

function validateMemories(values: unknown[], personIds: Set<string>, noteIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((memory, index) => {
    if (!isRecord(memory)) {
      errors.push(`memories[${index}] must be an object.`);
      return;
    }

    const id = requireString(memory.id, `memories[${index}].id`, errors);
    if (id) trackUniqueId(id, `memories[${index}].id`, seen, errors);
    requireReference(memory.personId, personIds, `memories[${index}].personId`, errors);
    requireReference(memory.sourceNoteId, noteIds, `memories[${index}].sourceNoteId`, errors);
    requireString(memory.text, `memories[${index}].text`, errors);
    requireEnum(memory.category, memoryCategories, `memories[${index}].category`, errors);
    requireEnum(memory.confidence, confidenceValues, `memories[${index}].confidence`, errors);
    requireEnum(memory.sensitivity, sensitivityValues, `memories[${index}].sensitivity`, errors);
    requireBoolean(memory.confirmed, `memories[${index}].confirmed`, errors);
  });
}

function validateOpenLoops(values: unknown[], personIds: Set<string>, noteIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((loop, index) => {
    if (!isRecord(loop)) {
      errors.push(`openLoops[${index}] must be an object.`);
      return;
    }

    const id = requireString(loop.id, `openLoops[${index}].id`, errors);
    if (id) trackUniqueId(id, `openLoops[${index}].id`, seen, errors);
    requireReference(loop.personId, personIds, `openLoops[${index}].personId`, errors);
    requireOptionalReference(loop.sourceNoteId, noteIds, `openLoops[${index}].sourceNoteId`, errors);
    requireString(loop.title, `openLoops[${index}].title`, errors);
    requireOptionalString(loop.description, `openLoops[${index}].description`, errors);
    requireOptionalDate(loop.dueAt, `openLoops[${index}].dueAt`, errors);
    if (loop.sensitivity === undefined) {
      loop.sensitivity = "normal";
    }
    requireEnum(loop.sensitivity, sensitivityValues, `openLoops[${index}].sensitivity`, errors);
    requireEnum(loop.status, loopStatuses, `openLoops[${index}].status`, errors);
  });
}

function validateNextMoves(values: unknown[], personIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((move, index) => {
    if (!isRecord(move)) {
      errors.push(`nextMoves[${index}] must be an object.`);
      return;
    }

    const id = requireString(move.id, `nextMoves[${index}].id`, errors);
    if (id) trackUniqueId(id, `nextMoves[${index}].id`, seen, errors);
    requireReference(move.personId, personIds, `nextMoves[${index}].personId`, errors);
    requireEnum(move.type, moveTypes, `nextMoves[${index}].type`, errors);
    requireString(move.draft, `nextMoves[${index}].draft`, errors);
    requireString(move.rationale, `nextMoves[${index}].rationale`, errors);
    requireEnum(move.risk, moveRisks, `nextMoves[${index}].risk`, errors);
    requireEnum(move.status, moveStatuses, `nextMoves[${index}].status`, errors);
  });
}

function validateInteractions(values: unknown[], personIds: Set<string>, errors: string[]) {
  const seen = new Set<string>();

  values.forEach((interaction, index) => {
    if (!isRecord(interaction)) {
      errors.push(`interactions[${index}] must be an object.`);
      return;
    }

    const id = requireString(interaction.id, `interactions[${index}].id`, errors);
    if (id) trackUniqueId(id, `interactions[${index}].id`, seen, errors);
    requireReferenceArray(interaction.personIds, personIds, `interactions[${index}].personIds`, errors);
    requireDate(interaction.date, `interactions[${index}].date`, errors);
    requireString(interaction.channel, `interactions[${index}].channel`, errors);
    requireString(interaction.summary, `interactions[${index}].summary`, errors);
    requireString(interaction.emotionalRead, `interactions[${index}].emotionalRead`, errors);
    requireString(interaction.followUps, `interactions[${index}].followUps`, errors);
    requireString(interaction.reflection, `interactions[${index}].reflection`, errors);
  });
}

function trackUniqueId(id: string, path: string, seen: Set<string>, errors: string[]) {
  if (seen.has(id)) {
    errors.push(`${path} must be unique.`);
  }
  seen.add(id);
}

function requireReference(value: unknown, allowed: Set<string>, path: string, errors: string[]) {
  const id = requireString(value, path, errors);
  if (id && !allowed.has(id)) {
    errors.push(`${path} must reference an existing record.`);
  }
}

function requireOptionalReference(value: unknown, allowed: Set<string>, path: string, errors: string[]) {
  if (value === undefined) return;
  requireReference(value, allowed, path, errors);
}

function requireReferenceArray(value: unknown, allowed: Set<string>, path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }
  if (value.length === 0) {
    errors.push(`${path} must include at least one ID.`);
  }
  value.forEach((item, index) => {
    const id = requireString(item, `${path}[${index}]`, errors);
    if (id && !allowed.has(id)) {
      errors.push(`${path}[${index}] must reference an existing record.`);
    }
  });
}

function requireEnumArray(value: unknown, allowed: string[], path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
    return;
  }
  value.forEach((item, index) => requireEnum(item, allowed, `${path}[${index}]`, errors));
}

function requireArray(value: unknown, path: string, errors: string[]) {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array.`);
  }
}

function requireString(value: unknown, path: string, errors: string[]): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${path} must be a non-empty string.`);
    return undefined;
  }
  return value;
}

function requireOptionalString(value: unknown, path: string, errors: string[]) {
  if (value !== undefined && typeof value !== "string") {
    errors.push(`${path} must be a string when present.`);
  }
}

function requireEnum(value: unknown, allowed: string[], path: string, errors: string[]) {
  if (typeof value !== "string" || !allowed.includes(value)) {
    errors.push(`${path} must be one of: ${allowed.join(", ")}.`);
  }
}

function requireNumberRange(value: unknown, min: number, max: number, path: string, errors: string[]) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    errors.push(`${path} must be an integer from ${min} to ${max}.`);
  }
}

function requireBoolean(value: unknown, path: string, errors: string[]) {
  if (typeof value !== "boolean") {
    errors.push(`${path} must be a boolean.`);
  }
}

function requireDate(value: unknown, path: string, errors: string[]) {
  const date = requireString(value, path, errors);
  if (date && !isIsoDate(date)) {
    errors.push(`${path} must use YYYY-MM-DD format.`);
  }
}

function requireOptionalDate(value: unknown, path: string, errors: string[]) {
  if (value === undefined) return;
  requireDate(value, path, errors);
}

function requireDateTime(value: unknown, path: string, errors: string[]) {
  const date = requireString(value, path, errors);
  if (date && Number.isNaN(Date.parse(date))) {
    errors.push(`${path} must be a valid date/time string.`);
  }
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isExportEnvelope(value: unknown): value is ExportEnvelopeCandidate {
  return (
    isRecord(value) &&
    value.app === "friend-crm" &&
    typeof value.schemaVersion === "number" &&
    Number.isInteger(value.schemaVersion) &&
    "data" in value
  );
}
