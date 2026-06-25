# Friend CRM - AI HTTP Transport

Friend CRM now has framework-neutral HTTP-style handlers for AI route shells.

This is not production infrastructure. It is a transport boundary mounted in Vite development middleware and reusable by a future small server, hosted function, or framework route.

---

# Routes

Implemented route paths:

- `POST /api/ai/extract-memory`
- `POST /api/ai/generate-brief`
- `POST /api/ai/generate-next-moves`

The handler lives in:

- `src/lib/aiHttpTransport.ts`

The development mount lives in:

- `vite.config.ts`

Tests live in:

- `src/lib/aiHttpTransport.test.ts`
- `src/lib/browserAiClient.test.ts`
- `scripts/ui-regression-smoke.mjs`
- `scripts/provider-local-trial.mjs`

---

# Behavior

The transport:

- Accepts JSON request bodies.
- Rejects non-POST requests.
- Returns JSON responses.
- Uses `Cache-Control: no-store`.
- Validates request payload shape before provider or mock execution.
- Delegates provider output validation to route/controller shells.
- Returns `422` for invalid provider output.
- Returns `422` for syntactically valid but invalid request payloads.
- Returns `400` for malformed request JSON.
- Returns `404` for unknown AI routes.
- Uses safe local mock providers when no server-side provider key is configured.
- Uses OpenAI-compatible providers only when `OPENAI_API_KEY` is available to the server process.
- Feeds the browser UI through a small client adapter so capture/review, generated briefs, and generated next moves can use the same HTTP boundary in development.

---

# Provider Boundary

Provider keys must remain server-only.

The OpenAI-compatible provider adapters live in:

- `src/lib/serverAiProvider.ts`

Do not import provider-key code into browser-only UI modules.

---

# Local Smoke

Start Vite:

```bash
npm run dev -- --host 127.0.0.1
```

Then call a route:

```bash
node --input-type=module -e "const r=await fetch('http://127.0.0.1:5174/api/ai/generate-brief',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({person:{id:'p-ada',name:'Ada Nkrumah',relationshipTypes:['friend'],sensitivity:'normal'},memories:[],openLoops:[],recentNotes:[],nextMoves:[]})}); console.log(r.status); console.log(await r.text());"
```

Run the synthetic provider-boundary trial:

```bash
npm run trial:provider
```

Provider trial instructions live in:

- `docs/07-ops/PROVIDER-LOCAL-TRIAL.md`

---

# Next Work

1. Add a true browser automation runner when the prototype needs repeatable DOM-level regression tests.
2. Add production transport only after deployment/backend direction is explicit.
3. Keep deterministic fallback available.
4. Do not create production infrastructure until explicitly requested.
