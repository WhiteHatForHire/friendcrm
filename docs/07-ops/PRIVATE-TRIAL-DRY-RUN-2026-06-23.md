# PRIVATE-TRIAL-DRY-RUN-2026-06-23.md

**Date:** 2026-06-23  
**Tester:** Codex simulated/anonymized dry run  
**Dataset:** Existing seed data plus synthetic smoke notes  

---

# Summary

The prototype is ready for a human private-data trial, provided the tester follows the anonymization and export-before-delete rules in `PRIVATE-REAL-DATA-TRIAL-KIT.md`.

This was not a real private-data trial. No real relationship data was added to the repo.

---

# Readiness Notes

- Capture now routes through local AI HTTP transport in development.
- Review still requires explicit user acceptance before durable memories/open loops are saved.
- Generated briefs show source status and can be copied.
- Generated next moves remain drafts with Copy/Add controls.
- JSON export is schema-versioned.
- JSON import accepts both versioned and older raw exports.
- Import preview appears before replacing local data.
- UI smoke helper can be run with `npm run smoke:ui`.

---

# Recommended Human Trial Setup

1. Reset Seed if synthetic browser smoke data should be cleared.
2. Export the clean seed or current dataset.
3. Add 10 real or anonymized people.
4. Capture 25 notes.
5. Accept/reject/edit review suggestions.
6. Generate briefs for at least 3 people.
7. Generate next moves for at least 5 people.
8. Export JSON and Markdown.
9. Import the JSON and review preview counts.
10. Record only anonymized findings.

---

# Trial Risks To Watch

- Briefs may surface private context too prominently.
- Generated next moves may feel too generic without real provider-backed generation.
- Import preview counts may be too coarse for confidence before replacement.
- Local browser storage is still fragile for valuable data.

---

# Current Recommendation

Run the private real-data trial next, then decide whether schema migration/versioning or provider quality is the bigger blocker.
