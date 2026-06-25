import { describe, expect, it } from "vitest";
import {
  parseAndValidateExtractMemoryResponse,
  validateExtractMemoryResponse,
  type ExtractMemoryResponse
} from "./aiExtractorSchema";

const knownPersonIds = ["p-ada", "p-sana"];

function validResponse(): ExtractMemoryResponse {
  return {
    summary: "Ada prefers tight context and needs a follow-up.",
    suggestions: [
      {
        kind: "memory",
        personId: "p-ada",
        text: "Prefers tight context before calls.",
        category: "preference",
        basis: "Ada prefers tight context before calls.",
        confidence: "high",
        sensitivity: "normal"
      },
      {
        kind: "openLoop",
        personId: "p-ada",
        title: "Send two names",
        description: "Send two founder names for the advisory group.",
        dueAt: "2026-06-30",
        basis: "Promised to send two names by the end of the month.",
        sensitivity: "normal"
      }
    ],
    dates: [
      {
        label: "Founder names due",
        date: "2026-06-30",
        confidence: "medium"
      }
    ],
    safetyFlags: [
      {
        type: "sensitive",
        reason: "Note includes private relationship context."
      }
    ]
  };
}

describe("validateExtractMemoryResponse", () => {
  it("accepts a valid extractor response", () => {
    const result = validateExtractMemoryResponse(validResponse(), knownPersonIds);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.suggestions).toHaveLength(2);
    }
  });

  it("rejects malformed dates", () => {
    const response = validResponse();
    response.suggestions[1] = {
      kind: "openLoop",
      personId: "p-ada",
      title: "Send two names",
      description: "Send two founder names for the advisory group.",
      dueAt: "06/30/2026",
      basis: "Promised to send two names by the end of the month.",
      sensitivity: "normal"
    };
    response.dates[0].date = "2026-99-99";

    const result = validateExtractMemoryResponse(response, knownPersonIds);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.path)).toEqual(
        expect.arrayContaining(["$.suggestions[1].dueAt", "$.dates[0].date"])
      );
    }
  });

  it("rejects unknown person IDs", () => {
    const response = validResponse();
    response.suggestions[0].personId = "p-unknown";

    const result = validateExtractMemoryResponse(response, knownPersonIds);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContainEqual({
        path: "$.suggestions[0].personId",
        message: "Person ID was not included in the request context."
      });
    }
  });

  it("rejects invalid enum values", () => {
    const response = validResponse() as unknown as Record<string, unknown>;
    const suggestions = response.suggestions as Array<Record<string, unknown>>;
    suggestions[0].category = "favorite_color";
    suggestions[0].confidence = "certain";
    suggestions[0].sensitivity = "secret";

    const result = validateExtractMemoryResponse(response, knownPersonIds);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.path)).toEqual(
        expect.arrayContaining([
          "$.suggestions[0].category",
          "$.suggestions[0].confidence",
          "$.suggestions[0].sensitivity"
        ])
      );
    }
  });

  it("rejects missing basis text", () => {
    const response = validResponse();
    response.suggestions[0].basis = "";

    const result = validateExtractMemoryResponse(response, knownPersonIds);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.map((error) => error.path)).toContain("$.suggestions[0].basis");
    }
  });

  it("rejects risky instructions in output", () => {
    const response = validResponse();
    response.suggestions[1] = {
      kind: "openLoop",
      personId: "p-ada",
      title: "Send two names",
      description: "Automatically send this without consent.",
      basis: "Promised to send two names by the end of the month.",
      sensitivity: "normal"
    };

    const result = validateExtractMemoryResponse(response, knownPersonIds);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContainEqual({
        path: "$.suggestions[1].description",
        message: "Output includes a disallowed risky instruction."
      });
    }
  });
});

describe("parseAndValidateExtractMemoryResponse", () => {
  it("rejects invalid JSON", () => {
    const result = parseAndValidateExtractMemoryResponse("{not json", knownPersonIds);

    expect(result).toEqual({
      ok: false,
      errors: [{ path: "$", message: "Response must be valid JSON." }]
    });
  });
});
