# UI/UX And Functionality Audit — 2026-06-23

**Target:** `http://127.0.0.1:5175/`  
**Mode:** Local provider-disabled trial server  
**Tester:** Codex manager + three read-only audit agents

---

# Summary

The prototype is much more functional than it feels.

Core deterministic flows are passing automated regression, but the interface currently reads like a clean starter admin app instead of a branded, current, private relationship intelligence desk. The biggest product-design gap is not missing CRUD; it is confidence, delight, and intention.

The Plot Board drag/drop issue is confirmed: drag/drop is not implemented. Status-button movement works, but mouse drag does nothing and there are no `draggable` attributes or drag/drop handlers in source.

Recommended next move: run a focused UI/UX playability overhaul before the next private real-data trial.

---

# Screenshots Captured

- `docs/07-ops/ui-audit-2026-06-23/desktop-1440x1000.png`
- `docs/07-ops/ui-audit-2026-06-23/tablet-1024x900.png`
- `docs/07-ops/ui-audit-2026-06-23/mobile-390x844.png`
- `docs/07-ops/ui-audit-2026-06-23/desktop-plot-board.png`
- `docs/07-ops/ui-audit-2026-06-23/desktop-review-panel.png`
- `docs/07-ops/ui-audit-2026-06-23/desktop-settings.png`

---

# Validation Run

Passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

Browser regression results:

- App shell loads.
- Generated brief renders.
- Generated next move can be edited before add.
- Capture and review saves accepted suggestions.
- Note delete confirmation removes a captured note.
- Empty extraction keeps note and disables saving records.
- Plot Board status buttons move cards between statuses.
- Settings export and import preview work.
- Person delete panel shows consequences.
- Mobile viewport has no horizontal page overflow.

Targeted Plot Board drag trial:

- Before drag: `[2, 1, 0, 0]`
- After drag: `[2, 1, 0, 0]`
- After status-button move: `[1, 2, 0, 0]`
- Draggable cards: `0`
- Drag/drop hints: `false`

Conclusion: Plot Board supports button movement only. Drag/drop is absent.

---

# Highest-Impact Findings

## 1. Brand Feel Is Too Generic

The docs ask for a private intelligence desk that feels organized, strategic, slightly secretive, and fast to scan. The current UI has a simple black `F` mark, beige-heavy surfaces, quiet table styling, and standard admin controls.

Fix:

- Create stronger design tokens for ink, paper, signal, warning, danger, and electric-blue planning state.
- Make the sidebar feel more like a compact instrument panel.
- Add a sharper product lockup and tagline.
- Keep it private and modern, not spy-cartoon or enterprise CRM.

## 2. Palette Reads Too Beige And Clinical

The CSS leans heavily on off-white, tan, beige borders, and pale table fills. This conflicts with the design doc warning to avoid a one-note beige system.

Fix:

- Reduce beige dominance.
- Use ink surfaces and higher-contrast section hierarchy.
- Use electric blue only for selected/planning state.
- Reserve green/amber/red for relationship signal, not general decoration.

## 3. Responsive Layout Is Accidental

Desktop is usable, but tablet/mobile stacking feels like the shell simply collapsed. The right rail appears as a long stacked continuation, and the sidebar/nav can repeat in ways that feel unplanned.

Fix:

- Use an intentional responsive shell.
- Treat the person rail as a drawer or focused detail section on narrow widths.
- Use mobile row labels or card rows instead of a shrunken table.
- Use `100dvh` and container-aware layout constraints.

## 4. Plot Board Does Not Match The Interaction Promise

The board is a status board with status buttons, not a planning surface with draggable cards.

Fix:

- Implement drag/drop for desktop pointer users.
- Preserve visible status buttons as the accessible fallback.
- Add keyboard movement controls or a status menu for non-pointer users.
- Add Playwright coverage that asserts a card leaves the source column and persists after reload.

## 5. Feedback States Are Too Quiet

Brief refresh, generated move suggestion, copy actions, export downloads, inline autosaves, and person-rail capture need stronger pending/success/error feedback.

Fix:

- Add loading and disabled states for async generation.
- Add small success messages for copy/export/add actions.
- Keep note text visible until capture succeeds in the person rail.
- Show "note kept, extraction unavailable" if extraction fails.

## 6. Product Language Leaks Implementation Details

Labels like "Validated HTTP extractor route" and "Validated HTTP brief route" are accurate but not human-friendly during a trust-sensitive trial.

Fix:

- Replace route jargon with plain trust language.
- Suggested labels:
  - "Local deterministic fallback"
  - "Development server route"
  - "Server-side provider, if configured"
- Keep source-backed basis visible.
- Move debug/provider detail into a smaller disclosure.

## 7. People List Needs More Relationship Context

Rows currently show name, warmth, importance, last contact, and open-loop count. They do not yet answer "why this person matters now."

Fix:

- Show latest context snippet or open-loop title.
- Show next contact when present.
- Surface private/sensitive badges only when relevant.
- Add drift or attention markers.

## 8. Person Setup Is Too Thin For Real Playability

Quick add creates a name. Inline editing exposes only name, city, warmth, sensitivity, and summary. The MVP data model includes relationship types, importance, trust, last contact, next contact, contact methods, and more.

Fix:

- Add a compact "relationship setup" editor.
- Include importance, trust, relationship types, last contact, next contact, and sensitivity.
- Keep the editor fast and scannable.

## 9. Radar Needs Better Explanations

Radar sections show signal buckets, but empty states and row reasons are thin.

Fix:

- Add per-section empty states.
- For each row, show why it appears: overdue date, open loop, private/sensitive, low warmth, next contact, or neglected days.

## 10. Privacy Indicators Are Present But Noisy

Normal privacy badges appear frequently, which makes the truly sensitive states less distinct.

Fix:

- Badge sensitive/private records strongly.
- Make `normal` quieter or hidden in dense content.
- Add stronger boundary treatment for sensitive/private notes, memories, and loops.

---

# PR-Sized Fix Plan

## PR 1 — Branded Shell And Responsive Foundation

Goal: make the app feel intentional, current, and private-desk branded.

Acceptance criteria:

- Introduce design tokens in CSS.
- Reduce beige dominance and add stronger ink/signal hierarchy.
- Improve sidebar brand lockup.
- Make desktop, tablet, and mobile layouts intentional.
- Capture before/after screenshots at desktop, tablet, and mobile sizes.

## PR 2 — Plot Board Drag/Drop And Planning Polish

Goal: make Plot Board work the way users expect.

Acceptance criteria:

- Cards can move between columns by drag/drop on desktop.
- Status buttons remain available as accessible fallback.
- Keyboard or select/menu movement is available.
- Movement persists after reload.
- Browser regression asserts source column loses the card and destination gains it.

## PR 3 — Trustworthy Feedback States

Goal: make actions feel alive, safe, and understandable.

Acceptance criteria:

- Brief Refresh and Suggest show loading and disabled states.
- Copy/Add/Export actions show success or failure feedback.
- Person-rail capture keeps text until success.
- Extraction failure states explain that the note was kept.
- No AI-generated durable records are saved without confirmation.

## PR 4 — Relationship Setup And People List Playability

Goal: let real users configure relationship context without seed-data magic.

Acceptance criteria:

- Selected person editor includes relationship types, importance, trust, last contact, next contact, and sensitivity.
- People rows show one "why now" signal where available.
- Search/filter behavior still works.
- Browser regression covers quick add, search/filter, and inline edits.

## PR 5 — Radar And Privacy Language Polish

Goal: improve trust and usefulness before private real-data trial.

Acceptance criteria:

- Radar rows explain why they appear.
- Empty states are useful and short.
- Route/provider jargon is replaced with plain trust language.
- Sensitive/private boundaries are more visually distinct than normal records.

---

# Backlog Notes

Move PR 1 and PR 2 into active work immediately. Keep deeper product expansion parked until after the next private trial.

Do not add automated sending, scraping, hidden scoring, sales CRM language, production infrastructure, or real user data.
