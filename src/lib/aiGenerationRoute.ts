import type { CrmData, NextMove, Person, RelationshipNote } from "../types";
import { buildBrief } from "./insights";
import type { ExtractorValidationError } from "./aiExtractorSchema";
import {
  validateGenerateBriefResponse,
  validateGenerateNextMovesResponse,
  type GenerateBriefRequest,
  type GenerateBriefResponse,
  type GenerateNextMovesRequest,
  type GenerateNextMovesResponse
} from "./aiGenerationSchema";

export type GenerateBriefProvider = (request: GenerateBriefRequest) => Promise<unknown> | unknown;
export type GenerateNextMovesProvider = (request: GenerateNextMovesRequest) => Promise<unknown> | unknown;

export type GenerationRouteResult<T> =
  | { ok: true; response: T }
  | { ok: false; errors: ExtractorValidationError[] };

export type BriefForReview = {
  brief: GenerateBriefResponse;
  source: "validated_http" | "validated_provider" | "deterministic_fallback";
  errors: ExtractorValidationError[];
};

export type NextMovesForReview = {
  moves: GenerateNextMovesResponse;
  source: "validated_http" | "validated_provider" | "deterministic_fallback";
  errors: ExtractorValidationError[];
};

export async function runGenerateBriefRoute(
  request: GenerateBriefRequest,
  provider: GenerateBriefProvider
): Promise<GenerationRouteResult<GenerateBriefResponse>> {
  try {
    const output = await provider(request);
    const validation = validateGenerateBriefResponse(output);
    return validation.ok ? { ok: true, response: validation.value } : validation;
  } catch (error) {
    return {
      ok: false,
      errors: [{ path: "$", message: error instanceof Error ? error.message : "Brief provider failed." }]
    };
  }
}

export async function runGenerateNextMovesRoute(
  request: GenerateNextMovesRequest,
  provider: GenerateNextMovesProvider
): Promise<GenerationRouteResult<GenerateNextMovesResponse>> {
  try {
    const output = await provider(request);
    const validation = validateGenerateNextMovesResponse(output);
    return validation.ok ? { ok: true, response: validation.value } : validation;
  } catch (error) {
    return {
      ok: false,
      errors: [{ path: "$", message: error instanceof Error ? error.message : "Next move provider failed." }]
    };
  }
}

export async function generateBriefForReview(
  data: CrmData,
  person: Person,
  provider: GenerateBriefProvider = mockGenerateBriefProvider
): Promise<BriefForReview> {
  const request = buildGenerateBriefRequest(data, person);
  const result = await runGenerateBriefRoute(request, provider);

  if (result.ok) {
    return { brief: result.response, source: "validated_provider", errors: [] };
  }

  return {
    brief: deterministicBriefResponse(data, person),
    source: "deterministic_fallback",
    errors: result.errors
  };
}

export async function generateNextMovesForReview(
  data: CrmData,
  person: Person,
  objective: string,
  provider: GenerateNextMovesProvider = mockGenerateNextMovesProvider
): Promise<NextMovesForReview> {
  const request = buildGenerateNextMovesRequest(data, person, objective);
  const result = await runGenerateNextMovesRoute(request, provider);

  if (result.ok) {
    return { moves: result.response, source: "validated_provider", errors: [] };
  }

  return {
    moves: deterministicNextMovesResponse(data, person, objective),
    source: "deterministic_fallback",
    errors: result.errors
  };
}

export function buildGenerateBriefRequest(data: CrmData, person: Person): GenerateBriefRequest {
  return {
    person: minimalPerson(person),
    memories: data.memories
      .filter((memory) => memory.personId === person.id && memory.confirmed)
      .slice(0, 12)
      .map((memory) => ({
        text: memory.text,
        category: memory.category,
        confidence: memory.confidence,
        sensitivity: memory.sensitivity
      })),
    openLoops: data.openLoops
      .filter((loop) => loop.personId === person.id && loop.status !== "done")
      .slice(0, 8)
      .map((loop) => ({
        title: loop.title,
        description: loop.description,
        dueAt: loop.dueAt,
        status: loop.status
      })),
    recentNotes: data.notes
      .filter((note) => note.personIds.includes(person.id))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, 5)
      .map((note) => ({
        occurredAt: note.occurredAt,
        sourceType: note.sourceType,
        rawText: note.rawText,
        sensitivity: note.sensitivity
      })),
    nextMoves: data.nextMoves
      .filter((move) => move.personId === person.id && move.status !== "dismissed")
      .slice(0, 5)
      .map((move) => ({
        type: move.type,
        draft: move.draft,
        rationale: move.rationale,
        risk: move.risk,
        status: move.status
      }))
  };
}

export function buildGenerateNextMovesRequest(
  data: CrmData,
  person: Person,
  objective: string
): GenerateNextMovesRequest {
  const briefContext = buildGenerateBriefRequest(data, person);
  return {
    person: briefContext.person,
    objective,
    context: {
      memories: briefContext.memories,
      openLoops: briefContext.openLoops,
      recentNotes: briefContext.recentNotes
    }
  };
}

export function mockGenerateBriefProvider(request: GenerateBriefRequest): GenerateBriefResponse {
  const { data, person } = crmDataFromBriefRequest(request);
  return deterministicBriefResponse(data, person);
}

export function mockGenerateNextMovesProvider(request: GenerateNextMovesRequest): GenerateNextMovesResponse {
  const { data, person } = crmDataFromBriefRequest({
    person: request.person,
    memories: request.context.memories,
    openLoops: request.context.openLoops,
    recentNotes: request.context.recentNotes,
    nextMoves: []
  });
  return deterministicNextMovesResponse(data, person, request.objective);
}

function crmDataFromBriefRequest(request: GenerateBriefRequest): { data: CrmData; person: Person } {
  const now = new Date().toISOString();
  const person: Person = {
    id: request.person.id,
    name: request.person.name,
    aliases: [],
    relationshipTypes: ["friend"],
    contactMethods: [],
    importance: 3,
    warmth: "neutral",
    trust: 3,
    strategicRelevance: 3,
    sensitivity: request.person.sensitivity,
    summary: request.person.summary,
    createdAt: now,
    updatedAt: now
  };

  return {
    person,
    data: {
      people: [person],
      notes: request.recentNotes.map(
        (note, index): RelationshipNote => ({
          id: `n-request-${index}`,
          personIds: [request.person.id],
          occurredAt: note.occurredAt,
          sourceType: note.sourceType as RelationshipNote["sourceType"],
          rawText: note.rawText,
          sensitivity: note.sensitivity,
          createdAt: now
        })
      ),
      memories: request.memories.map((memory, index) => ({
        id: `m-request-${index}`,
        personId: request.person.id,
        sourceNoteId: "request-context",
        text: memory.text,
        category: memory.category,
        confidence: memory.confidence,
        sensitivity: memory.sensitivity,
        confirmed: true
      })),
      openLoops: request.openLoops.map((loop, index) => ({
        id: `o-request-${index}`,
        personId: request.person.id,
        title: loop.title,
        description: loop.description,
        dueAt: loop.dueAt,
        sensitivity: request.person.sensitivity,
        status: loop.status as "open"
      })),
      nextMoves: request.nextMoves.map((move, index) => ({
        id: `x-request-${index}`,
        personId: request.person.id,
        ...move
      })),
      interactions: []
    }
  };
}

function deterministicBriefResponse(data: CrmData, person: Person): GenerateBriefResponse {
  const brief = buildBrief(data, person);
  const context = briefContext(data, person);

  return {
    snapshot: context.hasContext
      ? brief.snapshot
      : `${person.name} has a thin file. Act like a normal human and keep the first move small.`,
    remember: brief.remember.length
      ? brief.remember
      : ["No confirmed lore yet. Ask one specific question and let the other person be a person."],
    openLoops: brief.loops.length ? brief.loops : ["No open loop on file. Do not invent homework for sport."],
    avoid: brief.avoid.length ? brief.avoid : fallbackAvoidList(context),
    goodNextMove: bestDeterministicMove(data, person, brief.nextMove),
    sensitivityWarning: context.hasSensitiveContext
      ? "This brief touches sensitive/private context. Review before copying anything into the outside world."
      : undefined
  };
}

function deterministicNextMovesResponse(data: CrmData, person: Person, objective: string): GenerateNextMovesResponse {
  const context = briefContext(data, person);
  const openLoop = context.openLoops[0];
  const boundary = context.boundary;
  const preference = context.preference;
  const recentNote = context.recentNotes[0];
  const objectiveText = objective.trim() || "reconnect with care";
  const baseRisk = riskForContext(context);
  const directDraft = openLoop
    ? `Send ${person.name} a plain note closing the loop: "${openLoop.title}." Keep it short enough to survive daylight.`
    : `Send ${person.name} one direct check-in tied to ${objectiveText}. No fog machine, no grand speech.`;
  const warmDraft = preference
    ? `Send a warmer note that nods to the known preference: ${preference.text}`
    : recentNote
      ? `Send a warm check-in that references the last real receipt from ${recentNote.occurredAt}, then stop typing.`
      : `Send a tiny low-pressure note about ${objectiveText}. The goal is contact, not a full investigation.`;
  const carefulDraft = boundary
    ? `Use the careful version: keep the message optional, avoid the boundary, and do not drag the private file cabinet into public.`
    : `Use the careful version: offer an easy out and make the next step optional. Nobody likes a surprise agenda.`;

  return {
    moves: [
      {
        type: openLoop ? "message" : "check_in",
        draft: directDraft,
        rationale: openLoop
          ? "Direct option: there is already an open loop to close, so do the clean little responsible thing."
          : "Direct option: specificity is kinder than a vague ping wearing a fake mustache.",
        risk: baseRisk,
        riskReason: riskReasonForContext(context, "Keep the message specific, optional, and human-reviewed before use.")
      },
      {
        type: "support",
        draft: warmDraft,
        rationale: "Warmer option: start with care and context instead of marching in with a clipboard.",
        risk: baseRisk,
        riskReason: riskReasonForContext(context, "Warm is good; over-familiar is how the dossier gets a complaint.")
      },
      {
        type: boundary ? "support" : "invite",
        draft: carefulDraft,
        rationale: boundary
          ? "Careful option: a known boundary or sensitive record is on the desk."
          : "Low-pressure option: make the door easy to open and easy to ignore.",
        risk: baseRisk,
        riskReason: riskReasonForContext(context, "This is safest when the next step is reversible.")
      }
    ],
    sensitivityWarning:
      !context.hasSensitiveContext
        ? undefined
        : "Generated moves may reflect sensitive/private context. Edit before using, and absolutely do not paste the whole dossier into a message."
  };
}

function briefContext(data: CrmData, person: Person) {
  const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
  const openLoops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
  const nextMoves = data.nextMoves.filter((move) => move.personId === person.id && move.status !== "dismissed");
  const recentNotes = data.notes
    .filter((note) => note.personIds.includes(person.id))
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 3);
  const boundary = memories.find((memory) => memory.category === "boundary" || memory.sensitivity !== "normal");
  const preference = memories.find((memory) => memory.category === "preference");
  const hasSensitiveContext =
    person.sensitivity !== "normal" ||
    memories.some((memory) => memory.sensitivity !== "normal") ||
    openLoops.some((loop) => loop.sensitivity !== "normal") ||
    recentNotes.some((note) => note.sensitivity !== "normal");

  return {
    memories,
    openLoops,
    nextMoves,
    recentNotes,
    boundary,
    preference,
    hasContext: memories.length + openLoops.length + nextMoves.length + recentNotes.length > 0,
    hasSensitiveContext
  };
}

function fallbackAvoidList(context: ReturnType<typeof briefContext>) {
  if (context.hasSensitiveContext) {
    return ["Private/sensitive context is nearby. Be normal, be kind, and do not quote the file cabinet."];
  }

  if (!context.hasContext) {
    return ["Avoid pretending you know the vibe. The dossier is basically a napkin with a name on it."];
  }

  return ["No explicit avoid-list on file. Still avoid being weird in a bad way."];
}

function bestDeterministicMove(data: CrmData, person: Person, fallback: string) {
  const context = briefContext(data, person);
  const openLoop = context.openLoops[0];

  if (openLoop) {
    return `Close the obvious loop: ${openLoop.title}. Keep it brief, specific, and editable before it leaves the building.`;
  }

  if (!context.hasContext) {
    return `Send one tiny, low-pressure check-in to ${person.name}. No manifesto.`;
  }

  return fallback;
}

function riskForContext(context: ReturnType<typeof briefContext>): NextMove["risk"] {
  if (context.hasSensitiveContext || context.boundary) return "medium";
  return "low";
}

function riskReasonForContext(context: ReturnType<typeof briefContext>, normalReason: string) {
  if (context.boundary) {
    return "Known boundary or sensitive memory is present. Keep the draft restrained and review it like a responsible adult.";
  }

  if (context.hasSensitiveContext) {
    return "Sensitive/private context is present. Use only what the person would reasonably expect you to remember.";
  }

  if (!context.hasContext) {
    return "Context is thin. The safest move is small, reversible, and not weirdly over-informed.";
  }

  return normalReason;
}

function minimalPerson(person: Person): GenerateBriefRequest["person"] {
  return {
    id: person.id,
    name: person.name,
    relationshipTypes: person.relationshipTypes,
    city: person.city,
    summary: person.summary,
    sensitivity: person.sensitivity
  };
}
