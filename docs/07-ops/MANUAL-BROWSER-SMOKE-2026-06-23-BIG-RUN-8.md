# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-8.md

**Date:** 2026-06-23  
**Tester:** Codex with Playwright browser regression  
**Target:** `http://127.0.0.1:5174/`  

---

# Summary

Browser-level regression passed after extracting Plot Board and adding board status-move coverage.

The regression now resets browser local storage to seed data at the start of each run so repeated runs do not depend on previous browser state.

---

# Checks Completed

- App shell loaded from seed data.
- Generated brief rendered.
- Generated next move was edited before Add.
- Reflection Log capture readiness still worked.
- Synthetic note was captured and accepted through review.
- Synthetic note delete confirmation worked.
- Plot Board moved a card from Idea to Queued.
- JSON export download triggered.
- Valid schema-versioned JSON import showed richer preview details.
- Backup Current JSON download triggered from import preview.
- Person delete consequence panel opened.
- Mobile viewport had no horizontal page overflow.

---

# Validation Commands

```bash
npm run smoke:ui
npm run trial:provider
npm run regression:browser
```

---

# Findings

- Pass: Plot Board extraction preserved status movement.
- Pass: browser regression is more repeatable because it resets local storage to seed data.
- Pass: core playable paths remained stable.

---

# Follow-Ups

- Run the private real-data trial.
- Run provider-boundary trial with an actual server-side key.
- Extract Person Rail only if the boundary can stay clean.
