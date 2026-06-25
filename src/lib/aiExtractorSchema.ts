import type { Memory, RelationshipNote, Sensitivity } from "../types";

export type ExtractMemoryRequest = {
  note: Pick<RelationshipNote, "id" | "personIds" | "occurredAt" | "sourceType" | "rawText" | "sensitivity">;
  people: Array<{
    id: string;
    name: string;
    aliases: string[];
    relationshipTypes: string[];
    city?: string;
    summary?: string;
    sensitivity: Sensitivity;
  }>;
};

export type ExtractMemoryResponse = {
  summary: string;
  suggestions: Array<ExtractMemorySuggestion>;
  dates: Array<ExtractedDate>;
  safetyFlags: Array<ExtractorSafetyFlag>;
};

export type ExtractMemorySuggestion = ExtractedMemorySuggestion | ExtractedOpenLoopSuggestion;

export type ExtractedMemorySuggestion = {
  kind: "memory";
  personId: string;
  text: string;
  category: Memory["category"];
  basis: string;
  confidence: Memory["confidence"];
  sensitivity: Sensitivity;
};

export type ExtractedOpenLoopSuggestion = {
  kind: "openLoop";
  personId: string;
  title: string;
  description?: string;
  dueAt?: string;
  basis: string;
  sensitivity: Sensitivity;
};

export type ExtractedDate = {
  label: string;
  date?: string;
  confidence: Memory["confidence"];
};

export type ExtractorSafetyFlag = {
  type: "sensitive" | "private" | "risky_suggestion";
  reason: string;
};

export type ExtractorValidationResult =
  | { ok: true; value: ExtractMemoryResponse }
  | { ok: false; errors: ExtractorValidationError[] };

export type ExtractorRequestValidationResult =
  | { ok: true; value: ExtractMemoryRequest }
  | { ok: false; errors: ExtractorValidationError[] };

export type ExtractorValidationError = {
  path: string;
  message: string;
};

const noteSourceTypes: Array<RelationshipNote["sourceType"]> = ["manual", "call", "dinner", "meeting", "text_summary", "memory"];
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
const safetyFlagTypes: ExtractorSafetyFlag["type"][] = ["sensitive", "private", "risky_suggestion"];
const riskyInstructionPattern =
  /\b(auto(?:matically)? send|send without|scrape|coerce|manipulate|stalk|threaten|evade consent|bypass consent|surveillance)\b/i;

export function validateExtractMemoryRequest(value: unknown): ExtractorRequestValidationResult {
  const errors: ExtractorValidationError[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: [{ path: "$", message: "Request must be an object." }] };
  }

  validateNoteRequest(value.note, "$.note", errors);
  requireArray(value.people, "$.people", errors);

  if (Array.isArray(value.people)) {
    value.people.forEach((person, index) => validatePersonContext(person, `$.people[${index}]`, errors));
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as ExtractMemoryRequest };
}

export function validateExtractMemoryResponse(
  value: unknown,
  knownPersonIds: Iterable<string>
): ExtractorValidationResult {
  const errors: ExtractorValidationError[] = [];
  const personIds = new Set(knownPersonIds);

  if (!isRecord(value)) {
    return {
      ok: false,
      errors: [{ path: "$", message: "Response must be an object." }]
    };
  }

  requireString(value.summary, "$.summary", errors);
  requireArray(value.suggestions, "$.suggestions", errors);
  requireArray(value.dates, "$.dates", errors);
  requireArray(value.safetyFlags, "$.safetyFlags", errors);

  if (Array.isArray(value.suggestions)) {
    value.suggestions.forEach((suggestion, index) => {
      validateSuggestion(suggestion, `$.suggestions[${index}]`, personIds, errors);
    });
  }

  if (Array.isArray(value.dates)) {
    value.dates.forEach((date, index) => {
      validateDate(date, `$.dates[${index}]`, errors);
    });
  }

  if (Array.isArray(value.safetyFlags)) {
    value.safetyFlags.forEach((flag, index) => {
      validateSafetyFlag(flag, `$.safetyFlags[${index}]`, errors);
    });
  }

  scanForRiskyInstructions(value, "$", errors);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: value as ExtractMemoryResponse };
}

export function parseAndValidateExtractMemoryResponse(
  json: string,
  knownPersonIds: Iterable<string>
): ExtractorValidationResult {
  try {
    return validateExtractMemoryResponse(JSON.parse(json), knownPersonIds);
  } catch {
    return {
      ok: false,
      errors: [{ path: "$", message: "Response must be valid JSON." }]
    };
  }
}

function validateNoteRequest(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Note must be an object." });
    return;
  }

  requireNonEmptyString(value.id, `${path}.id`, errors);
  requireStringArray(value.personIds, `${path}.personIds`, errors);
  validateOptionalIsoDate(value.occurredAt, `${path}.occurredAt`, errors);
  validateEnum(value.sourceType, noteSourceTypes, `${path}.sourceType`, errors);
  requireNonEmptyString(value.rawText, `${path}.rawText`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);
}

function validatePersonContext(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Person context must be an object." });
    return;
  }

  requireNonEmptyString(value.id, `${path}.id`, errors);
  requireNonEmptyString(value.name, `${path}.name`, errors);
  requireStringArray(value.aliases, `${path}.aliases`, errors);
  requireStringArray(value.relationshipTypes, `${path}.relationshipTypes`, errors);
  requireOptionalString(value.city, `${path}.city`, errors);
  requireOptionalString(value.summary, `${path}.summary`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);
}

function validateSuggestion(
  value: unknown,
  path: string,
  knownPersonIds: Set<string>,
  errors: ExtractorValidationError[]
) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Suggestion must be an object." });
    return;
  }

  if (value.kind !== "memory" && value.kind !== "openLoop") {
    errors.push({ path: `${path}.kind`, message: "Suggestion kind must be memory or openLoop." });
    return;
  }

  validateKnownPersonId(value.personId, `${path}.personId`, knownPersonIds, errors);
  requireNonEmptyString(value.basis, `${path}.basis`, errors);
  validateEnum(value.sensitivity, sensitivityValues, `${path}.sensitivity`, errors);

  if (value.kind === "memory") {
    requireNonEmptyString(value.text, `${path}.text`, errors);
    validateEnum(value.category, memoryCategories, `${path}.category`, errors);
    validateEnum(value.confidence, confidenceValues, `${path}.confidence`, errors);
  }

  if (value.kind === "openLoop") {
    requireNonEmptyString(value.title, `${path}.title`, errors);
    requireOptionalString(value.description, `${path}.description`, errors);
    validateOptionalIsoDate(value.dueAt, `${path}.dueAt`, errors);
  }
}

function validateDate(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Date item must be an object." });
    return;
  }

  requireNonEmptyString(value.label, `${path}.label`, errors);
  validateOptionalIsoDate(value.date, `${path}.date`, errors);
  validateEnum(value.confidence, confidenceValues, `${path}.confidence`, errors);
}

function validateSafetyFlag(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (!isRecord(value)) {
    errors.push({ path, message: "Safety flag must be an object." });
    return;
  }

  validateEnum(value.type, safetyFlagTypes, `${path}.type`, errors);
  requireNonEmptyString(value.reason, `${path}.reason`, errors);
}

function validateKnownPersonId(
  value: unknown,
  path: string,
  knownPersonIds: Set<string>,
  errors: ExtractorValidationError[]
) {
  if (!requireNonEmptyString(value, path, errors)) return;
  if (!knownPersonIds.has(value)) {
    errors.push({ path, message: "Person ID was not included in the request context." });
  }
}

function validateOptionalIsoDate(value: unknown, path: string, errors: ExtractorValidationError[]) {
  if (value === undefined) return;
  if (!requireNonEmptyString(value, path, errors)) return;
  if (!isIsoDate(value)) {
    errors.push({ path, message: "Date must use YYYY-MM-DD format." });
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

function requireString(value: unknown, path: string, errors: ExtractorValidationError[]): value is string {
  if (typeof value !== "string") {
    errors.push({ path, message: "Value must be a string." });
    return false;
  }
  return true;
}

function requireNonEmptyString(value: unknown, path: string, errors: ExtractorValidationError[]): value is string {
  if (!requireString(value, path, errors)) return false;
  if (value.trim().length === 0) {
    errors.push({ path, message: "Value must not be empty." });
    return false;
  }
  return true;
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
