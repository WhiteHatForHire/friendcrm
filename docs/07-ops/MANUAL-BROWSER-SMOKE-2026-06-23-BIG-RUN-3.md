# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-3.md

**Date:** 2026-06-23  
**Tester:** Codex browser smoke  
**Target:** `http://127.0.0.1:5174/`

---

# Summary

The third smoke pass verified that the browser UI now exercises the Vite development AI HTTP routes.

---

# Checks Completed

- App loaded on the People view.
- Person rail Brief opened successfully.
- Brief panel showed `Validated HTTP brief route`.
- Reflection Log opened successfully.
- Cmd/Ctrl+Enter captured a synthetic note.
- Review panel opened successfully.
- Review panel showed `Validated HTTP extractor route`.
- Repeatable smoke helper passed with `npm run smoke:ui`.

---

# Findings

- Browser UI is now wired through local HTTP for extraction and brief generation.
- Local mock/fallback behavior still works without a real provider key.
- Browser local storage includes synthetic smoke-test notes; use Reset Seed before a clean manual trial.

---

# Follow-Ups

- Wire next-move generation through HTTP is complete in code path but should be included in the next manual smoke pass.
- Add schema migration/versioning follow-up work before changing storage engines.
