# MANUAL-BROWSER-SMOKE-2026-06-23.md

**Date:** 2026-06-23  
**Tester:** Codex browser smoke  
**Target:** `http://127.0.0.1:5174/`

---

# Summary

The current prototype loads and the main demo surfaces are reachable. The smoke pass focused on the new capture/review UX, generated next-move suggestions, Settings import/export controls, and narrow viewport behavior.

---

# Checks Completed

- App loaded on the People view.
- Reflection Log opened from primary navigation.
- Capture textarea showed the Cmd/Ctrl+Enter hint.
- Cmd/Ctrl+Enter submitted a synthetic note.
- Review panel opened with:
  - Source label.
  - Accept all / reject all controls.
  - Editable suggestions.
  - Save Accepted action.
- Review panel closed through the visible close control.
- Person rail next-move generator accepted an objective.
- Generated next-move options displayed with Copy and Add controls.
- Settings opened from primary navigation.
- Settings showed:
  - Export warning.
  - Prototype trial targets.
  - JSON export.
  - Markdown export.
  - Import JSON.
  - Reset Seed.
- Narrow viewport smoke at 390px width showed no horizontal page overflow.

---

# Findings

- The review panel accepted visible close reliably. Direct Escape behavior is implemented, but the smoke used the visible close button after a browser automation focus mismatch.
- The browser smoke mutated local browser storage by adding one synthetic note. Repo files were not affected.
- Generated next moves remain drafts and are not sent automatically.

---

# Follow-Ups

- Add UI-level browser/e2e tests later if the app grows beyond logic coverage.
- Consider an obvious "discard note" or "note saved" toast if no suggestions are extracted.
- Consider a richer generated-brief UI after provider-backed generation is ready.
