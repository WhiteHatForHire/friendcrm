import type { Memory, NextMove, Sensitivity } from "../types";
import type { ExtractorValidationError } from "./aiExtractorSchema";

export type GenerateBriefRequest = {
  person: {
    id: string;
    name: string;
    relationshipTypes: string[];
    city?: string;
    summary?: string;
    sensitivity: Sensitivity;
  };
  memories: Array<Pick<Memory, "text" | "category" | "confidence" | "sensitivity">>;
  openLoops: Array<{
    title: string;
    description?: string;
    dueAt?: string;
    status: string;
  }>;
  recentNotes: Array<{
    occurredAt: string;
    sourceType: string;
    rawText: string;
    sensitivity: Sensitivity;
  }>;
  nextMoves: Array<Pick<NextMove, "type" | "draft" | "rationale" | "risk" | "status">>;
};

export type GenerateBriefResponse = {
  snapshot: string;
  remember: string[];
  openLoops: string[];
  avoid: string[];
  goodNextMove: string;
  sensitivityWarning?: string;
};

export type GenerateNextMovesRequest = {
  person: GenerateBriefRequest["person"];
  objective: string;
  context: Pick<GenerateBriefRequest, "memories" | "openLoops" | "recentNotes">;
};

export type GeneratedNextMove = Pick<NextMove, "type" | "draft" | "rationale" | "risk"> & {
  riskReason: string;
};

export type GenerateNextMovesResponse = {
  moves: GeneratedNextMove[];
  sensitivityWarning?: string;
};

export type GenerationValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ExtractorValidationError[] };

export type GenerationRequestValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: ExtractorValidationError[] };

const moveTypes: Array<NextMove["type"]> = [
  "message",
  "invite",
  "intro",
  "apology",
  "ask",
  "support",
  "check_in",
  "collaboration"
];
const risks: Array<NextMove["risk"]> = ["low", "medium", "high"];
const riskyInstructionPattern =
  /\b(auto(?:matically)? send|send without|scrape|coerce|manipulate|stalk|threaten|evade consent|bypass consent|surveillance)\b/i;

const memoryCategories: Array<Memory["category"]> = [
  "preference",
  "life_context",
  "boundary",
  "history",
  "interest",
  "risk",
  "other"
];
const confidenceValues: Array<Memory["confidence"]> = ["low", "medium", "high"];
const sensitivityValues: Sensitivity[] = ["normal", "sensitive", "private"];
const nextMoveStatuses: Array<NextMove["status"]> = ["idea", "queued", "done", "dismissed"];

export function validateGenerateBriefRequest(value: unknown): GenerationRequestValidationResult<GenerateBriefRequest> {
  const errors: ExtractorValidationError[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: "$", message: "Request must be an object." }] };
  }

  validateMinimalPerson(value.person, "$.person", errors);
  requireArray(value.memories, "$.memories", errors);
  requireArray(value.openLoops, "$.openLoops", errors);
  requireArray(value.recentNotes, "$.recentNotes", errors);
  requireArray(value.nextMoves, "$.nextMoves", errors);

  if (Array.isArray(value.memories)) {
    value.memories.forEach((memory, index) => validateMemoryContext(memory, `$.memories[${index}]`, errors));
  }

  if (Array.isArray(value.openLoops)) {
    value.openLoops.forEach((loop, index) => validateOpenLoopContext(loop, `$.openLoops[${index}]`, errors));
  }

  if (Array.isArray(value.recentNotes)) {
    value.recentNotes.forEach((note, index) => validateRecentNoteContext(note, `$.recentNotes[${index}]`, errors));
  }

  if (Array.isArray(value.nextMoves)) {
    value.nextMoves.forEach((move, index) => validateNextMoveContext(move, `$.nextMoves[${index}]`, errors));
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as GenerateBriefRequest };
}

export function validateGenerateNextMovesRequest(
  value: unknown
): GenerationRequestValidationResult<GenerateNextMovesRequest> {
  const errors: ExtractorValidationError[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: "$", message: "Request must be an object." }] };
  }

  validateMinimalPerson(value.person, "$.person", errors);
  requireNonEmptyString(value.objective, "$.objective", errors);

  if (!isRecord(value.context)) {
    errors.push({ path: "$.context", message: "Context must be an object." });
  } else {
    requireArray(value.context.memories, "$.context.memories", errors);
    requireArray(value.context.openLoops, "$.context.openLoops", errors);
    requireArray(value.context.recentNotes, "$.context.recentNotes", errors);

    if (Array.isArray(value.context.memories)) {
      value.context.memories.forEach((memory, index) =>
        validateMemoryContext(memory, `$.context.memories[${index}]`, errors)
      );
    }

    if (Array.isArray(value.context.openLoops)) {
      value.context.openLoops.forEach((loop, index) =>
        validateOpenLoopContext(loop, `$.context.openLoops[${index}]`, errors)
      );
    }

    if (Array.isArray(value.context.recentNotes)) {
      value.context.recentNotes.forEach((note, index) =>
        validateRecentNoteContext(note, `$.context.recentNotes[${index}]`, errors)
      );
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as GenerateNextMovesRequest };
}

export function validateGenerateBriefResponse(value: unknown): GenerationValidationResult<GenerateBriefResponse> {
  const errors: ExtractorValidationError[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: "$", message: "Response must be an object." }] };
  }

  requireNonEmptyString(value.snapshot, "$.snapshot", errors);
  requireStringArray(value.remember, "$.remember", errors);
  requireStringArray(value.openLoops, "$.openLoops", errors);
  requireStringArray(value.avoid, "$.avoid", errors);
  requireNonEmptyString(value.goodNextMove, "$.goodNextMove", errors);
  requireOptionalString(value.sensitivityWarning, "$.sensitivityWarning", errors);
  scanForRiskyInstructions(value, "$", errors);

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as GenerateBriefResponse };
}

export function validateGenerateNextMovesResponse(value: unknown): GenerationValidationResult<GenerateNextMovesResponse> {
  const errors: ExtractorValidationError[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: "$", message: "Response must be an object." }] };
  }

  requireArray(value.moves, "$.moves", errors);
  if (Array.isArray(value.moves)) {
    value.moves.forEach((move, index) => validateGeneratedMove(move, `$.moves[${index}]`, errors));
  }
  requireOptionalString(value.sensitivityWarning, "$.sensitivityWarning", errors);
  scanForRiskyInstructions(value, "$", errors);

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as GenerateNextMovesResponse };
}

function validateMinimalPerson(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Person must be an object." });
    return;
  }

  requireNonEmptyString(value.id, `${path}.id`, errors);
  requireNonEmptyString(value.name, `${path}.name`, errors);
  requireStringArray(value.relationshipTypes, `${path}.relationshipTypes`, errors);
  requireOptionalString(value.city, `${path}.city`, errors);
  requireOptionalString(value.summary, `${path}.summary`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);
}

function validateMemoryContext(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Memory context must be an object." });
    return;
  }

  requireNonEmptyString(value.text, `${path}.text`, errors);
  validateEnum(value.category, memoryCategories, `${path}.category`, errors);
  validateEnum(value.confidence, confidenceValues, `${path}.confidence`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);
}

function validateOpenLoopContext(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Open loop context must be an object." });
    return;
  }

  requireNonEmptyString(value.title, `${path}.title`, errors);
  requireOptionalString(value.description, `${path}.description`, errors);
  requireOptionalIsoDate(value.dueAt, `${path}.dueAt`, errors);
  requireNonEmptyString(value.status, `${path}.status`, errors);
}

function validateRecentNoteContext(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Recent note context must be an object." });
    return;
  }

  requireOptionalIsoDate(value.occurredAt, `${path}.occurredAt`, errors);
  requireNonEmptyString(value.sourceType, `${path}.sourceType`, errors);
  requireNonEmptyString(value.rawText, `${path}.rawText`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);
}

function validateNextMoveContext(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Next move context must be an object." });
    return;
  }

  validateEnum(value.type, moveTypes, `${path}.type`, errors);
  requireNonEmptyString(value.draft, `${path}.draft`, errors);
  requireNonEmptyString(value.rationale, `${path}.rationale`, errors);
  validateEnum(value.risk, risks, `${path}.risk`, errors);
  validateEnum(value.status, nextMoveStatuses, `${path}.status`, errors);
}

function validateGeneratedMove(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Move must be an object." });
    return;
  }

  validateEnum(value.type, moveTypes, `${path}.type`, errors);
  requireNonEmptyString(value.draft, `${path}.draft`, errors);
  requireNonEmptyString(value.rationale, `${path}.rationale`, errors);
  validateEnum(value.risk, risks, `${path}.risk`, errors);
  requireNonEmptyString(value.riskReason, `${path}.riskReason`, errors);
}

function requireStringArray(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Value must be an array." });
    return;
  }

  value.forEach((item, index) => requireNonEmptyString(item, `${path}[${index}]`, errors));
}

function requireArray(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!Array.isArray(value)) {
    errors.push({ path, message: "Value must be an array." });
  }
}

function validateEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  errors: ExtractorValidationError[]
) {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    errors.push({ path, message: `Value must be one of: ${allowed.join(", ")}.` });
  }
}

function requireNonEmptyString(value: unknown, path: string, errors: ExtractorValidationError[]): value is string {
  if (typeof value !== "string") {
    errors.push({ path, message: "Value must be a string." });
    return false;
  }
  if (value.trim().length === 0) {
    errors.push({ path, message: "Value must not be empty." });
    return false;
  }
  return true;
}

function requireOptionalIsoDate(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (value === undefined) return;
  if (!requireNonEmptyString(value, path, errors)) return;
  if (!isIsoDate(value)) {
    errors.push({ path, message: "Date must use YYYY-MM-DD format." });
  }
}

function requireOptionalString(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (value !== undefined && typeof value !== "string") {
    errors.push({ path, message: "Value must be a string when present." });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function scanForRiskyInstructions(
  value: unknown,
  path: string,
  errors: ExtractorValidationError[],
  seen = new Set<unknown>()
) {
  if (typeof value === "string") {
    if (riskyInstructionPattern.test(value)) {
      errors.push({ path, message: "Output includes a disallowed risky instruction." });
    }
    return;
  }

  if (typeof value !== "object" || value === null || seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForRiskyInstructions(item, `${path}[${index}]`, errors, seen));
    return;
  }

  Object.entries(value).forEach(([key, item]) => {
    scanForRiskyInstructions(item, `${path}.${key}`, errors, seen);
  });
}
