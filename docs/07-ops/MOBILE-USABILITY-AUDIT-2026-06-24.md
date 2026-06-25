# MOBILE-USABILITY-AUDIT-2026-06-24.md — Mobile Audit And Fix Report

Date: 2026-06-24

Purpose: audit Friend CRM mobile usability, implement the highest-impact fixes, and add repeatable mobile browser regression coverage.

---

# Scope

Audited mobile behavior for:

- App shell and navigation
- People list and inline profile editor
- Person Rail / selected dossier
- Reflection Log capture
- Review Panel
- Plot Board
- Settings data-safety flows
- Browser regression coverage

Viewport used for phone QA:

- `390x844`

Tablet and deeper responsive work remains future polish.

---

# Audit Method

- Read `PROJECT.md`, `AGENTS.md`, `NEXT-IN-HOPPER.md`, current source, and mobile CSS.
- Ran parallel read-only audit agents for:
  - Mobile layout/visual issues
  - Mobile workflow/touch issues
  - Mobile regression/QA gaps
- Captured before screenshots.
- Implemented manager-approved high-impact fixes.
- Captured after screenshots.
- Added mobile browser regression and wired it into `npm run demo:check`.

---

# Key Findings

## P0

- Mobile shell consumed too much vertical space before core content.
- People cards lost meaning when table headers disappeared.
- Mobile regression only checked final page overflow; it did not run true mobile workflows.
- Review workflow was desktop-covered but not mobile-covered.

## P1

- Reflection Log put the person picker before the note composer on mobile.
- Plot Board depended visually on desktop drag/status buttons even though mobile users should use the select.
- Settings showed safety-critical actions too low after secondary panels.
- Settings and Reflection appended the full selected-person rail on mobile, creating excessive scroll.

## P2 / Parked

- Person Rail still deserves a future mobile drawer/bottom-sheet design.
- Inline profile editor is still long on mobile and should eventually become grouped/collapsible.
- Tablet breakpoint coverage should be added separately.

---

# Implemented Fixes

## Mobile Shell

- Reduced small-phone chrome density.
- Hid nonessential app-chrome labels at small widths.
- Kept mobile nav to one compact row at small widths.
- Hid brand tagline on small phones.

## People Cards

- Added real mobile-visible labels for:
  - Vibe
  - Do Not Fumble
  - Last Seen
  - Why Now
- This replaces reliance on hidden table headers and CSS-generated label text.

## Reflection Log

- Reordered mobile layout so the composer appears before the person picker.
- Kept person picker available below the composer.
- Added mobile regression coverage for composer order and review launch.

## Review Panel

- Made mobile review behave as a full-height sheet.
- Stacked mobile header/footer actions.
- Increased mobile review controls to touch-friendly sizing.
- Added mobile regression coverage for editing a suggested memory and saving it.

## Plot Board

- Removed large mobile column min-height.
- Hid drag handles and extra card status buttons on touch layouts.
- Kept the status select as the mobile-friendly move control.
- Added mobile regression coverage for moving a card via select.

## Settings

- Moved export/import actions directly after the export warning.
- Hid selected-person rail on mobile Settings and Reflection views.
- Added mobile regression coverage that Settings actions are reachable and data-safety text is visible.

## QA Automation

- Added `scripts/mobile-browser-regression.mjs`.
- Added `npm run regression:mobile`.
- Wired mobile regression into `npm run demo:check`.
- Mobile regression captures screenshots into:
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-people.png`
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-people-added.png`
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-review-panel.png`
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-person-rail.png`
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-plot-board.png`
  - `docs/07-ops/mobile-usability-audit-2026-06-24/mobile-settings.png`

---

# Screenshot Evidence

Before screenshots:

- `docs/07-ops/mobile-usability-audit-2026-06-24/before-mobile-people.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/before-mobile-plot.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/before-mobile-reflection.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/before-mobile-settings.png`

After screenshots:

- `docs/07-ops/mobile-usability-audit-2026-06-24/after-mobile-people.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/after-mobile-plot.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/after-mobile-reflection.png`
- `docs/07-ops/mobile-usability-audit-2026-06-24/after-mobile-settings.png`

All after screenshots reported `overflow=0`.

---

# Validation

Passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5180 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile`
- `npm run demo:check`

`npm run demo:check` now includes:

- Unit tests
- Build
- UI smoke
- Desktop browser regression
- Mobile browser regression

---

# Remaining Mobile Follow-Ups

- Design a true mobile Person Rail drawer or bottom sheet.
- Convert the inline profile editor into grouped/collapsible mobile sections.
- Add tablet breakpoint screenshots/regression at `768x1024` and `834x1112`.
- Consider a mobile-specific bottom nav if real use shows current top nav still consumes too much space.
- Consider collapsing Settings secondary panels after repeated mobile use.
