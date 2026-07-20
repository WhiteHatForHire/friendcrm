import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import { buildExtractMemoryRequest } from "./aiExtractorRoute";
import {
  buildOpenAiExtractorBody,
  createOpenAiBriefProvider,
  createOpenAiExtractorProvider,
  createOpenAiNextMovesProvider,
  parseOpenAiJsonPayload,
  readOpenAiProviderConfig,
  type ProviderFetch
} from "./serverAiProvider";
import { buildGenerateBriefRequest, buildGenerateNextMovesRequest } from "./aiGenerationRoute";

describe("server AI provider adapter", () => {
  it("reads provider config from server environment placeholders", () => {
    expect(
      readOpenAiProviderConfig({
        OPENAI_API_KEY: "test-key",
        AI_PROVIDER_MODEL: "test-model",
        OPENAI_RESPONSES_ENDPOINT: "https://example.test/responses"
      })
    ).toEqual({
      apiKey: "test-key",
      model: "test-model",
      endpoint: "https://example.test/responses"
    });
  });

  it("can disable provider calls for local demo validation", () => {
    expect(
      readOpenAiProviderConfig({
        OPENAI_API_KEY: "test-key",
        OPENAI_MODEL: "test-model",
        FRIEND_CRM_DISABLE_PROVIDER: "1"
      })
    ).toEqual({
      apiKey: undefined,
      model: "test-model",
      endpoint: "https://api.openai.com/v1/responses"
    });
  });

  it("builds a structured output request without contact values", () => {
    const request = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const body = buildOpenAiExtractorBody(request, "test-model");
    const serialized = JSON.stringify(body);

    expect(body).toMatchObject({
      model: "test-model",
      store: false,
      text: { format: { type: "json_schema", strict: true } }
    });
    expect(serialized).toContain("Claire Dawson");
    expect(serialized).not.toContain("mira@example.com");
    expect(serialized).not.toContain("555-0134");
  });

  it("uses strict structured-output compatible optional fields", () => {
    const request = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const body = buildOpenAiExtractorBody(request, "test-model") as {
      text: {
        format: {
          schema: {
            properties: {
              suggestions: { items: { anyOf: Array<{ required: string[]; properties: Record<string, unknown> }> } };
              dates: { items: { required: string[]; properties: Record<string, unknown> } };
            };
          };
        };
      };
    };
    const openLoopSchema = body.text.format.schema.properties.suggestions.items.anyOf.find((schema) =>
      schema.required.includes("dueAt")
    );
    const dateSchema = body.text.format.schema.properties.dates.items;

    expect(openLoopSchema?.required).toEqual([
      "kind",
      "personId",
      "title",
      "description",
      "dueAt",
      "basis",
      "sensitivity"
    ]);
    expect(openLoopSchema?.properties.dueAt).toEqual({ type: ["string", "null"] });
    expect(dateSchema.required).toEqual(["label", "date", "confidence"]);
    expect(dateSchema.properties.date).toEqual({ type: ["string", "null"] });
  });

  it("parses Responses API output text as JSON", () => {
    const parsed = parseOpenAiJsonPayload(
      JSON.stringify({
        output_text: JSON.stringify({
          summary: "Ada prefers concise context.",
          suggestions: [],
          dates: [],
          safetyFlags: []
        })
      })
    );

    expect(parsed).toMatchObject({ summary: "Ada prefers concise context." });
  });

  it("strips null provider optionals before local validation", () => {
    const parsed = parseOpenAiJsonPayload(
      JSON.stringify({
        output_text: JSON.stringify({
          summary: "Ada prefers concise context.",
          suggestions: [
            {
              kind: "openLoop",
              personId: "p-ada",
              title: "Send names.",
              description: null,
              dueAt: null,
              basis: "Ada asked.",
              sensitivity: "normal"
            }
          ],
          dates: [{ label: "next Friday", date: null, confidence: "medium" }],
          safetyFlags: []
        })
      })
    );

    expect(JSON.stringify(parsed)).not.toContain("null");
    expect(parsed).toMatchObject({
      suggestions: [{ title: "Send names." }],
      dates: [{ label: "next Friday", confidence: "medium" }]
    });
  });

  it("calls the configured endpoint and returns parsed provider output", async () => {
    const request = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const fetchImpl: ProviderFetch = async () => ({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          output_text: JSON.stringify({
            summary: "Ada prefers concise context.",
            suggestions: [],
            dates: [],
            safetyFlags: []
          })
        })
    });
    const provider = createOpenAiExtractorProvider(
      { apiKey: "test-key", model: "test-model", endpoint: "https://example.test/responses" },
      fetchImpl
    );

    await expect(provider(request)).resolves.toMatchObject({ summary: "Ada prefers concise context." });
  });

  it("fails closed when no server API key is configured", async () => {
    const request = buildExtractMemoryRequest(seedData.notes[0], seedData.people);
    const provider = createOpenAiExtractorProvider({}, async () => {
      throw new Error("Should not call fetch without a key.");
    });

    await expect(provider(request)).rejects.toThrow("OPENAI_API_KEY");
  });

  it("calls the OpenAI-compatible brief provider", async () => {
    const request = buildGenerateBriefRequest(seedData, seedData.people[0]);
    const fetchImpl: ProviderFetch = async (_url, init) => {
      expect(String(init.body)).toContain("friend_crm_generate_brief");
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            output_text: JSON.stringify({
              snapshot: "Ada brief.",
              remember: [],
              openLoops: [],
              avoid: [],
              goodNextMove: "Send a note.",
              sensitivityWarning: ""
            })
          })
      };
    };
    const provider = createOpenAiBriefProvider({ apiKey: "test-key", model: "test-model" }, fetchImpl);

    await expect(provider(request)).resolves.toMatchObject({ snapshot: "Ada brief." });
  });

  it("calls the OpenAI-compatible next-moves provider", async () => {
    const request = buildGenerateNextMovesRequest(seedData, seedData.people[0], "close intro loop");
    const fetchImpl: ProviderFetch = async (_url, init) => {
      expect(String(init.body)).toContain("friend_crm_generate_next_moves");
      return {
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            output_text: JSON.stringify({
              moves: [
                {
                  type: "message",
                  draft: "Send the names.",
                  rationale: "Ada asked.",
                  risk: "low",
                  riskReason: "Expected."
                }
              ],
              sensitivityWarning: ""
            })
          })
      };
    };
    const provider = createOpenAiNextMovesProvider({ apiKey: "test-key", model: "test-model" }, fetchImpl);

    await expect(provider(request)).resolves.toMatchObject({ moves: [{ draft: "Send the names." }] });
  });

  it("fails closed for brief and next-moves providers without keys", async () => {
    const briefProvider = createOpenAiBriefProvider({}, async () => {
      throw new Error("Should not call fetch.");
    });
    const nextMovesProvider = createOpenAiNextMovesProvider({}, async () => {
      throw new Error("Should not call fetch.");
    });

    await expect(briefProvider(buildGenerateBriefRequest(seedData, seedData.people[0]))).rejects.toThrow(
      "OPENAI_API_KEY"
    );
    await expect(nextMovesProvider(buildGenerateNextMovesRequest(seedData, seedData.people[0], "test"))).rejects.toThrow(
      "OPENAI_API_KEY"
    );
  });
});
