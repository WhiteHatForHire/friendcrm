import type { ExtractionSuggestion, Person, RelationshipNote } from "../types";
import { extractSuggestions } from "./insights";
import { makeId } from "./storage";
import {
  validateExtractMemoryResponse,
  type ExtractMemoryRequest,
  type ExtractMemoryResponse,
  type ExtractorValidationError
} from "./aiExtractorSchema";

export type ExtractMemoryProvider = (request: ExtractMemoryRequest) => Promise<unknown> | unknown;

export type ExtractMemoryRouteResult =
  | { ok: true; response: ExtractMemoryResponse }
  | { ok: false; errors: ExtractorValidationError[] };

export type ReviewExtractionResult = {
  suggestions: ExtractionSuggestion[];
  source: "validated_http" | "validated_mock" | "deterministic_fallback";
  errors: ExtractorValidationError[];
};

export async function runExtractMemoryRoute(
  request: ExtractMemoryRequest,
  provider: ExtractMemoryProvider
): Promise<ExtractMemoryRouteResult> {
  try {
    const providerOutput = await provider(request);
    const validation = validateExtractMemoryResponse(
      providerOutput,
      request.people.map((person) => person.id)
    );

    if (!validation.ok) {
      return validation;
    }

    return { ok: true, response: validation.value };
  } catch (error) {
    return {
      ok: false,
      errors: [
        {
          path: "$",
          message: error instanceof Error ? error.message : "Extractor provider failed."
        }
      ]
    };
  }
}

export async function extractMemorySuggestionsForReview(
  note: RelationshipNote,
  people: Person[],
  provider: ExtractMemoryProvider = mockExtractMemoryProvider
): Promise<ReviewExtractionResult> {
  const request = buildExtractMemoryRequest(note, people);
  const routeResult = await runExtractMemoryRoute(request, provider);

  if (routeResult.ok) {
    return {
      suggestions: mapExtractMemoryResponseToSuggestions(routeResult.response),
      source: "validated_mock",
      errors: []
    };
  }

  return {
    suggestions: extractSuggestions(note, people),
    source: "deterministic_fallback",
    errors: routeResult.errors
  };
}

export function buildExtractMemoryRequest(note: RelationshipNote, people: Person[]): ExtractMemoryRequest {
  return {
    note: {
      id: note.id,
      personIds: note.personIds,
      occurredAt: note.occurredAt,
      sourceType: note.sourceType,
      rawText: note.rawText,
      sensitivity: note.sensitivity
    },
    people: people
      .filter((person) => note.personIds.includes(person.id))
      .map((person) => ({
        id: person.id,
        name: person.name,
        aliases: person.aliases,
        relationshipTypes: person.relationshipTypes,
        city: person.city,
        summary: person.summary,
        sensitivity: person.sensitivity
      }))
  };
}

export function mapExtractMemoryResponseToSuggestions(response: ExtractMemoryResponse): ExtractionSuggestion[] {
  return response.suggestions.map((suggestion) => {
    if (suggestion.kind === "memory") {
      return {
        id: makeId("s"),
        kind: "memory",
        personId: suggestion.personId,
        title: suggestion.category.replace("_", " "),
        body: suggestion.text,
        basis: suggestion.basis,
        sensitivity: suggestion.sensitivity,
        category: suggestion.category,
        confidence: suggestion.confidence
      };
    }

    return {
      id: makeId("s"),
      kind: "openLoop",
      personId: suggestion.personId,
      title: suggestion.title,
      body: suggestion.description ?? suggestion.title,
      basis: suggestion.basis,
      dueAt: suggestion.dueAt,
      sensitivity: suggestion.sensitivity
    };
  });
}

export function mockExtractMemoryProvider(request: ExtractMemoryRequest): ExtractMemoryResponse {
  const note: RelationshipNote = {
    ...request.note,
    createdAt: new Date().toISOString()
  };
  const people = request.people.map((person) => ({
    ...person,
    contactMethods: [],
    importance: 3 as const,
    warmth: "neutral" as const,
    trust: 3 as const,
    strategicRelevance: 3 as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  const deterministicSuggestions = extractSuggestions(note, people);

  return {
    summary: note.rawText.length > 140 ? `${note.rawText.slice(0, 137)}...` : note.rawText,
    suggestions: deterministicSuggestions.map((suggestion) => {
      if (suggestion.kind === "memory") {
        return {
          kind: "memory",
          personId: suggestion.personId,
          text: suggestion.body,
          category: suggestion.category ?? "other",
          basis: suggestion.basis,
          confidence: suggestion.confidence ?? "medium",
          sensitivity: suggestion.sensitivity
        };
      }

      return {
        kind: "openLoop",
        personId: suggestion.personId,
        title: suggestion.title,
        description: suggestion.body,
        dueAt: suggestion.dueAt,
        basis: suggestion.basis,
        sensitivity: suggestion.sensitivity
      };
    }),
    dates: [],
    safetyFlags: note.sensitivity === "normal" ? [] : [{ type: note.sensitivity, reason: "Input note was flagged." }]
  };
}
