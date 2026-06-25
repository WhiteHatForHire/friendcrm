# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-5.md

**Date:** 2026-06-23  
**Tester:** Codex with Playwright browser regression  
**Target:** `http://127.0.0.1:5174/`  

---

# Summary

Browser-level regression passed after the richer import preview and Settings component extraction.

The run used seeded/synthetic data only. No private relationship data was entered.

---

# Checks Completed

- App shell loaded.
- Generated brief rendered.
- Generated next move was edited before Add.
- Synthetic note was captured and accepted through review.
- Synthetic note delete confirmation worked.
- JSON export download triggered.
- Valid schema-versioned JSON import showed richer preview details.
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

- Pass: import preview now exposes sample person names, note range, and privacy totals.
- Pass: Settings extraction preserved export/import/reset behavior.
- Pass: mobile viewport did not show horizontal page overflow in the regression run.
- Watch: real provider quality still needs a server-key run.

---

# Follow-Ups

- Run the private real-data trial.
- Run provider-boundary trial with an actual server-side key.
- Decide whether restore needs a diff or backup-before-replace flow.
