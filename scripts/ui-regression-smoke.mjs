const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";

const checks = [];

await check("app shell loads", async () => {
  const response = await fetch(baseUrl);
  assert(response.ok, `Expected app shell 200, got ${response.status}`);
  const html = await response.text();
  assert(html.includes("root"), "Expected Vite root element in HTML");
});

await check("brief route returns validated mock output", async () => {
  const payload = {
    person: { id: "p-ada", name: "Ada Nkrumah", relationshipTypes: ["friend"], sensitivity: "normal" },
    memories: [{ text: "Prefers tight memos.", category: "preference", confidence: "high", sensitivity: "normal" }],
    openLoops: [],
    recentNotes: [],
    nextMoves: []
  };
  const response = await post("/api/ai/generate-brief", payload);
  assert(response.status === 200, `Expected brief route 200, got ${response.status}`);
  const body = await response.json();
  assert(body.ok === true, "Expected brief route ok response");
  assert(body.response.snapshot.length > 0, "Expected brief snapshot");
});

await check("extract-memory route returns source-backed review suggestions", async () => {
  const payload = {
    note: {
      id: "n-smoke",
      personIds: ["p-ada"],
      occurredAt: "2026-06-23",
      sourceType: "manual",
      rawText: "Ada prefers tight memos and asked me to send the three names next week.",
      sensitivity: "normal",
      createdAt: "2026-06-23T00:00:00.000Z"
    },
    people: [{ id: "p-ada", name: "Ada Nkrumah", aliases: [], relationshipTypes: ["friend"], sensitivity: "normal" }]
  };
  const response = await post("/api/ai/extract-memory", payload);
  assert(response.status === 200, `Expected extract-memory route 200, got ${response.status}`);
  const body = await response.json();
  assert(body.ok === true, "Expected extract-memory route ok response");
  assert(Array.isArray(body.response.suggestions), "Expected review suggestions array");
  assert(body.response.suggestions.length > 0, "Expected at least one review suggestion");
});

await check("next-move route returns editable drafts", async () => {
  const payload = {
    person: { id: "p-ada", name: "Ada Nkrumah", relationshipTypes: ["friend"], sensitivity: "normal" },
    objective: "close the intro loop",
    context: { memories: [], openLoops: [], recentNotes: [] }
  };
  const response = await post("/api/ai/generate-next-moves", payload);
  assert(response.status === 200, `Expected next-move route 200, got ${response.status}`);
  const body = await response.json();
  assert(body.ok === true, "Expected next-move route ok response");
  assert(body.response.moves.length > 0, "Expected at least one generated move");
  assert(body.response.moves.every((move) => typeof move.draft === "string"), "Expected editable draft text");
});

await check("malformed AI route JSON is rejected", async () => {
  const response = await fetch(`${baseUrl}/api/ai/generate-brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{bad json"
  });
  assert(response.status === 400, `Expected malformed JSON 400, got ${response.status}`);
});

await check("non-POST AI route calls are rejected", async () => {
  const response = await fetch(`${baseUrl}/api/ai/generate-brief`);
  assert(response.status === 405, `Expected non-POST route 405, got ${response.status}`);
});

await check("unknown AI routes are rejected", async () => {
  const response = await post("/api/ai/unknown", {});
  assert(response.status === 404, `Expected unknown route 404, got ${response.status}`);
});

console.log(`# Friend CRM UI Smoke\n`);
checks.forEach((item) => {
  console.log(`- ${item.ok ? "PASS" : "FAIL"} ${item.name}${item.error ? `: ${item.error}` : ""}`);
});

if (checks.some((item) => !item.ok)) {
  process.exitCode = 1;
}

async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, ok: true });
  } catch (error) {
    checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

async function post(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
