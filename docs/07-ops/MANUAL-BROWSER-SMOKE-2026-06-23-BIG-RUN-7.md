# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-7.md

**Date:** 2026-06-23  
**Tester:** Codex with Playwright browser regression  
**Target:** `http://127.0.0.1:5174/`  

---

# Summary

Browser-level regression passed after extracting Reflection Log and tightening capture readiness.

The run used seeded/synthetic data only. No private relationship data was entered.

---

# Checks Completed

- App shell loaded.
- Generated brief rendered.
- Generated next move was edited before Add.
- Reflection Log disabled capture when no people were selected.
- Person picker All control restored selected people.
- Synthetic note was captured and accepted through review.
- Synthetic note delete confirmation worked.
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

- Pass: Reflection Log extraction preserved capture/review behavior.
- Pass: capture cannot proceed without selected people.
- Pass: core browser regression paths remained stable.

---

# Follow-Ups

- Run the private real-data trial.
- Run provider-boundary trial with an actual server-side key.
- Continue extracting large UI sections only when it clarifies ownership.
