# Full Browser UI Audit — 2026-06-25

This audit reviews the current Friend CRM browser experience across desktop and mobile after the latest mobile drawer, synthetic trial, and retro/zany design passes.

The goal was to look for issues that have slipped through: broken drag/drop, awkward overlays, clipped or unreadable text, odd detail-panel states, mobile scroll problems, and screens that technically work but do not yet feel launch-demo clean.

---

# Scope

## Viewports

- Desktop: `1440x1000`
- Mobile: `390x844`, touch/mobile emulation enabled

## Screens And Flows Covered

- People list
- Selected-person detail panel / mobile drawer
- Generated brief panel
- Generated next moves
- BuddyScan 3000 Poster Lab
- Delete / erase file panel
- Radar
- Plot Board before and after drag/drop
- Reflection Log
- Review Panel
- Settings / Evidence Locker
- Import preview

## Screenshot Artifacts

Screenshots live in:

- `docs/07-ops/full-browser-audit-2026-06-25/`

Contact sheets:

- `docs/07-ops/full-browser-audit-2026-06-25/desktop-contact-sheet.jpg`
- `docs/07-ops/full-browser-audit-2026-06-25/mobile-contact-sheet.jpg`

Machine-readable findings:

- `docs/07-ops/full-browser-audit-2026-06-25/findings.json`

Repeatable command:

```bash
npm run audit:browser
```

Use this with a running dev server:

```bash
FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser
```

---

# Executive Summary

No P0 launch-blocking browser defect was found in this pass. The app loads, core screens render, Plot Board drag/drop works on desktop, mobile does not show obvious horizontal overflow, and the main review/export/import surfaces are reachable.

The experience is now playful and visibly branded, but the biggest remaining issues are focus, density, and modal discipline:

- The desktop Settings / Evidence Locker screen allows the selected-person rail and destructive delete panel to stay visible beside global data-safety controls.
- The mobile person drawer works, but it needs stronger modal behavior: backdrop, background scroll lock, and clearer separation from the underlying People page.
- The mobile People file is still very long because the inline editor remains stacked below the table/list.
- Poster Lab is fun and on-brand, but the modal is dense enough that it would benefit from stronger staging and a cleaner expanded/collapsed control model.
- Automated clipping warnings are mostly caused by hidden file inputs and generic inputs, but they reveal that the audit tool should better distinguish real visible text issues from implementation controls.

---

# Interaction Results

## Validation

Passed:

- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser`

Note: launching Playwright from the restricted shell hit a macOS Chromium permission error, so the validation command was rerun with the approved browser-audit execution path.

## Passed

- App loads in desktop and mobile browser contexts.
- People list renders seeded data.
- Person detail opens and updates from row selection.
- Mobile drawer opens after selecting a person and closes with `Close file`.
- Brief generation opens the `Pre-Meeting Intel` panel.
- Generated next moves render as editable options without automatically adding them.
- Poster Lab opens and closes.
- Delete panel opens with consequence copy.
- Radar renders people and date signals.
- Plot Board drag/drop moves a card from `Bad Idea?` to `Loaded`.
- Reflection Log accepts a synthetic note and opens the Review Panel.
- Review Panel renders source-backed suggested memory/open-loop controls.
- Settings renders export/import/sample-restore surfaces.
- Import preview accepts a valid JSON payload and shows the incoming evidence preview.
- No obvious horizontal overflow appeared in the audited desktop or mobile screenshots.

## Needs Follow-Up

- Mobile drawer behavior needs backdrop/body-scroll/inert-background treatment.
- Desktop global settings should not compete with selected-person destructive state.
- The mobile People/profile editing flow needs a shorter, more sectioned layout.
- The audit scanner should skip hidden/file inputs or classify them separately.

---

# Findings

## P1 — Settings Competes With The Person Rail

**Where:** Desktop Evidence Locker / Settings.

**Evidence:**

- `desktop-settings.png`
- `desktop-import-preview.png`
- `desktop-delete-panel.png`

**What Happened:**

The global data-safety screen keeps the selected-person rail visible on desktop. If the user previously opened `Erase File`, that destructive panel remains beside export/import and restore controls.

**Why It Matters:**

Settings is the trust-critical surface for backups, imports, sample restore, and destructive data replacement. The right rail makes the screen feel louder and less controlled, especially when person deletion copy is visible at the same time as import/restore copy.

**Recommendation:**

- Hide or collapse the person rail on desktop Settings.
- Auto-close transient rail panels such as delete confirmation and pre-meeting brief when switching major app views.
- Keep Evidence Locker focused on data safety, backup, restore, and provider status.

## P1 — Mobile Drawer Needs Stronger Modal Behavior

**Where:** Mobile People selected-person drawer.

**Evidence:**

- `mobile-person-drawer.png`
- `mobile-person-brief-drawer.png`

**What Happened:**

The drawer opens and closes, but the underlying People page remains visually active in full-page captures. The selected-person file feels like a floating panel rather than a deliberately staged drawer.

**Why It Matters:**

On mobile, selected-person detail is dense and contains actions such as brief generation, generated moves, memories, open loops, delete, and profile editing. The user needs to feel like they are in one file, not juggling two layers.

**Recommendation:**

- Add a mobile drawer backdrop.
- Lock background scroll while the drawer is open.
- Close on backdrop tap and `Escape`.
- Add modal semantics or inert background handling.
- Keep the existing `Close file` control.

## P1 — Mobile People/Profile Flow Is Still Too Long

**Where:** Mobile People view.

**Evidence:**

- `mobile-people-closed-drawer.png`
- `mobile-person-drawer.png`
- `mobile-people-after-close.png`

**What Happened:**

The mobile drawer fixed the worst detail-rail problem, but the People page still includes a long inline profile editor below the list.

**Why It Matters:**

The app is usable on a phone now, but the People view still has a lot of vertical travel. A user can lose orientation after scanning the list, opening a drawer, closing it, and then landing back in a long editor area.

**Recommendation:**

- Group the profile editor into accordions or tabs on mobile.
- Keep identity fields first and move deeper metadata into collapsed subsections.
- Consider moving edit mode into the drawer for the selected person.

## P2 — Poster Lab Is Fun But Dense

**Where:** BuddyScan 3000 Poster Lab.

**Evidence:**

- `desktop-poster-lab.png`

**What Happened:**

Poster Lab fits the zany direction and supports the product personality, but the modal has a lot competing inside it: poster preview, stamps, controls, and data receipt.

**Why It Matters:**

This is one of the most differentiated surfaces in the app. It should feel like a reward moment, not another dense configuration panel.

**Recommendation:**

- Keep the poster preview as the clear hero.
- Move context receipt/details into accordions.
- Consider a larger preview-first layout on desktop.
- Keep private/sensitive context warnings visible, but reduce non-critical chrome.

## P2 — Desktop Plot Board Works But Wants Focus Mode

**Where:** Plot Board.

**Evidence:**

- `desktop-plot-board-before-drag.png`
- `desktop-plot-board-after-drag.png`

**What Happened:**

Drag/drop passed. Cards are readable and the fallback move controls remain available. The right rail, however, still competes visually with the board.

**Why It Matters:**

The Plot Board is a planning surface. It benefits from width, scanning, and low interruption. A persistent selected-person rail is useful sometimes, but not always.

**Recommendation:**

- Add a board focus mode or collapse rail affordance.
- Consider auto-collapsing transient rail states on Plot Board.
- Preserve selected-person context when a board card is selected.

## P2 — Mobile Review Panel Is Functional But Dense

**Where:** Mobile Review Panel.

**Evidence:**

- `mobile-review-panel.png`

**What Happened:**

The review panel renders and remains usable, but source-backed suggestions, sensitivity labels, and action controls stack into a long sheet.

**Why It Matters:**

This is the app's trust center for AI/deterministic extraction. It should remain calm even when several suggestions appear.

**Recommendation:**

- Keep the full-height mobile sheet.
- Consider collapsing lower-priority suggestion groups.
- Keep approve/reject/edit controls close to each suggestion.
- Preserve visible source basis and sensitivity labels.

## P2 — Settings Import/Restore Needs One More Confidence Pass

**Where:** Settings / Evidence Locker.

**Evidence:**

- `desktop-settings.png`
- `desktop-import-preview.png`
- `mobile-settings.png`

**What Happened:**

Export/import/restore surfaces are visible and usable, and the warnings are much clearer than earlier versions. The next risk is confidence: users need an unmistakable restore-from-saved-export flow and a calm destructive replacement path.

**Why It Matters:**

Before private real-data use resumes, backup and restore should feel boringly reliable.

**Recommendation:**

- Continue with the existing Backup / Restore Confidence Pass.
- Deepen browser regression around restoring a valid exported JSON payload.
- Make import/replace and restore-sample paths visually distinct.

## P3 — Audit Scanner Has False Positives Around Inputs

**Where:** Automated `findings.json`.

**Evidence:**

- `docs/07-ops/full-browser-audit-2026-06-25/findings.json`

**What Happened:**

The scan reported medium clipping warnings for `Upload profile photo` and generic `input` controls. Manual screenshot review suggests these are mostly hidden file inputs or implementation-level controls rather than visible broken button text.

**Why It Matters:**

The audit harness is useful, but noisy warnings can hide real visual bugs.

**Recommendation:**

- Teach `scripts/full-browser-audit.mjs` to ignore hidden/file inputs for clipping checks.
- Keep real button, select, textarea, and visible input clipping checks.
- Add a separate accessibility/control inventory if needed.

---

# Page Notes

## People

Desktop People is dense but readable. The branded shell, table, profile editor, and rail are all visible. Mobile People is usable but vertically long.

Recommended next polish:

- Collapse mobile profile editor sections.
- Keep People list cards scannable before showing deep editing controls.

## Person Detail

Desktop rail is useful and visually on-brand. Mobile drawer is the right direction, but needs modal discipline.

Recommended next polish:

- Backdrop and scroll lock on mobile.
- Auto-close/collapse volatile panels on view change.

## Briefs And Generated Moves

Briefs and generated moves render and remain editable. The tone is on-brand without crossing into automated outreach.

Recommended next polish:

- Keep move options compact.
- Make the generated area visually distinct from durable saved next moves.

## Radar

Radar renders clearly on desktop and mobile. It is one of the cleaner dense screens.

Recommended next polish:

- Add tablet screenshot coverage.
- Consider stronger visual hierarchy between overdue, private, and attention states.

## Plot Board

Desktop drag/drop works. Mobile uses simpler touch-safe controls and remains readable.

Recommended next polish:

- Add optional full-width/focus mode.
- Keep drag handles obvious on desktop.
- Preserve mobile non-drag controls as the primary mobile path.

## Reflection Log

Reflection Log works and opens Review Panel successfully. Mobile is long but functional.

Recommended next polish:

- Keep composer high on mobile.
- Consider collapsible history if long logs start dominating.

## Review Panel

The review modal is usable and source-backed. Mobile density is the main remaining concern.

Recommended next polish:

- Collapse lower-priority groups if many suggestions appear.
- Keep source basis visible near each approve/reject decision.

## Settings / Evidence Locker

Settings is the most important next focus area. The feature set is present, but the screen should be calmer and more isolated from person detail state.

Recommended next polish:

- Hide desktop rail on Settings.
- Deepen backup/restore browser regression.
- Make import/replace state transitions feel deliberate.

---

# Recommended Fix Order

1. Add mobile drawer backdrop, background scroll lock, backdrop close, and inert/modal semantics.
2. Hide or collapse the desktop person rail on Settings, and auto-close transient rail panels when changing major views.
3. Run the Backup / Restore Confidence Pass and deepen restore-from-export browser coverage.
4. Collapse/group the mobile profile editor so People is less scroll-heavy.
5. Tighten Poster Lab's expanded layout around a clearer preview-first hierarchy.
6. Add tablet breakpoint screenshots/regression.
7. Reduce audit scanner false positives around hidden/file inputs.

---

# Current Readiness Judgment

The prototype is playable and visually memorable. It is not sterile anymore; the zany private-intel identity is now a strength.

For a polished demo, the next work should be a focused UX confidence pass rather than a new feature: make drawers, panels, Settings, and backup/restore feel crisp and controlled. That will make the existing product feel much more finished without widening scope.
