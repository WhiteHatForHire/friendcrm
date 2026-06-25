# PROVIDER-LOCAL-TRIAL-2026-06-23-BIG-RUN-5.md

**Date:** 2026-06-23  
**Tester:** Codex synthetic route trial  
**Target:** `http://127.0.0.1:5174/`  
**Data:** Synthetic only  

---

# Summary

The synthetic provider-boundary trial passed against the local development AI HTTP routes.

This run did not add or commit any real API key. If the running Vite server does not have `OPENAI_API_KEY` in its server environment, the routes use the safe local mock providers. That means this report verifies the route boundary and payload shape, not real provider quality.

---

# Checks Completed

- Extract-memory route accepted a synthetic relationship note.
- Generate-brief route accepted synthetic context.
- Generate-next-moves route returned draft text only.
- Invalid route payload was rejected.

---

# Command

```bash
npm run trial:provider
```

---

# Result

Pass.

---

# Follow-Ups

- Run the same command with Vite started from a shell that has `OPENAI_API_KEY` set server-side.
- Record only anonymized output quality findings.
- Do not use real private relationship notes until provider quality and privacy posture feel trustworthy.
