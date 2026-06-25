import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import type { RelationshipNote } from "../types";
import {
  buildExtractMemoryRequest,
  extractMemorySuggestionsForReview,
  mapExtractMemoryResponseToSuggestions,
  runExtractMemoryRoute
} from "./aiExtractorRoute";
import type { ExtractMemoryResponse } from "./aiExtractorSchema";

const note: RelationshipNote = {
  id: "n-ai-test",
  personIds: ["p-ada"],
  occurredAt: "2026-06-23",
  sourceType: "manual",
  rawText: "Ada prefers tight memos. Promised to send the intro this week.",
  sensitivity: "normal",
  createdAt: "2026-06-23T00:00:00.000Z"
};

describe("extractor route shell", () => {
  it("builds a minimal request without contact values", () => {
    const request = buildExtractMemoryRequest(note, seedData.people);

    expect(request.people).toHaveLength(1);
    expect(request.people[0]).toMatchObject({ id: "p-ada", name: "Ada Nkrumah" });
    expect("contactMethods" in request.people[0]).toBe(false);
  });

  it("validates provider output before returning success", async () => {
    const request = buildExtractMemoryRequest(note, seedData.people);
    const response: ExtractMemoryResponse = {
      summary: "Ada prefers tight memos.",
      suggestions: [
        {
          kind: "memory",
          personId: "p-ada",
          text: "Prefers tight memos.",
          category: "preference",
          basis: "Ada prefers tight memos.",
          confidence: "high",
          sensitivity: "normal"
        }
      ],
      dates: [],
      safetyFlags: []
    };

    const result = await runExtractMemoryRoute(request, () => response);

    expect(result.ok).toBe(true);
  });

  it("returns validation errors for bad provider output", async () => {
    const request = buildExtractMemoryRequest(note, seedData.people);
    const result = await runExtractMemoryRoute(request, () => ({
      summary: "Bad",
      suggestions: [{ kind: "memory", personId: "p-unknown", text: "No basis." }],
      dates: [],
      safetyFlags: []
    }));

    expect(result.ok).toBe(false);
  });

  it("maps validated responses to editable review suggestions", () => {
    const suggestions = mapExtractMemoryResponseToSuggestions({
      summary: "Ada prefers tight memos.",
      suggestions: [
        {
          kind: "openLoop",
          personId: "p-ada",
          title: "Send intro",
          description: "Send the intro this week.",
          dueAt: "2026-06-27",
          basis: "Promised to send the intro this week.",
          sensitivity: "normal"
        }
      ],
      dates: [],
      safetyFlags: []
    });

    expect(suggestions[0]).toMatchObject({
      kind: "openLoop",
      title: "Send intro",
      body: "Send the intro this week.",
      basis: "Promised to send the intro this week."
    });
  });

  it("falls back to deterministic suggestions when provider output fails validation", async () => {
    const result = await extractMemorySuggestionsForReview(note, seedData.people, () => ({
      summary: "Bad",
      suggestions: [{ kind: "memory", personId: "p-unknown" }],
      dates: [],
      safetyFlags: []
    }));

    expect(result.source).toBe("deterministic_fallback");
    expect(result.suggestions).toHaveLength(2);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
