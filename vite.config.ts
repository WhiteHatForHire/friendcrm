import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { handleAiHttpRequest } from "./src/lib/aiHttpTransport";
import { mockExtractMemoryProvider } from "./src/lib/aiExtractorRoute";
import { mockGenerateBriefProvider, mockGenerateNextMovesProvider } from "./src/lib/aiGenerationRoute";
import {
  createOpenAiBriefProvider,
  createOpenAiExtractorProvider,
  createOpenAiNextMovesProvider,
  readOpenAiProviderConfig
} from "./src/lib/serverAiProvider";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), friendCrmAiTransportPlugin(env)]
  };
});

function friendCrmAiTransportPlugin(env: Record<string, string | undefined>): Plugin {
  return {
    name: "friend-crm-ai-transport",
    configureServer(server) {
      server.middlewares.use("/api/ai", async (req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const providerConfig = readOpenAiProviderConfig(env);
        const extractMemory = providerConfig.apiKey
          ? createOpenAiExtractorProvider(providerConfig, fetch)
          : mockExtractMemoryProvider;
        const generateBrief = providerConfig.apiKey
          ? createOpenAiBriefProvider(providerConfig, fetch)
          : mockGenerateBriefProvider;
        const generateNextMoves = providerConfig.apiKey
          ? createOpenAiNextMovesProvider(providerConfig, fetch)
          : mockGenerateNextMovesProvider;

        const request = new Request(`http://localhost/api/ai${req.url}`, {
          method: req.method,
          headers: requestHeaders(req.headers),
          body: req.method === "GET" || req.method === "HEAD" ? undefined : await requestBody(req)
        });
        const response = await handleAiHttpRequest(request, {
          extractMemory,
          generateBrief,
          generateNextMoves
        });

        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(await response.text());
      });
    }
  };
}

function requestHeaders(headers: Record<string, string | string[] | undefined>) {
  const nextHeaders = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      nextHeaders.set(key, value.join(", "));
    } else if (value !== undefined) {
      nextHeaders.set(key, value);
    }
  });
  return nextHeaders;
}

async function requestBody(req: { on: (event: string, callback: (chunk?: unknown) => void) => void }) {
  const chunks = await new Promise<Uint8Array[]>((resolve, reject) => {
    const collected: Uint8Array[] = [];
    req.on("data", (chunk) => {
      if (typeof chunk === "string") {
        collected.push(new TextEncoder().encode(chunk));
      } else if (chunk instanceof Uint8Array) {
        collected.push(chunk);
      }
    });
    req.on("end", () => resolve(collected));
    req.on("error", (error) => reject(error));
  });
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  chunks.forEach((chunk) => {
    merged.set(chunk, offset);
    offset += chunk.length;
  });

  return merged;
}
