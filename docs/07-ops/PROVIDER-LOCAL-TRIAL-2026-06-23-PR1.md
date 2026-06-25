# PROVIDER-LOCAL-TRIAL-2026-06-23-PR1.md

**Date:** 2026-06-23  
**Tester:** Codex synthetic route trial  
**Target:** `http://127.0.0.1:5175/`  
**Data:** Synthetic only  
**Key Handling:** `OPENAI_API_KEY` was present in `.env.local`; key value was not printed or committed.

---

# Summary

The provider-backed local AI trial passed after PR 1 Provider Trial Hardening.

The run used a freshly started local Vite server so `.env.local` was loaded by the server process. Payloads were synthetic only.

---

# Command

```bash
npm run dev -- --host 127.0.0.1 --port 5175
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run trial:provider
```

---

# Result

- PASS: extract-memory route accepts synthetic private-desk note.
- PASS: generate-brief route accepts synthetic context.
- PASS: generate-next-moves route returns drafts, not sends.
- PASS: invalid route payload remains rejected.

---

# Validation

Additional validation run during the PR:

```bash
npm test
npm run build
npm run smoke:ui
```

All passed.

---

# Notes

- Provider schemas now use strict structured-output-compatible optional fields.
- Local parsing strips `null` optional fields before route output validation.
- AI HTTP transport validates request payloads before mock or provider execution.
- No private relationship data was used.
