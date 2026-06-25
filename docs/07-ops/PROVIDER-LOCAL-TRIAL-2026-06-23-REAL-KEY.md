# PROVIDER-LOCAL-TRIAL-2026-06-23-REAL-KEY.md

**Date:** 2026-06-23  
**Tester:** Codex synthetic route trial  
**Target:** `http://127.0.0.1:5175/`  
**Data:** Synthetic only  
**Key Handling:** `OPENAI_API_KEY` was present in `.env.local`; key value was not printed or committed.  

---

# Summary

A real-key local provider-boundary trial was attempted against a fresh Vite server so `.env.local` would be loaded by the server process.

Brief generation and next-move generation passed. Extract-memory failed with an OpenAI HTTP 400 from the provider adapter. The invalid-payload check also returned `200` instead of the expected `422`, which means route request validation should be tightened before provider/mock execution.

No private relationship data was used.

---

# Command

```bash
npm run dev -- --host 127.0.0.1 --port 5175
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run trial:provider
```

---

# Result

- FAIL: extract-memory route accepts synthetic private-desk note.
- PASS: generate-brief route accepts synthetic context.
- PASS: generate-next-moves route returns drafts, not sends.
- FAIL: invalid route payload remains rejected.

---

# Failure Details

- Extract-memory returned `422` with provider error: OpenAI extractor request failed with HTTP 400.
- Invalid next-move route payload returned `200` instead of `422`.

---

# Resolution

Resolved by PR 1 from `docs/07-ops/DEMO-PR-RUN-PLAN.md`: Provider Trial Hardening.

Passing follow-up report:

- `docs/07-ops/PROVIDER-LOCAL-TRIAL-2026-06-23-PR1.md`
