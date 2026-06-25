import type { ExtractMemoryProvider } from "./aiExtractorRoute";
import { runExtractMemoryRoute } from "./aiExtractorRoute";
import { validateExtractMemoryRequest } from "./aiExtractorSchema";
import type { GenerateBriefProvider, GenerateNextMovesProvider } from "./aiGenerationRoute";
import {
  runGenerateBriefRoute,
  runGenerateNextMovesRoute,
  mockGenerateBriefProvider,
  mockGenerateNextMovesProvider
} from "./aiGenerationRoute";
import { validateGenerateBriefRequest, validateGenerateNextMovesRequest } from "./aiGenerationSchema";

export type AiHttpProviders = {
  extractMemory: ExtractMemoryProvider;
  generateBrief?: GenerateBriefProvider;
  generateNextMoves?: GenerateNextMovesProvider;
};

export async function handleAiHttpRequest(request: Request, providers: AiHttpProviders): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, errors: [{ path: "$", message: "Method must be POST." }] }, 405);
  }

  const url = new URL(request.url);
  const bodyResult = await readJsonBody(request);

  if (!bodyResult.ok) {
    return jsonResponse(bodyResult, 400);
  }

  if (url.pathname === "/api/ai/extract-memory") {
    const requestValidation = validateExtractMemoryRequest(bodyResult.value);

    if (!requestValidation.ok) {
      return jsonResponse(requestValidation, 422);
    }

    const result = await runExtractMemoryRoute(requestValidation.value, providers.extractMemory);
    return jsonResponse(result, result.ok ? 200 : 422);
  }

  if (url.pathname === "/api/ai/generate-brief") {
    const requestValidation = validateGenerateBriefRequest(bodyResult.value);

    if (!requestValidation.ok) {
      return jsonResponse(requestValidation, 422);
    }

    const result = await runGenerateBriefRoute(
      requestValidation.value,
      providers.generateBrief ?? mockGenerateBriefProvider
    );
    return jsonResponse(result, result.ok ? 200 : 422);
  }

  if (url.pathname === "/api/ai/generate-next-moves") {
    const requestValidation = validateGenerateNextMovesRequest(bodyResult.value);

    if (!requestValidation.ok) {
      return jsonResponse(requestValidation, 422);
    }

    const result = await runGenerateNextMovesRoute(
      requestValidation.value,
      providers.generateNextMoves ?? mockGenerateNextMovesProvider
    );
    return jsonResponse(result, result.ok ? 200 : 422);
  }

  return jsonResponse({ ok: false, errors: [{ path: "$", message: "Unknown AI route." }] }, 404);
}

async function readJsonBody(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; errors: Array<{ path: string; message: string }> }> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return { ok: false, errors: [{ path: "$", message: "Request body must be valid JSON." }] };
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
