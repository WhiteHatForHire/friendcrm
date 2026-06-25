import type { ExtractMemoryProvider } from "./aiExtractorRoute";
import type { ExtractMemoryRequest } from "./aiExtractorSchema";
import type { GenerateBriefProvider, GenerateNextMovesProvider } from "./aiGenerationRoute";
import type { GenerateBriefRequest, GenerateNextMovesRequest } from "./aiGenerationSchema";

export type OpenAiProviderConfig = {
  apiKey?: string;
  model?: string;
  endpoint?: string;
};

export type ProviderEnv = Record<string, string | undefined>;

export type ProviderFetch = (url: string, init: RequestInit) => Promise<{
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}>;

const defaultEndpoint = "https://api.openai.com/v1/responses";
const defaultModel = "gpt-5-mini";

export function readOpenAiProviderConfig(env: ProviderEnv): OpenAiProviderConfig {
  if (env.FRIEND_CRM_DISABLE_PROVIDER === "1" || env.FRIEND_CRM_DISABLE_PROVIDER === "true") {
    return {
      apiKey: undefined,
      model: env.OPENAI_MODEL ?? env.AI_PROVIDER_MODEL ?? defaultModel,
      endpoint: env.OPENAI_RESPONSES_ENDPOINT ?? defaultEndpoint
    };
  }

  return {
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL ?? env.AI_PROVIDER_MODEL ?? defaultModel,
    endpoint: env.OPENAI_RESPONSES_ENDPOINT ?? defaultEndpoint
  };
}

export function createOpenAiExtractorProvider(
  config: OpenAiProviderConfig,
  fetchImpl: ProviderFetch
): ExtractMemoryProvider {
  return async (request) => {
    if (!config.apiKey) {
      throw new Error("OPENAI_API_KEY is required for the OpenAI extractor provider.");
    }

    const response = await fetchImpl(config.endpoint ?? defaultEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildOpenAiExtractorBody(request, config.model ?? defaultModel))
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`OpenAI extractor request failed with HTTP ${response.status}.`);
    }

    return parseOpenAiJsonPayload(text);
  };
}

export function createOpenAiBriefProvider(
  config: OpenAiProviderConfig,
  fetchImpl: ProviderFetch
): GenerateBriefProvider {
  return async (request) => {
    if (!config.apiKey) {
      throw new Error("OPENAI_API_KEY is required for the OpenAI brief provider.");
    }

    return postOpenAiJson(
      config,
      fetchImpl,
      buildOpenAiJsonBody(
        request,
        config.model ?? defaultModel,
        "friend_crm_generate_brief",
        briefJsonSchema,
        [
          "You prepare a private pre-meeting brief from supplied context only.",
          "Be concise. Do not invent facts or internal states.",
          "Include boundaries and open loops when present.",
          "Return JSON only."
        ].join(" ")
      )
    );
  };
}

export function createOpenAiNextMovesProvider(
  config: OpenAiProviderConfig,
  fetchImpl: ProviderFetch
): GenerateNextMovesProvider {
  return async (request) => {
    if (!config.apiKey) {
      throw new Error("OPENAI_API_KEY is required for the OpenAI next-moves provider.");
    }

    return postOpenAiJson(
      config,
      fetchImpl,
      buildOpenAiJsonBody(
        request,
        config.model ?? defaultModel,
        "friend_crm_generate_next_moves",
        nextMovesJsonSchema,
        [
          "You suggest editable next moves in a personal relationship.",
          "Do not manipulate, coerce, stalk, threaten, scrape, or evade consent.",
          "Never suggest automated sending.",
          "Offer distinct options when possible: one direct, one warmer, and one careful low-pressure version.",
          "Keep the voice human, specific, and lightly cheeky without using sales CRM language.",
          "Sensitive/private context should make riskReason more cautious, not more dramatic.",
          "Return JSON only."
        ].join(" ")
      )
    );
  };
}

export function buildOpenAiExtractorBody(request: ExtractMemoryRequest, model: string) {
  return buildOpenAiJsonBody(
    request,
    model,
    "friend_crm_extract_memory",
    extractMemoryJsonSchema,
    [
      "You extract structured relationship memory from one user-entered note.",
      "Return JSON only. Do not invent facts.",
      "Every durable suggestion must include source-backed basis text from the note.",
      "Do not suggest automated sending, scraping, coercion, manipulation, surveillance, or bypassing consent."
    ].join(" ")
  );
}

function buildOpenAiJsonBody(request: unknown, model: string, name: string, schema: unknown, instructions: string) {
  return {
    model,
    store: false,
    instructions,
    input: [
      {
        role: "user",
        content: JSON.stringify(request)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema
      }
    }
  };
}

async function postOpenAiJson(config: OpenAiProviderConfig, fetchImpl: ProviderFetch, body: unknown) {
  const response = await fetchImpl(config.endpoint ?? defaultEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`OpenAI request failed with HTTP ${response.status}.`);
  }

  return parseOpenAiJsonPayload(text);
}

export function parseOpenAiJsonPayload(payload: string): unknown {
  const parsed = JSON.parse(payload) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };
  const text =
    parsed.output_text ??
    parsed.output?.flatMap((item) => item.content ?? []).find((content) => typeof content.text === "string")?.text;

  if (!text) {
    throw new Error("OpenAI response did not include output text.");
  }

  return stripNullProperties(JSON.parse(text));
}

function stripNullProperties(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripNullProperties);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== null)
      .map(([key, item]) => [key, stripNullProperties(item)])
  );
}

const extractMemoryJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "suggestions", "dates", "safetyFlags"],
  properties: {
    summary: { type: "string" },
    suggestions: {
      type: "array",
      items: {
        anyOf: [
          {
            type: "object",
            additionalProperties: false,
            required: ["kind", "personId", "text", "category", "basis", "confidence", "sensitivity"],
            properties: {
              kind: { enum: ["memory"] },
              personId: { type: "string" },
              text: { type: "string" },
              category: {
                enum: ["preference", "life_context", "boundary", "history", "interest", "risk", "other"]
              },
              basis: { type: "string" },
              confidence: { enum: ["low", "medium", "high"] },
              sensitivity: { enum: ["normal", "sensitive", "private"] }
            }
          },
          {
            type: "object",
            additionalProperties: false,
            required: ["kind", "personId", "title", "description", "dueAt", "basis", "sensitivity"],
            properties: {
              kind: { enum: ["openLoop"] },
              personId: { type: "string" },
              title: { type: "string" },
              description: { type: ["string", "null"] },
              dueAt: { type: ["string", "null"] },
              basis: { type: "string" },
              sensitivity: { enum: ["normal", "sensitive", "private"] }
            }
          }
        ]
      }
    },
    dates: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "date", "confidence"],
        properties: {
          label: { type: "string" },
          date: { type: ["string", "null"] },
          confidence: { enum: ["low", "medium", "high"] }
        }
      }
    },
    safetyFlags: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "reason"],
        properties: {
          type: { enum: ["sensitive", "private", "risky_suggestion"] },
          reason: { type: "string" }
        }
      }
    }
  }
};

const briefJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["snapshot", "remember", "openLoops", "avoid", "goodNextMove", "sensitivityWarning"],
  properties: {
    snapshot: { type: "string" },
    remember: { type: "array", items: { type: "string" } },
    openLoops: { type: "array", items: { type: "string" } },
    avoid: { type: "array", items: { type: "string" } },
    goodNextMove: { type: "string" },
    sensitivityWarning: { type: ["string", "null"] }
  }
};

const nextMovesJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["moves", "sensitivityWarning"],
  properties: {
    moves: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "draft", "rationale", "risk", "riskReason"],
        properties: {
          type: { enum: ["message", "invite", "intro", "apology", "ask", "support", "check_in", "collaboration"] },
          draft: { type: "string" },
          rationale: { type: "string" },
          risk: { enum: ["low", "medium", "high"] },
          riskReason: { type: "string" }
        }
      }
    },
    sensitivityWarning: { type: ["string", "null"] }
  }
};
