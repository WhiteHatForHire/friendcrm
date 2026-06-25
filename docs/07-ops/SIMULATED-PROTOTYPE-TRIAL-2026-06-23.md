# SIMULATED-PROTOTYPE-TRIAL-2026-06-23.md

**Date:** 2026-06-23  
**Tester:** Codex simulated trial  
**Dataset:** 10 people / 25 notes  
**Method:** Automated domain-flow simulation using seeded people, simulated notes, extractor shell, review persistence, radar, briefs, export, note delete, and person delete.

---

# Summary

Friend CRM is a playable prototype with focused fixes needed before it becomes a convincing daily-use demo. The core loop holds together: realistic notes can produce source-backed review suggestions, accepted records persist, Radar and briefs have useful context, and export/delete behavior is testable. The biggest gaps are not basic CRUD anymore; they are real provider-backed AI quality, faster capture/review ergonomics, richer brief/next-move generation, and a persistence/backup decision beyond local storage.

---

# Trial Coverage

- 10 seeded people exercised.
- 25 total notes exercised: 5 seed notes plus 20 simulated realistic notes.
- At least 10 confirmed memories were present after review.
- At least 8 open loops were present after review.
- 5 active next moves were present after adding trial moves.
- Sensitive/private people and notes were included.
- Radar was exercised for overdue loops and opportunities.
- Briefs were generated for Ada, Lena, and Ravi.
- JSON export was exercised through serialization.
- Markdown export was exercised through `exportMarkdown`.
- Note deletion was exercised and removed source-backed records.
- Person deletion was exercised on disposable test data and removed the test person.

Automated coverage lives in `src/lib/prototypeTrial.test.ts`.

---

# Scores

| Area | Score | Notes |
| --- | ---: | --- |
| People management | 4 | The 10-person seeded set supports varied relationship types, sensitivity, warmth, trust, importance, city, and summaries. |
| Capture speed | 3 | The domain flow handles repeated capture, but the UI still needs speed polish, keyboard shortcuts, and better no-suggestion handling. |
| Review trust | 4 | Accepted records stay source-backed and editable before save. The review shell preserves deterministic fallback. |
| Radar usefulness | 4 | Overdue loops and opportunities surface from realistic data. Prioritization still needs manual review in the browser. |
| Plot Board usefulness | 3 | Next move status flow works, but copy/edit and generation are still basic. |
| Brief usefulness | 3 | Deterministic briefs include useful context and boundaries, but they are list-like and not yet provider-generated. |
| Export/delete confidence | 4 | Markdown/JSON export and source-backed note deletion passed the simulation. |
| Overall repeat-use likelihood | 5 | The product loop is coherent enough to keep testing with more realistic sessions. |

**Readiness score:** 30 / 40  
**Interpretation:** Playable with focused fixes.

---

# Top Friction

- Real AI is not integrated yet; current extraction uses a validated shell with mock/deterministic behavior.
- Capture and review need speed controls for repeated use: keyboard shortcuts, faster accept/reject, and clearer missed-extraction states.
- Briefs are useful but mechanical; they need provider-backed language, copy/edit affordances, and stronger sensitive-context warnings.
- Plot Board needs better next-move creation and editing before it feels like a daily planning surface.
- Persistence is still local browser storage, so backup, restore, and storage failure behavior need a decision before wider use.

---

# Missing Product Behavior

- Server-only real provider adapter for the Memory Extractor.
- Real provider-backed pre-meeting brief generation.
- Real provider-backed next-move generation with alternatives and risk explanations.
- Manual in-browser trial notes from actual UI use.
- Persistence/backup decision beyond local storage.

---

# Trust / Privacy Concerns

- Real provider integration must keep raw notes server-side only and avoid prompt logging.
- Sensitive/private context appears in exports and briefs, which is correct but needs strong user-visible warnings.
- Local storage is acceptable for prototype play, but fragile for valuable personal memory.

---

# Best Signals

- Source-backed memory and open-loop review is now the right center of gravity.
- The app can support enough data to make Radar and briefs meaningful.
- Delete behavior removes source-backed records as expected.
- The AI integration boundary is staged correctly: validate first, provider later.

---

# Recommended Next Hopper Items

1. Add a real server-only provider adapter behind the validated extractor shell.
2. Tighten capture and review UX from trial findings.
3. Add provider-backed brief and next-move generation behind the same privacy boundary.
4. Decide persistence and backup path.
5. Run a manual browser demo polish and regression pass.
