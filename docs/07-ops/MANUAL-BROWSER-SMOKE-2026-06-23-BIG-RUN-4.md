# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-4.md

**Date:** 2026-06-23  
**Tester:** Codex with Playwright browser regression  
**Target:** `http://127.0.0.1:5174/`  

---

# Summary

Browser-level regression passed after adding the Playwright helper at `scripts/browser-regression.mjs`.

The run used seeded/synthetic data only. No private relationship data was entered.

---

# Checks Completed

- App shell loaded.
- Generated brief rendered.
- Generated next move was edited before Add.
- Edited next move appeared in the Next Moves list.
- Synthetic note was captured.
- Review suggestions opened and accepted suggestions saved.
- Synthetic note delete confirmation worked.
- JSON export download triggered.
- Valid schema-versioned JSON import showed preview.
- Person delete consequence panel opened.

---

# Validation Commands

```bash
npm run smoke:ui
npm run regression:browser
```

---

# Findings

- Pass: generated next moves are now editable drafts before add.
- Pass: import preview path still works after schema migration registry changes.
- Pass: browser regression covers the core playable path without real provider keys.
- Watch: import preview should become more informative before high-value private restores.

---

# Follow-Ups

- Run the human private-data trial.
- Improve import preview confidence.
- Run provider-backed local AI trial only with server-side env keys.
