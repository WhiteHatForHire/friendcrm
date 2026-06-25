# PROVIDER-LOCAL-TRIAL.md — Server-Side AI Trial

Use this trial to check the local AI HTTP boundary with synthetic data.

This is not a private-data trial. Do not paste real private notes into this harness.

---

# Goal

Verify that the local server-side AI route boundary can exercise:

- `POST /api/ai/extract-memory`
- `POST /api/ai/generate-brief`
- `POST /api/ai/generate-next-moves`

The trial also checks that invalid route payloads are rejected.

---

# Setup

Start Vite with server-side environment variables only:

```bash
OPENAI_API_KEY="..." npm run dev -- --host 127.0.0.1
```

Optional model override:

```bash
OPENAI_MODEL="gpt-4.1-mini" OPENAI_API_KEY="..." npm run dev -- --host 127.0.0.1
```

Do not commit `.env.local`, real keys, provider logs, or private notes.

---

# Run

With the app running:

```bash
npm run trial:provider
```

Set a different target when needed:

```bash
FRIEND_CRM_BASE_URL="http://127.0.0.1:5174" npm run trial:provider
```

---

# Data Rules

- Use synthetic payloads only.
- Do not use private relationship data.
- Do not use scraped messages.
- Do not store provider responses that contain private data.
- Record only anonymized findings in ops docs.

---

# Pass Criteria

- Extract-memory route returns a valid structured response.
- Brief route returns a valid brief.
- Next-moves route returns draft text only.
- Invalid route payloads are rejected.
- Deterministic fallback remains available when provider output fails validation.

---

# Follow-Up

After a provider-backed run, record:

- Whether the output felt materially better than the mock/deterministic behavior.
- Any validation failures.
- Any privacy discomfort.
- Whether prompt or schema changes are needed before real private use.
