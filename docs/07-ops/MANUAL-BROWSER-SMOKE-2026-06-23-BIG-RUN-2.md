# MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-2.md

**Date:** 2026-06-23  
**Tester:** Codex browser smoke  
**Target:** `http://127.0.0.1:5174/`

---

# Summary

The second smoke pass verified the newly wired generated brief panel, Settings surface, and development AI HTTP transport after the second large hardening run.

---

# Checks Completed

- App loaded on the People view.
- Person rail Brief button opened the generated/fallback brief panel.
- Brief panel showed:
  - Refresh control.
  - Copy control.
  - Source status.
  - Snapshot, Remember, Open Loops, Avoid, and Good Next Move sections.
- Settings opened from primary navigation.
- Settings still showed JSON export, Markdown export, Import JSON, Reset Seed, and prototype trial targets.
- Local AI HTTP route smoke succeeded:
  - `POST /api/ai/generate-brief`
  - Returned `200`.
  - Returned validated mock brief output.

---

# Findings

- The generated brief UI is usable as an ephemeral review/copy surface.
- The development HTTP mount works without a provider key by using safe local mock behavior.
- Browser local storage still included synthetic data from earlier smoke testing, so visible counts may differ from a fresh seed reset.

---

# Follow-Ups

- Provider adapters for generated briefs and next moves were added in the third hardening run.
- Add automated browser-level regression tests after the UI stabilizes further.
- Run the private real-data trial with anonymized reporting.
