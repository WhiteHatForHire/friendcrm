# Friend CRM - Architecture

## Principle

The database owns facts. The AI proposes structure and language. The user confirms anything that becomes durable memory.

## Recommended stack

For a fast standalone repo:

- Frontend: Next.js App Router or Vite React.
- Styling: Tailwind plus a small component layer.
- Data: SQLite with Prisma, or Supabase Postgres if remote access matters.
- AI: server route calling OpenAI or Anthropic.
- Auth: none for local demo; single-user login later.

## Data model

```ts
type RelationshipType =
  | "friend"
  | "collaborator"
  | "mentor"
  | "client"
  | "family"
  | "romantic"
  | "ex"
  | "weak_tie"
  | "community"
  | "other";

type Warmth = "cold" | "cool" | "neutral" | "warm" | "hot";

type Sensitivity = "normal" | "sensitive" | "private";

type Person = {
  id: string;
  name: string;
  aliases: string[];
  relationshipTypes: RelationshipType[];
  city?: string;
  contactMethods: ContactMethod[];
  importance: 1 | 2 | 3 | 4 | 5;
  warmth: Warmth;
  trust: 1 | 2 | 3 | 4 | 5;
  strategicRelevance: 1 | 2 | 3 | 4 | 5;
  sensitivity: Sensitivity;
  lastContactAt?: string;
  nextContactAt?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
};

type ContactMethod = {
  type: "phone" | "email" | "instagram" | "twitter" | "signal" | "whatsapp" | "other";
  value: string;
};

type RelationshipNote = {
  id: string;
  personIds: string[];
  occurredAt: string;
  sourceType: "manual" | "call" | "dinner" | "meeting" | "text_summary" | "memory";
  rawText: string;
  sensitivity: Sensitivity;
  createdAt: string;
};

type Memory = {
  id: string;
  personId: string;
  sourceNoteId: string;
  text: string;
  category: "preference" | "life_context" | "boundary" | "history" | "interest" | "risk" | "other";
  confidence: "low" | "medium" | "high";
  confirmed: boolean;
};

type OpenLoop = {
  id: string;
  personId: string;
  sourceNoteId?: string;
  title: string;
  description?: string;
  dueAt?: string;
  status: "open" | "planned" | "done" | "dropped";
};

type NextMove = {
  id: string;
  personId: string;
  type: "message" | "invite" | "intro" | "apology" | "ask" | "support" | "check_in" | "collaboration";
  draft: string;
  rationale: string;
  risk: "low" | "medium" | "high";
  status: "idea" | "queued" | "done" | "dismissed";
};
```

## AI workflow

### Add note

1. User writes raw note.
2. Server sends note to Memory Extractor.
3. AI returns structured proposed memories, promises, dates, and sensitivities.
4. UI shows review screen.
5. User accepts, edits, or rejects each item.
6. Accepted items become durable records.

### Generate brief

1. User opens person detail.
2. Server retrieves recent notes, memories, open loops, and next moves.
3. AI generates a concise brief.
4. Brief is ephemeral unless user saves it.

### Generate next move

1. User chooses a person and objective.
2. Server sends confirmed context plus objective.
3. AI returns 2-3 options with risks.
4. User copies or edits manually. MVP never sends automatically.

## Privacy model

- Default all data to local/private.
- Provide export as JSON and Markdown.
- Provide hard delete by person and by note.
- Label sensitive and private notes visibly.
- Do not log prompts containing raw personal data in production.

## Testing

Minimum tests:

- Memory extraction schema validation.
- Person CRUD.
- Note CRUD.
- Accept/reject extracted memory.
- Open loop creation.
- Brief generation route handles missing data.
- Export includes all records.
- Delete person removes or detaches related records safely.

