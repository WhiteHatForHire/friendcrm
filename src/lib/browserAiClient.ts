import type { CrmData, Person, RelationshipNote } from "../types";
import {
  buildGenerateBriefRequest,
  buildGenerateNextMovesRequest,
  generateBriefForReview,
  generateNextMovesForReview,
  type BriefForReview,
  type NextMovesForReview
} from "./aiGenerationRoute";
import type { GenerateBriefResponse, GenerateNextMovesResponse } from "./aiGenerationSchema";
import {
  buildExtractMemoryRequest,
  extractMemorySuggestionsForReview,
  mapExtractMemoryResponseToSuggestions,
  type ReviewExtractionResult
} from "./aiExtractorRoute";
import type { ExtractMemoryResponse, ExtractorValidationError } from "./aiExtractorSchema";

type RoutePayload<T> = { ok: true; response: T } | { ok: false; errors: ExtractorValidationError[] };
type BrowserFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function extractMemorySuggestionsViaHttp(
  note: RelationshipNote,
  people: Person[],
  fetchImpl: BrowserFetch = fetch
): Promise<ReviewExtractionResult> {
  try {
    const routeResult = await postAiRoute<ExtractMemoryResponse>(
      "/api/ai/extract-memory",
      buildExtractMemoryRequest(note, people),
      fetchImpl
    );

    if (routeResult.ok) {
      return {
        suggestions: mapExtractMemoryResponseToSuggestions(routeResult.response),
        source: "validated_http",
        errors: []
      };
    }

    return fallbackExtraction(note, people, routeResult.errors);
  } catch (error) {
    return fallbackExtraction(note, people, [errorToValidationError(error)]);
  }
}

export async function generateBriefViaHttp(
  data: CrmData,
  person: Person,
  fetchImpl: BrowserFetch = fetch
): Promise<BriefForReview> {
  try {
    const routeResult = await postAiRoute<GenerateBriefResponse>(
      "/api/ai/generate-brief",
      buildGenerateBriefRequest(data, person),
      fetchImpl
    );

    if (routeResult.ok) {
      return { brief: routeResult.response, source: "validated_http", errors: [] };
    }

    return fallbackBrief(data, person, routeResult.errors);
  } catch (error) {
    return fallbackBrief(data, person, [errorToValidationError(error)]);
  }
}

export async function generateNextMovesViaHttp(
  data: CrmData,
  person: Person,
  objective: string,
  fetchImpl: BrowserFetch = fetch
): Promise<NextMovesForReview> {
  try {
    const routeResult = await postAiRoute<GenerateNextMovesResponse>(
      "/api/ai/generate-next-moves",
      buildGenerateNextMovesRequest(data, person, objective),
      fetchImpl
    );

    if (routeResult.ok) {
      return { moves: routeResult.response, source: "validated_http", errors: [] };
    }

    return fallbackNextMoves(data, person, objective, routeResult.errors);
  } catch (error) {
    return fallbackNextMoves(data, person, objective, [errorToValidationError(error)]);
  }
}

async function postAiRoute<T>(path: string, body: unknown, fetchImpl: BrowserFetch): Promise<RoutePayload<T>> {
  const response = await fetchImpl(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const payload = (await response.json()) as RoutePayload<T>;

  if (!response.ok && payload.ok !== false) {
    return { ok: false, errors: [{ path: "$", message: `AI route failed with HTTP ${response.status}.` }] };
  }

  return payload;
}

async function fallbackExtraction(
  note: RelationshipNote,
  people: Person[],
  errors: ExtractorValidationError[]
): Promise<ReviewExtractionResult> {
  const local = await extractMemorySuggestionsForReview(note, people);
  return {
    ...local,
    errors: [...errors, ...local.errors]
  };
}

async function fallbackBrief(data: CrmData, person: Person, errors: ExtractorValidationError[]): Promise<BriefForReview> {
  const local = await generateBriefForReview(data, person);
  return {
    ...local,
    errors: [...errors, ...local.errors]
  };
}

async function fallbackNextMoves(
  data: CrmData,
  person: Person,
  objective: string,
  errors: ExtractorValidationError[]
): Promise<NextMovesForReview> {
  const local = await generateNextMovesForReview(data, person, objective);
  return {
    ...local,
    errors: [...errors, ...local.errors]
  };
}

function errorToValidationError(error: unknown): ExtractorValidationError {
  return {
    path: "$",
    message: error instanceof Error ? error.message : "AI route request failed."
  };
}
