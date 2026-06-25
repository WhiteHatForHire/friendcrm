const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const checks = [];

await check("extract-memory route accepts synthetic private-desk note", async () => {
  const body = await postJson("/api/ai/extract-memory", {
    note: {
      id: "n-provider-trial",
      personIds: ["p-provider-trial"],
      occurredAt: "2026-06-23",
      sourceType: "manual",
      rawText: "Rae prefers a tight agenda and asked me to send the intro names next Friday.",
      sensitivity: "normal",
      createdAt: "2026-06-23T00:00:00.000Z"
    },
    people: [
      {
        id: "p-provider-trial",
        name: "Rae Synthetic",
        aliases: [],
        relationshipTypes: ["friend"],
        sensitivity: "normal"
      }
    ]
  });

  assert(body.ok === true, "Expected extract-memory ok response");
  assert(Array.isArray(body.response.suggestions), "Expected suggestions array");
});

await check("generate-brief route accepts synthetic context", async () => {
  const body = await postJson("/api/ai/generate-brief", {
    person: {
      id: "p-provider-trial",
      name: "Rae Synthetic",
      relationshipTypes: ["friend"],
      sensitivity: "normal"
    },
    memories: [
      {
        text: "Prefers tight agendas.",
        category: "preference",
        confidence: "high",
        sensitivity: "normal"
      }
    ],
    openLoops: [{ title: "Send intro names.", description: "Rae asked for three intro names.", status: "open" }],
    recentNotes: [],
    nextMoves: []
  });

  assert(body.ok === true, "Expected generate-brief ok response");
  assert(typeof body.response.snapshot === "string" && body.response.snapshot.length > 0, "Expected snapshot");
});

await check("generate-next-moves route returns drafts, not sends", async () => {
  const body = await postJson("/api/ai/generate-next-moves", {
    person: {
      id: "p-provider-trial",
      name: "Rae Synthetic",
      relationshipTypes: ["friend"],
      sensitivity: "normal"
    },
    objective: "follow up on the requested intro names",
    context: {
      memories: [],
      openLoops: [{ title: "Send intro names.", description: "Rae asked for three intro names.", status: "open" }],
      recentNotes: []
    }
  });

  assert(body.ok === true, "Expected generate-next-moves ok response");
  assert(Array.isArray(body.response.moves), "Expected generated moves");
  assert(body.response.moves.every((move) => typeof move.draft === "string"), "Expected draft text only");
});

await check("invalid route payload remains rejected", async () => {
  const response = await fetch(`${baseUrl}/api/ai/generate-next-moves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nope: true })
  });

  assert(response.status === 422, `Expected invalid payload 422, got ${response.status}`);
});

console.log("# Friend CRM Provider Local Trial\n");
console.log(`Target: ${baseUrl}`);
console.log("Payloads: synthetic only");
console.log("");
checks.forEach((item) => {
  console.log(`- ${item.ok ? "PASS" : "FAIL"} ${item.name}${item.error ? `: ${item.error}` : ""}`);
});

if (checks.some((item) => !item.ok)) {
  process.exitCode = 1;
}

async function postJson(path, payload) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  assert(response.ok, `Expected ${path} 2xx, got ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, ok: true });
  } catch (error) {
    checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
