import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import { buildExtractMemoryRequest } from "./aiExtractorRoute";
import type { ExtractMemoryResponse } from "./aiExtractorSchema";
import { buildGenerateBriefRequest, buildGenerateNextMovesRequest } from "./aiGenerationRoute";
import { handleAiHttpRequest } from "./aiHttpTransport";

async function responseJson(response: Response) {
  return (await response.json()) as { ok: boolean; response?: unknown; errors?: Array<{ path: string; message: string }> };
}

describe("AI HTTP transport", () => {
  it("rejects non-POST requests", async () => {
    const response = await handleAiHttpRequest(new Request("http://localhost/api/ai/extract-memory"), {
      extractMemory: () => ({})
    });

    expect(response.status).toBe(405);
    expect(await responseJson(response)).toMatchObject({ ok: false });
  });

  it("handles extract-memory requests through the route shell", async () => {
    const requestBody = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const providerResponse: ExtractMemoryResponse = {
      summary: "Ada asked for intros.",
      suggestions: [],
      dates: [],
      safetyFlags: []
    };
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/extract-memory", {
        method: "POST",
        body: JSON.stringify(requestBody)
      }),
      {
        extractMemory: () => providerResponse
      }
    );

    expect(response.status).toBe(200);
    expect(await responseJson(response)).toMatchObject({ ok: true, response: { summary: "Ada asked for intros." } });
  });

  it("returns validation errors from invalid extractor output", async () => {
    const requestBody = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/extract-memory", {
        method: "POST",
        body: JSON.stringify(requestBody)
      }),
      {
        extractMemory: () => ({ summary: "Bad", suggestions: [{ kind: "memory" }], dates: [], safetyFlags: [] })
      }
    );

    expect(response.status).toBe(422);
    expect(await responseJson(response)).toMatchObject({ ok: false });
  });

  it("handles generate-brief requests", async () => {
    const requestBody = buildGenerateBriefRequest(seedData, seedData.people[0]);
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/generate-brief", {
        method: "POST",
        body: JSON.stringify(requestBody)
      }),
      {
        extractMemory: () => ({}),
        generateBrief: () => ({
          snapshot: "Ada likes concise prep.",
          remember: [],
          openLoops: [],
          avoid: [],
          goodNextMove: "Send a crisp note."
        })
      }
    );

    expect(response.status).toBe(200);
    expect(await responseJson(response)).toMatchObject({ ok: true, response: { snapshot: "Ada likes concise prep." } });
  });

  it("handles generate-next-moves requests", async () => {
    const requestBody = buildGenerateNextMovesRequest(seedData, seedData.people[0], "close intro loop");
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/generate-next-moves", {
        method: "POST",
        body: JSON.stringify(requestBody)
      }),
      {
        extractMemory: () => ({}),
        generateNextMoves: () => ({
          moves: [
            {
              type: "message",
              draft: "Send the two names.",
              rationale: "Ada asked for them.",
              risk: "low",
              riskReason: "Expected and specific."
            }
          ]
        })
      }
    );

    expect(response.status).toBe(200);
    expect(await responseJson(response)).toMatchObject({ ok: true });
  });

  it("rejects invalid route payloads before provider execution", async () => {
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/generate-next-moves", {
        method: "POST",
        body: JSON.stringify({ nope: true })
      }),
      {
        extractMemory: () => ({}),
        generateNextMoves: () => {
          throw new Error("Provider should not receive invalid request payloads.");
        }
      }
    );

    expect(response.status).toBe(422);
    expect(await responseJson(response)).toMatchObject({
      ok: false,
      errors: expect.arrayContaining([expect.objectContaining({ path: "$.person" })])
    });
  });

  it("rejects malformed request JSON", async () => {
    const response = await handleAiHttpRequest(
      new Request("http://localhost/api/ai/generate-brief", {
        method: "POST",
        body: "{bad json"
      }),
      { extractMemory: () => ({}) }
    );

    expect(response.status).toBe(400);
    expect(await responseJson(response)).toMatchObject({ ok: false });
  });
});
