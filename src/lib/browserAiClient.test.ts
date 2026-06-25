import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import {
  extractMemorySuggestionsViaHttp,
  generateBriefViaHttp,
  generateNextMovesViaHttp
} from "./browserAiClient";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

describe("browser AI client", () => {
  it("maps successful extract-memory HTTP responses into review suggestions", async () => {
    const note = seedData.notes[0];
    const result = await extractMemorySuggestionsViaHttp(note, seedData.people, async () =>
      jsonResponse({
        ok: true,
        response: {
          summary: "Ada prefers tight memos.",
          suggestions: [
            {
              kind: "memory",
              personId: "p-ada",
              text: "Prefers tight memos.",
              category: "preference",
              basis: "She prefers a tight memo before calls.",
              confidence: "high",
              sensitivity: "normal"
            }
          ],
          dates: [],
          safetyFlags: []
        }
      })
    );

    expect(result.source).toBe("validated_http");
    expect(result.suggestions[0]).toMatchObject({ kind: "memory", body: "Prefers tight memos." });
  });

  it("falls back to local extraction when HTTP extraction fails", async () => {
    const note = seedData.notes[0];
    const result = await extractMemorySuggestionsViaHttp(note, seedData.people, async () =>
      jsonResponse({ ok: false, errors: [{ path: "$", message: "Nope." }] }, 422)
    );

    expect(result.source).toBe("validated_mock");
    expect(result.errors[0]).toMatchObject({ message: "Nope." });
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("uses HTTP generated briefs when available", async () => {
    const result = await generateBriefViaHttp(seedData, seedData.people[0], async () =>
      jsonResponse({
        ok: true,
        response: {
          snapshot: "HTTP brief",
          remember: [],
          openLoops: [],
          avoid: [],
          goodNextMove: "Send a note."
        }
      })
    );

    expect(result.source).toBe("validated_http");
    expect(result.brief.snapshot).toBe("HTTP brief");
  });

  it("falls back to local briefs when HTTP fails", async () => {
    const result = await generateBriefViaHttp(seedData, seedData.people[0], async () => {
      throw new Error("Network down");
    });

    expect(result.source).toBe("validated_provider");
    expect(result.errors[0]).toMatchObject({ message: "Network down" });
    expect(result.brief.snapshot.length).toBeGreaterThan(0);
  });

  it("uses HTTP generated next moves when available", async () => {
    const result = await generateNextMovesViaHttp(seedData, seedData.people[0], "follow up", async () =>
      jsonResponse({
        ok: true,
        response: {
          moves: [
            {
              type: "message",
              draft: "Send the names.",
              rationale: "Ada asked.",
              risk: "low",
              riskReason: "Expected."
            }
          ]
        }
      })
    );

    expect(result.source).toBe("validated_http");
    expect(result.moves.moves[0].draft).toBe("Send the names.");
  });
});
