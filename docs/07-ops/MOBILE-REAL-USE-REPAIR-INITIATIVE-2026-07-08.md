# MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md

This initiative captures real-device feedback from the Friend CRM mobile prototype and turns it into an implementation-ready repair plan.

The goal is to make the mobile app feel like a usable private relationship desk, not a shell where core sections look empty or unclear after creating a new person.

---

# Source Feedback

Observed on a real iPhone local/dev install:

- Creating a new person works, but the new person's `Remember`, `Loose Threads`, `Things Remembered`, `Unfinished Business`, and `Next Moves` areas are empty with no clear path to fill them.
- The app does not make it obvious how to turn a note/debrief into confirmed memories, open loops, or next moves for a newly created person.
- Dossier editing is awkward because the keyboard covers important controls and there is no easy, obvious way to dismiss it.
- Adding a person via the `Add a suspect` field has the same keyboard-dismissal problem.
- The `Recommended Approach` text can feel random or wrong for a sparse/new profile.
- The `Sensitive` privacy value wraps badly, with the final `e` falling to a new line in at least one compact surface.
- `Share Local JSON Export` appears to work through the share/copy sheet, but the success state and copy confirmation are unclear.

---

# Product Diagnosis

The mobile app has the correct high-level nouns: people, notes, memories, open loops, next moves, and export. The problem is that the new-person path does not yet teach or support the full loop:

1. Add a person.
2. Add a debrief/note about that person.
3. Review suggested or manual memories/open loops.
4. Confirm durable records.
5. Add or generate next moves.
6. See those records reflected in the Dossier.

Seeded demo people look fuller because they already have seeded memories, loops, and moves. A new person starts empty, so the Dossier exposes blank sections without giving the user useful next actions.

---

# Scope

This is a mobile app repair initiative under `apps/mobile/`.

Do:

- Improve empty states and call-to-action paths for newly created people.
- Add or expose manual creation paths for memories, open loops, and next moves.
- Make note/debrief capture clearly feed reviewable relationship records.
- Fix keyboard dismissal and keyboard-safe layout.
- Fix privacy/sensitivity label wrapping.
- Improve export/share confirmation.
- Validate on local iPhone dev build.

Do not:

- Add message scraping.
- Add automated sending or outreach.
- Add hidden scoring.
- Save AI-generated durable memory without explicit user confirmation.
- Commit secrets, private data, or real user records.
- Require hosted Supabase sync for this fix.
- Require EAS/TestFlight for validation unless explicitly requested.

---

# Implementation Plan

## 1. Reproduce And Map Current Flow

Create a fake person such as `Johnny Test`.

Walk through:

- People add flow.
- Dossier edit flow.
- Debrief/note flow.
- Review flow.
- Plot Board next-move creation.
- Evidence Locker export/share.

Capture what the app currently does for a brand-new person with no related records.

## 2. Make New-Person Empty States Actionable

Replace dead-end empty states with action-oriented panels.

Examples:

- `No confirmed memories yet.` should offer `Add a memory` or `Capture a debrief`.
- `No open loops.` should offer `Add a loose thread`.
- `No next moves.` should offer `Plan a move`.
- `Recommended Approach` for sparse people should say that the dossier needs more context rather than inventing a strong recommendation.

Acceptance criteria:

- A newly created person never shows a core section that feels broken or abandoned.
- Each empty Dossier section has a clear next action.
- Sparse-profile recommendations are honest and useful.

## 3. Add Manual Record Creation For Mobile

Add simple on-device creation paths for:

- Confirmed memory.
- Open loop / loose thread.
- Next move.

These can be compact inline forms or modal/sheet forms, but they must be easy to dismiss and must update the Dossier immediately.

Acceptance criteria:

- A user can create a person and add at least one memory without using seeded data.
- A user can create a person and add at least one open loop without using seeded data.
- A user can create a person and add at least one next move without using seeded data.
- Created records persist after app restart.
- Created records appear in JSON export.

## 4. Make Debrief To Review Legible

The mobile app should explain the relationship between debrief notes and durable records.

Acceptance criteria:

- After adding a note/debrief, the user gets a clear next step.
- Review makes clear that memories/open loops are not durable until confirmed.
- The user can confirm, reject, or skip suggestions if suggestions exist.
- If no extraction/suggestions are available, the app offers manual memory/open-loop creation.

## 5. Fix Keyboard Ergonomics

Make text entry feel native and calm.

Acceptance criteria:

- Keyboard can be dismissed with a visible `Done`/`Save` action where appropriate.
- Tapping outside inputs dismisses the keyboard where safe.
- Dossier multiline fields remain visible while typing.
- Add-person input and submit button are not trapped under the keyboard.
- Important submit/save controls are reachable on iPhone-sized screens.
- No keyboard fix causes accidental data loss.

Potential implementation targets:

- `KeyboardAvoidingView`
- `Keyboard.dismiss()`
- `InputAccessoryView` or a simple keyboard toolbar
- More explicit `returnKeyType`, `submitBehavior`, and save buttons
- Scroll-to-focused-input behavior if needed

## 6. Fix Compact Label Wrapping

Privacy/sensitivity labels must not split awkwardly.

Acceptance criteria:

- `Sensitive` never wraps as `Sensitiv` + `e`.
- `Private`, `Normal`, `Sensitive`, and key status labels fit on compact screens.
- Labels may use smaller text, fixed min width, no-wrap behavior, or shorter copy only if meaning stays clear.

## 7. Clarify Export / Share Outcome

Keep mobile export simple, but make the result understandable.

Acceptance criteria:

- `Share Local JSON Export` opens the native share sheet.
- If copy/share completes, the app shows a visible success message.
- If share is dismissed or fails, the app shows a plain-language status.
- Export status does not imply cloud backup.

## 8. Local Device Validation

Validate with local iPhone dev build, not EAS/TestFlight by default.

Commands:

```bash
cd apps/mobile
npm run check
npm run ios:device:dev
```

Manual smoke:

- Install/launch `Friend CRM Dev`.
- Clear local evidence or reset to sample data.
- Create a new fake person.
- Dismiss keyboard from add-person flow.
- Edit official story in Dossier and dismiss keyboard.
- Add one memory.
- Add one loose thread.
- Add one next move.
- Confirm each appears in Dossier.
- Restart app and confirm persistence.
- Share local JSON export and confirm status copy.

---

# Suggested PR Breakdown

## PR 1: Keyboard And Compact Layout Repairs

- Keyboard-safe mobile shell.
- Dossier text-entry dismissal.
- Add-person keyboard dismissal.
- Privacy label wrapping fix.

## PR 2: New-Person Empty State Actions

- Better Dossier empty states.
- Honest sparse-profile recommended approach.
- CTA routing to capture/manual creation.

## PR 3: Manual Memory / Loose Thread / Next Move Creation

- Minimal forms.
- Persistence.
- Dossier update.
- Export inclusion.

## PR 4: Debrief / Review Legibility

- Post-note next-step messaging.
- Confirm/reject/skip clarity.
- Manual fallback when no suggestions exist.

## PR 5: Export Share Confidence

- Share success/failure/dismissed status.
- Manual test notes.

---

# Completion Definition

This initiative is complete when a tester can start from a blank or newly added person and successfully build a useful dossier on device:

- profile context,
- at least one remembered fact,
- at least one loose thread,
- at least one next move,
- keyboard does not trap them,
- labels do not visibly break,
- export/share status is understandable,
- and the app can be rebuilt locally as `Friend CRM Dev`.

---

# Implementation Status

## 2026-07-08 — Implemented In Local Dev Build

Implemented the first mobile repair pass in `apps/mobile/`.

Completed:

- Added keyboard-aware shell behavior and visible `Done Typing` controls on text-heavy mobile flows.
- Added manual Dossier quick-add forms for:
  - confirmed memories,
  - loose threads/open loops,
  - next moves.
- Created source notes behind manually added memories and open loops so new durable records remain traceable.
- Made new-person and sparse-profile Dossier states actionable.
- Replaced sparse-profile recommended approach with honest copy instead of generic advice.
- Added share/export success, dismissal, and failure status copy.
- Prevented compact stats, badges, and chips from awkward one-letter wrapping such as `Sensitive` breaking across lines.
- Updated the mobile brief fallback copy for people with no context.

Validation:

- `cd apps/mobile && npm run check` passed.
- `cd apps/mobile && npm run ios:device:dev` built, installed, and launched `Friend CRM Dev`.

Remaining:

- Human real-device smoke should create a new fake person and verify the full loop by hand on iPhone.

## 2026-07-09 — Next-Stage Native Build Receipt

Completed during the next-stage directive run:

- Re-read project truth, ADRs, hopper state, the 2026-07-09 QA receipt, and the Expo mobile instructions.
- Verified the mobile repair implementation is present for new-person Dossier quick-adds, source-backed manual memories/loose threads, queued next moves, AsyncStorage persistence, and schema-versioned JSON export.
- `npm run mobile:check` passed.
- `cd apps/mobile && npm run ios:device:dev` passed, installed, and launched `Friend CRM Dev` with bundle `com.symposiumstudios.friendcrm.dev` on the connected iPhone.
- Added the demo path and smoke receipt at `docs/07-ops/MOBILE-REAL-USE-DEVICE-SMOKE-2026-07-09.md`.

Remaining:

- Codex could not complete the hands-on physical iPhone UI/share-sheet smoke because the phone screen is not inspectable/tappable from this workspace.
- A human should complete the fake-person checklist in the 2026-07-09 receipt before cutting any future release build.
