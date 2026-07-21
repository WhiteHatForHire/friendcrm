# NEXT-IN-HOPPER.md — Active Build Queue

This document tracks the current active queue for the project.

It is not the full backlog. It is the near-term hopper: the work that should happen next, in order, to keep the project moving toward a shippable MVP.

Update this file whenever a task is completed, superseded, blocked, or moved into active work.

---

# Current Shipping Objective

Turn the current local-first Vite React MVP and Expo mobile prototype into a trustworthy, playable, branded, and App Store-safe private relationship desk: preserve the deterministic source-backed core, make new-person mobile flows actually useful, keep the Plot Board planning surface reliable, and make the UI/copy feel original enough for fake-data trial, portfolio demo, TestFlight, and eventual App Store review.

---

# Rules for This Hopper

- Keep this list small.
- Prefer 5-10 active tasks maximum.
- Each task should have clear acceptance criteria.
- Move completed work to `COMPLETED.md`.
- Move parked ideas to `FUTURE-TODO.md`.
- Do not let this become a giant backlog.
- If a task changes product direction, update `PROJECT.md` or add an ADR.
- Every meaningful PR should update the relevant ops docs.

---

# Active Tasks

## 1. Mobile Real-Use Repair Device Smoke

**Status:** Blocked On Human Physical Device UI Smoke
**Priority:** P0
**Type:** Mobile / QA / Product Repair

### Goal

Verify the implemented mobile real-use repair pass on a real iPhone and catch any remaining usability problems before another TestFlight build.

### Acceptance Criteria

- [x] `Friend CRM Dev` is installed from the latest local build.
- Create a new fake person from People.
- Confirm the add-person keyboard can be dismissed and does not trap the submit action.
- Open the new person's Dossier and confirm sparse/new-file copy is useful.
- Edit Official Story and confirm the keyboard can be dismissed without losing text.
- Add one remembered thing through Dossier quick-add.
- Add one loose thread through Dossier quick-add.
- Add one next move through Dossier quick-add.
- Confirm all three appear in the Dossier immediately.
- Restart `Friend CRM Dev` and confirm the new records persist.
- Share local JSON export and confirm the app reports shared/copied, dismissed, or failed status clearly.
- Confirm `Sensitive`, `Private`, and similar labels do not split awkwardly on device.
- Record pass/fail notes in `docs/07-ops/MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md`.

### 2026-07-09 Codex Receipt

- `npm run mobile:check` passed.
- `cd apps/mobile && npm run ios:device:dev` passed and launched `Friend CRM Dev` on the connected iPhone.
- Code-level inspection confirms the repaired new-person Dossier quick-add, AsyncStorage persistence, and export/share status paths are present.
- Receipt and demo path: `docs/07-ops/MOBILE-REAL-USE-DEVICE-SMOKE-2026-07-09.md`.
- Remaining blocker: Codex cannot inspect/tap the physical iPhone screen or native share sheet from this workspace, so the final touch-by-touch human smoke still needs Marcus or another human tester.

### 2026-07-10 Codex Receipt

- Mobile demo-data controls were tightened so People only exposes `Clear Demo Data` while local data exists, and fake-friend reset/import/export controls live in Evidence.
- `cd apps/mobile && npm run check` passed.
- Remaining touch check: clear local demo data on-device and confirm the People clear-data card disappears immediately.

## 2. Mobile App Store Copy Safety Pass

**Status:** Implemented / Blocked On Physical Device Install
**Priority:** P0
**Type:** Mobile / UX Copy / App Store

### Goal

Apply the safest high-priority recommendations from `docs/07-ops/COPY-AUDIT-APP-STORE-PARODY-2026-07-11.md` to the mobile app before the next TestFlight/App Store candidate.

### Acceptance Criteria

- [x] Primary mobile actions no longer use `suspect`, `interrogate`, `snooping`, or `target`.
- [x] Evidence includes a plain local-only/no-scraping/no-auto-outreach disclaimer.
- [x] Review flow keeps explicit approval language for memories, open loops, and next moves.
- [x] Cheeky parody copy remains in secondary labels, empty states, receipts, and flavor text rather than trust-critical destructive actions.
- [x] `cd apps/mobile && npm run check` passes.
- [ ] Local iPhone build is pushed before the next TestFlight build.

### 2026-07-11 Codex Receipt

- Mobile copy safety implementation landed in `apps/mobile/App.tsx`.
- Risky-term scan across `apps/mobile/App.tsx` and `apps/mobile/src` found no remaining `suspect`, `interrogate`, `snooping`, `target`, or `Clear Local Evidence` strings.
- `cd apps/mobile && npm run check` passed.
- `cd apps/mobile && npm run ios:device:dev` was attempted, but Xcode could not find physical device destination `00008110-000475662EF2601E`. Reconnect/unlock the iPhone before retrying.

## 3. TestFlight Processing Check And Internal Tester Setup

**Status:** Ready
**Priority:** P1
**Type:** Mobile / Release / App Store

### Goal

Confirm Apple has finished processing the uploaded Friend CRM binary and complete internal TestFlight tester setup.

### Acceptance Criteria

- App Store Connect Evidence/Plot Board fix build `1.0.0 (11)` finishes processing.
- Build appears in TestFlight for ASC app `6787891531`.
- Branded Friend CRM app icon appears in App Store Connect/TestFlight instead of the default Expo icon.
- Evidence Locker `Clear Local Evidence` no longer leaves the app stuck on `Loading private bureau...`.
- Mobile Plot Board can create a next move and reclassify it through `Bad Idea?`, `Loaded`, `Handled`, and `Never Mind`.
- Internal tester group has the intended tester emails.
- Tester install is verified on at least one device.
- Any required beta test information is completed in App Store Connect.
- `docs/07-ops/MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md` records final TestFlight availability status.

## 4. Supabase Confirmed Test Account And RLS Smoke

**Status:** Ready
**Priority:** P1
**Type:** Backend / Auth / Persistence

### Goal

Complete the first authenticated hosted sync verification with fake data now that the guarded web UI exists.

### Acceptance Criteria

- Decide whether to disable Supabase email confirmations for fake-data trial users or use a confirmed test account.
- Sign in through the Evidence Locker hosted sync panel.
- Push fake local data to hosted Supabase through the guarded UI or a matching scripted path.
- Verify own-user rows are readable after push.
- Verify a cross-owner write/read is blocked by RLS.
- Pull hosted data back into local browser storage.
- Record the smoke result in `docs/SUPABASE_BACKEND.md` without committing secrets or real data.

## 5. iOS Simulator Smoke And Mobile Screenshot Set

**Status:** Blocked On Clean Metro Port
**Priority:** P1
**Type:** Mobile / QA / Portfolio

### Goal

Run the Expo mobile prototype on the iOS simulator with a Friend CRM Metro server, verify the core flows, and capture screenshots for portfolio/demo review.

### Acceptance Criteria

- Free or choose a Metro port not already owned by another project.
- `npm run mobile:ios` or an equivalent explicit-port command opens Friend CRM content in an iOS simulator or Expo Go.
- Verify People, Dossier, Debrief, Review, Plot Board, and Evidence Locker flows.
- Capture at least 4 iOS screenshots.
- Save screenshots and notes under `docs/07-ops/`.
- Document any Expo Go, Metro, or simulator setup issues.

## 6. Hosted Fake-Data Demo Packaging

**Status:** Release Candidate Prepared / Awaiting Symposium Publication
**Priority:** P1
**Type:** Portfolio / Demo / Release

### Goal

Prepare Friend CRM for a public fake-data hosted demo so the Symposium page has a real product link.

### Acceptance Criteria

- Confirm deterministic demo mode works without real provider keys.
- [x] Package the deterministic web build with relative static assets for the
  Symposium public demo route.
- [x] Add one-click clear and restore controls for deterministic sample data.
- [x] Remove dense desktop demo telemetry chrome from the primary desk.
- [x] Add a first-run guided tour and blank-desk choice.
- [x] Simplify the public Evidence Locker through a public-build flag.
- Ensure `.env.local` and any real provider keys stay ignored.
- Add public-demo warning copy if needed.
- Run `FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check`.

### 2026-07-21 Codex Receipt

- Desktop demo polish and a front-facing audit are recorded in
  `docs/07-ops/FRONT-FACING-DEMO-AUDIT-2026-07-21.md`.
- Remaining publication decision: approve whether the hosted demo should ship
  a guided first-run tour and a simplified Evidence Locker before its static
  Symposium package is regenerated.

## 7. Walkthrough Video / GIF Capture

**Status:** Ready
**Priority:** P1
**Type:** Portfolio / Media

### Goal

Create a short walkthrough asset that makes Friend CRM easy to understand on the Symposium Studios page.

### Acceptance Criteria

- Record or script a 60-90 second walkthrough path.
- Cover People desk, note capture, Review Panel, brief, Plot Board, Poster Lab, and Evidence Locker.
- Keep fake-data-only framing visible.
- Save source notes under `docs/07-ops/`.
- Do not include real private data or provider keys.

## 8. Tablet Screenshot Contact Sheet

**Status:** Ready
**Priority:** P2
**Type:** QA / Visual Review

### Goal

Make tablet screenshot review faster by generating a contact sheet for the new tablet breakpoint artifacts.

### Acceptance Criteria

- Contact sheet includes both tablet widths.
- Contact sheet covers People, drawer, editor, Plot Board, Review Panel, and Settings.
- Saved under `docs/07-ops/tablet-breakpoint-regression-2026-06-25/`.
- Tablet regression still passes.

## 9. Project Brain Audit After Swarm

**Status:** Ready
**Priority:** P1
**Type:** Docs / Repo Health

### Goal

Audit the project brain after the large launch-demo swarm so future agents see current truth and not stale intermediate plans.

### Acceptance Criteria

- Run the Project Brain Audit Skill.
- Check `PROJECT.md`, `AGENTS.md`, `docs/07-ops/`, ADRs, and key product docs.
- Identify stale docs, stale labels, outdated next tasks, malformed markdown, and contradictions.
- Update docs where safe or create a clear audit report.

## 10. Commit / PR Readiness Review

**Status:** Ready
**Priority:** P1
**Type:** Git / Review / Release Hygiene

### Goal

Prepare the dirty worktree for a possible commit/PR by separating intended changes from unrelated or historical generated artifacts.

### Acceptance Criteria

- Review `git status --short`.
- Group intended app, script, docs, and screenshot changes.
- Identify unrelated or risky dirty files.
- Recommend commit boundaries.
- Do not commit or push unless explicitly asked.

---

# Blocked / Waiting

- Private real-data trial is intentionally parked for now by user direction on 2026-06-23.
- Private post-trial findings triage remains parked until a redacted human trial report exists.
- Physical iPhone UI smoke requires a human tester because Codex cannot inspect/tap the connected device screen or native share sheet from this workspace.

---

# Recently Moved Out

- 2026-07-11: App Store-safe parody copy audit completed; copy replacement matrix, review-safe wording guidance, App Store review notes draft, and originality feature ideas were recorded in `docs/07-ops/COPY-AUDIT-APP-STORE-PARODY-2026-07-11.md`.
- 2026-07-09: Full goal-based QA and visual audit completed; local release-candidate receipt was added under `docs/07-ops/full-qa-2026-07-09/`, Evidence Locker mobile ordering and next-move generator layout were fixed, browser audit input noise was reduced, and the provider-disabled demo baseline passed. Native iOS build/install succeeded but runtime content smoke is blocked by existing non-Friend CRM Metro servers on ports `8081` and `8083`.
- 2026-07-09: Mobile next-stage native build receipt completed; `npm run mobile:check` passed, local iPhone build/install/launch passed via `cd apps/mobile && npm run ios:device:dev`, and `docs/07-ops/MOBILE-REAL-USE-DEVICE-SMOKE-2026-07-09.md` now contains the fake-data relationship desk demo path plus the remaining human physical-device UI smoke blocker.
- 2026-07-08: Mobile Real-Use Repair implemented locally; new-person Dossier flows now have manual memory/open-loop/next-move creation, keyboard dismissal affordances, sparse-profile copy, compact label wrapping fixes, and export/share status. `npm run check` and `npm run ios:device:dev` passed, and `Friend CRM Dev` was installed/launched on iPhone.
- 2026-07-06: Friend CRM Expo TestFlight build submitted; iOS production build finished, App Store Connect app `6787891531` was created, TestFlight group was created, and the binary was uploaded for Apple processing.
- 2026-07-01: Expo Mobile Prototype Port completed; `apps/mobile/` now contains a local-first Expo app with fake-data reset, People, Dossier, Debrief/Review, Plot Board, Evidence Locker, AsyncStorage persistence, and mobile port documentation.
- 2026-06-29: Portfolio README, case study, Symposium package, and screenshot gallery were completed.
- 2026-06-25: Launch-demo confidence, full browser UI audit, mobile usability, tablet regression, Plot Board drag/drop, BuddyScan, profile media/social links, backup/restore, browser regression, and demo readiness work were completed.
