# UI-REGRESSION-SMOKE.md — Repeatable Prototype Smoke

Use this smoke whenever the UI changes in a meaningful way.

The goal is to catch broken playable paths without adding heavy browser automation before the prototype surface settles.

---

# Setup

For baseline demo readiness, run:

```bash
npm run demo:check
```

This starts a temporary local server with provider calls disabled, then runs tests, build, route smoke, and browser regression.

Manual setup when checking a running app:

1. Run `npm test`.
2. Run `npm run build`.
3. Start the app with `npm run dev -- --host 127.0.0.1`.
4. Open the local URL printed by Vite.
5. Start from seed data unless intentionally testing an imported dataset.

Automated smoke helper:

```bash
npm run smoke:ui
```

Set `FRIEND_CRM_BASE_URL` if Vite is not running on `http://127.0.0.1:5174`.

Browser regression helper:

```bash
npm run regression:browser
```

This command requires the app to be running and uses Playwright Chromium to interact with the UI.

---

# Smoke Matrix

| Area | Action | Pass Criteria |
| --- | --- | --- |
| People | Open People, search for Ada, select a person | List remains scannable and person rail updates |
| Person rail | Open Brief | Brief shows source/fallback status, warning when relevant, and Copy button |
| Person rail | Generate next moves | Draft suggestions appear, can be edited, can be copied/added, and are not sent |
| Reflection Log | Capture a note with Cmd/Ctrl+Enter | Review panel opens and note is saved |
| Reflection Log | Clear selected people | Capture button stays disabled until at least one person is selected |
| Review | Accept all, reject all, edit text, save accepted | Accepted records persist and rejected items do not |
| Review | Enter a note with no extractable item | Note stays saved and empty extraction state is clear |
| Radar | Open Radar | Neglected, overdue, protected, and opportunities sections render |
| Plot Board | Move a next move between statuses | Status updates without page reload |
| Settings | Export JSON and Markdown | Downloads trigger and private-data warning is visible |
| Settings | Import valid JSON | Import preview appears before replacement |
| Settings | Import malformed JSON | Import is blocked with validation message |
| Delete note | Delete a note with source-backed records | Source-backed memories/open loops are removed |
| Delete person | Open delete panel on a disposable person | Consequences are visible before delete |
| Responsive | Check 390px width | No horizontal page overflow |

---

# Automated Coverage

`npm run smoke:ui` covers:

- App shell loading.
- All three AI HTTP development routes.
- Malformed JSON rejection.
- Non-POST rejection.
- Unknown AI route rejection.

`npm run regression:browser` covers:

- App shell loading.
- Generated brief rendering.
- Generated next-move edit-before-add.
- Capture/review/save accepted suggestions.
- Empty extraction state for a saved note with no suggested records.
- Reflection Log capture readiness with selected-person controls.
- Note delete confirmation.
- Plot Board status move.
- JSON export download.
- JSON import preview with sample names, note range, and privacy snapshot.
- Backup-before-replace JSON download from the import preview.
- Person delete consequence panel.
- Mobile viewport horizontal overflow.

---

# Recording Results

Create a dated report under `docs/07-ops/` using:

```md
# MANUAL-BROWSER-SMOKE-YYYY-MM-DD.md

**Date:**
**Tester:**
**Target:**

## Summary

## Checks Completed

## Findings

## Follow-Ups
```

Move confirmed follow-ups into `NEXT-IN-HOPPER.md` or `FUTURE-TODO.md`.
