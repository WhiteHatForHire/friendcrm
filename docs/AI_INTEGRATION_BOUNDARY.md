# Friend CRM - AI Integration Boundary

This document defines how real AI may enter Friend CRM.

It is a contract for future implementation. It does not add production infrastructure, real API keys, or a provider dependency.

---

# Core Rule

The database owns facts. AI proposes structure and language. The user confirms anything that becomes durable memory.

AI output is never automatically saved as a memory, open loop, next move, or relationship fact.

---

# Phase 1 AI Scope

The first real AI integration should be limited to the Memory Extractor.

Allowed:

- Convert one user-entered note into proposed memories.
- Convert one user-entered note into proposed open loops.
- Suggest dates and safety flags.
- Return source-backed basis text for every proposed durable item.
- Mark sensitive/private suggestions when the note contains sensitive content.

Not allowed:

- Scraping private messages.
- Automated sending.
- Hidden scoring.
- Relationship surveillance.
- Saving suggestions without explicit user review.
- Logging raw personal notes in production.

---

# Route Contract

## `POST /api/ai/extract-memory`

Future server-side route for extracting source-backed suggestions from one note.

The exact framework is undecided. In Vite, this may require a small backend or migration to a framework with server routes. Do not add that infrastructure until the persistence/backend decision is made.

### Request

```ts
type ExtractMemoryRequest = {
  note: {
    id: string;
    personIds: string[];
    occurredAt: string;
    sourceType: "manual" | "call" | "dinner" | "meeting" | "text_summary" | "memory";
    rawText: string;
    sensitivity: "normal" | "sensitive" | "private";
  };
  people: Array<{
    id: string;
    name: string;
    aliases: string[];
    relationshipTypes: string[];
    city?: string;
    summary?: string;
    sensitivity: "normal" | "sensitive" | "private";
  }>;
};
```

Request rules:

- Send only the note being reviewed and the minimum needed person context.
- Do not send the entire local database.
- Do not include contact values unless a future use case specifically requires them.
- Do not include unrelated notes.

### Response

```ts
type ExtractMemoryResponse = {
  summary: string;
  suggestions: Array<
    | {
        kind: "memory";
        personId: string;
        text: string;
        category: "preference" | "life_context" | "boundary" | "history" | "interest" | "risk" | "other";
        basis: string;
        confidence: "low" | "medium" | "high";
        sensitivity: "normal" | "sensitive" | "private";
      }
    | {
        kind: "openLoop";
        personId: string;
        title: string;
        description?: string;
        dueAt?: string;
        basis: string;
        sensitivity: "normal" | "sensitive" | "private";
      }
  >;
  dates: Array<{
    label: string;
    date?: string;
    confidence: "low" | "medium" | "high";
  }>;
  safetyFlags: Array<{
    type: "sensitive" | "private" | "risky_suggestion";
    reason: string;
  }>;
};
```

Response rules:

- `personId` must match a submitted person.
- `basis` must be a short quote or paraphrase grounded in `note.rawText`.
- `date` and `dueAt` must be ISO `YYYY-MM-DD` when present.
- Empty arrays are valid.
- The route should return structured JSON only.

---

# Validation Rules

Before AI output can reach the review UI, validate it.

Reject the response if:

- It is not valid JSON.
- It does not match the response schema.
- It references a person ID not sent in the request.
- A suggestion lacks a source-backed `basis`.
- A memory category is outside the allowed enum.
- Confidence, risk, or sensitivity values are outside allowed enums.
- Dates are malformed.
- Output includes instructions to send, scrape, manipulate, coerce, or evade consent.

Degrade gracefully:

- Show a non-destructive error state.
- Keep the raw user note intact.
- Let the user retry.
- Offer deterministic local suggestions as fallback if available.
- Do not save partial AI output unless the user explicitly accepts valid items.

---

# Review And Save Flow

1. User creates a note.
2. App sends the note and minimal person context to the server route.
3. Server calls the AI provider.
4. Server validates the response.
5. UI shows proposed memories/open loops with source basis and sensitivity labels.
6. User accepts, edits, or rejects each item.
7. Only accepted items become durable records.

Durable records must retain:

- `personId`
- `sourceNoteId`
- accepted text/title/description
- sensitivity
- confidence when applicable

---

# Prompt Logging Policy

Production logging must not include:

- Raw note text.
- Full prompts.
- Full AI responses containing personal data.
- Contact values.
- Private/sensitive relationship details.

Allowed production logs:

- Request ID.
- Route name.
- Timestamp.
- Latency.
- Provider/model identifier.
- Token counts if available.
- Validation success/failure category.
- Non-sensitive error class.

Development logging:

- Raw prompts may be logged only in local development when explicitly enabled.
- The default must be no raw personal-data logging.
- Any debug flag must be documented and excluded from committed secrets.

---

# API Keys And Secrets

- Do not commit real API keys.
- Keep provider keys server-side only.
- Use `.env.local` or deployment secret storage for real keys.
- Keep `.env.example` limited to placeholder names.
- Never expose provider keys to the browser bundle.

Suggested placeholder:

```bash
AI_PROVIDER_API_KEY=
AI_PROVIDER_MODEL=
```

---

# Testing Expectations

Before implementation is considered complete:

- Schema validation accepts a valid extractor response.
- Schema validation rejects malformed dates and unknown person IDs.
- Schema validation rejects invalid enum values.
- Route handles provider failure without data loss.
- UI saves only accepted suggestions.
- Rejected suggestions do not persist.
- No tests require real API keys.

---

# Open Questions

- Which backend shape should host server-side AI: small standalone backend, Vite-adjacent server, Next.js migration, or hosted function?
- Which provider/model should be used first?
- Should deterministic local suggestions remain always available as fallback?
- Should rejected suggestions be stored for auditability or discarded?
