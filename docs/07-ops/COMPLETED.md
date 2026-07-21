# COMPLETED.md — Completed Work Log

This document tracks completed work for the project.

Use it as the project memory of what has already been created, decided, shipped, or moved out of the hopper.

Newest entries should go at the top.

---

# Format

Use this format for each completed item:

    ## YYYY-MM-DD — Title

    **Type:** Docs | Design | App | Backend | AI | Ops | Decision
    **Source:** Human | Codex | ChatGPT | Other
    **Related Files:**

    - `path/to/file.md`

    **Summary:**

    Briefly describe what was completed.

    **Follow-Ups:**

    - [ ] Optional follow-up task

---

# Completed Work

## 2026-07-21 — Front-Facing Demo Release Readiness

**Type:** App / Demo UX / QA / Release
**Source:** Human + Codex
**Related Files:**

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/components/PlotBoard.tsx`
- `src/components/ReflectionLog.tsx`
- `src/components/SettingsView.tsx`
- `src/lib/storage.ts`
- `src/styles.css`
- `docs/07-ops/FRONT-FACING-RELEASE-DIRECTIVE-2026-07-21.md`

**Summary:**

Implemented the approved front-facing release pass with a persistent first-run
choice, a 60-second curated tour, a genuinely blank desk option, guided sample
story breadcrumbs, purpose and first-action cues across the desk, and
progressive dossier detail. The public static build now uses
`VITE_PUBLIC_DEMO=1` to retain the privacy boundary, exports, restore, and
clear controls while hiding inactive hosted-sync, trial, and developer
surfaces. Fixed the onboarding dialog state so it unmounts after a choice and
does not remain exposed to assistive technology.

Follow-up release repair: raised the custom cursor trail above every app and
modal layer while keeping it non-interactive, so the visible pointer remains
usable during the first-run chooser.

Validation passed:

- `npm test` — 80 tests
- `npm run build`
- `npm run mobile:check`
- `VITE_PUBLIC_DEMO=1 npx tsc && VITE_PUBLIC_DEMO=1 npx vite build --base ./`
- `git diff --check`
- Fresh browser smoke for first-run tour, public Evidence Locker, desktop
  overflow, cursor behavior, and console errors

**Follow-Ups:**

- [ ] Complete the project browser-regression gate after the local Playwright
  browser cache finishes installing.

## 2026-07-21 — Desktop Demo Polish And Front-Facing Audit

**Type:** App / Demo UX / QA
**Source:** Human + Codex
**Related Files:**

- `src/App.tsx`
- `src/components/SettingsView.tsx`
- `src/lib/storage.ts`
- `src/styles.css`
- `docs/07-ops/FRONT-FACING-DEMO-AUDIT-2026-07-21.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Removed the dense desktop telemetry strip so Friend CRM opens directly into the
working desk. Added one-click sample-data clear and restore controls in the
sidebar and Evidence Locker. Replaced the old cursor dot trail with a rainbow
trail of arrow pointers while hiding the system cursor for desktop mouse input.
Completed a front-facing demo audit and recorded the highest-value next steps:
first-run tour, simplified public Evidence Locker, curated sample stories,
progressive dossier detail, and clearer first actions per destination.

Validation passed:

- `npm test` — 80 tests
- `npm run build`
- `npm run mobile:check`
- `git diff --check`
- Local browser clear and restore smoke, including restoration of 10 seeded
  people

**Follow-Ups:**

- [ ] Approve and implement the public-demo simplification and guided-tour
  scope before regenerating the Symposium static package.

## 2026-07-21 — Plain Friend CRM Product Name And Public-Demo Release Package

**Type:** App / Mobile / Release
**Source:** Human + Codex
**Related Files:**

- `src/App.tsx`
- `apps/mobile/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Updated the visible application product name from `Friend CRM 3000` to plain
`Friend CRM` across the web and mobile top chrome. The distinct BuddyScan 3000
feature label remains as product flavor. Rebuilt the web client as a static,
relative-asset package for the Symposium public demo, using only deterministic
fake data and local browser storage.

Validation passed:

- `npm run build -- --base=./`
- `npm test` — 80 tests
- `npm run mobile:check`

**Follow-Ups:**

- [ ] Publish the staged Symposium product, demo, privacy, and contact routes
  once its canonical production branch is clean and synchronized.

## 2026-07-20 — U.S.-Grounded Demo Roster And Fresh iPhone Dev Install

**Type:** App / Mobile / QA
**Source:** Human + Codex
**Related Files:**

- `src/data/seed.ts`
- `apps/mobile/src/core/seed.ts`
- `docs/07-ops/DEMO-CHECKLIST.md`

**Summary:**

Refreshed the built-in synthetic people roster so the demo reads as a more
natural U.S.-market relationship desk while retaining a few varied
international names. The web and mobile seed data now use the same roster,
including Claire Dawson, Maya Kline, Lauren Whitaker, and Evan Park; related
notes, exports, tests, and demo instructions were updated to match.

Both prior Friend CRM installs were removed from the connected iPhone before a
fresh local `Friend CRM Dev` build was installed and launched. The production
bundle is not installed; only `com.symposiumstudios.friendcrm.dev` remains.

Validation passed:

- `npm test` — 80 tests
- `npm run build`
- `npm run mobile:check`
- Web/mobile seed-roster parity check

**Follow-Ups:**

- [ ] Human-smoke the fresh iPhone build with the reset synthetic dataset.


## 2026-07-11 — Mobile App Store Copy Safety Pass Implemented

**Type:** Mobile / UX Copy / App Store
**Source:** Human + Codex
**Related Files:**

- `apps/mobile/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Implemented the mobile App Store copy safety pass. Primary mobile actions and labels no longer use higher-risk language such as `suspect`, `interrogate`, `snooping`, `target`, or `Clear Local Evidence`. The Evidence Locker now includes a plain local-only/no-scraping/no-auto-outreach privacy boundary, Debrief review copy emphasizes explicit approval, and Plot Board/People/Dossier labels now use safer person-file/card language while preserving the bureau parody voice.

Validation passed:

- `cd apps/mobile && npm run check`

Local iPhone install was attempted with `cd apps/mobile && npm run ios:device:dev`, but Xcode could not find the configured physical device destination `00008110-000475662EF2601E`. No TestFlight build was cut.

**Follow-Ups:**

- [ ] Reconnect/unlock the physical iPhone and rerun `cd apps/mobile && npm run ios:device:dev`.
- [ ] Human-smoke Evidence, People, Dossier, Debrief, and Plot Board copy on-device before TestFlight.

## 2026-07-11 — App Store-Safe Parody Copy Audit

**Type:** Docs / UX / Product
**Source:** Human + Codex
**Related Files:**

- `docs/07-ops/COPY-AUDIT-APP-STORE-PARODY-2026-07-11.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Audited Friend CRM's current web and mobile copy against the desired tongue-in-cheek retro bureau voice and App Store review guardrails. Created a replacement-copy matrix, identified safer wording for risky primary labels such as `suspect`, `interrogate`, `snooping`, and `target`, drafted App Store review note language, and proposed originality features including Bureau Oath, Mobile BuddyScan Lite, Relationship Receipt, Clerk Desk review queue, and Fake Data Tour Mode.

**Follow-Ups:**

- [ ] Run the Mobile App Store Copy Safety Pass.
- [ ] Decide which originality feature should ship first for the next TestFlight/App Store candidate.

## 2026-07-10 — Mobile Debrief Save And Return Flow Fixed

**Type:** Mobile / UX
**Source:** Human + Codex
**Related Files:**

- `apps/mobile/App.tsx`

**Summary:**

Fixed the mobile Debrief Booth flow so capturing a debrief explicitly saves the note, returns to the selected person's Dossier, and shows saved notes in a new `Recent Debriefs` section. This makes the debrief receipt visible immediately instead of leaving the user stranded on the capture screen wondering whether anything happened.

Validation passed:

- `cd apps/mobile && npm run check`
- `cd apps/mobile && npm run ios:device:dev`

**Follow-Ups:**

- [ ] Human-smoke one new fake-person debrief on-device and confirm it appears under `Recent Debriefs`.

## 2026-07-10 — Mobile Clear Data Stays On People

**Type:** Mobile / UX
**Source:** Human + Codex
**Related Files:**

- `apps/mobile/App.tsx`

**Summary:**

Fixed the mobile clear-demo-data flow so clearing local dummy data no longer forces the user into Evidence. The app now keeps the user on the current People/home context, empties the desk in place, and leaves Evidence as the optional home for reset/import/export controls.

Validation passed:

- `cd apps/mobile && npm run check`
- `cd apps/mobile && npm run ios:device:dev`

**Follow-Ups:**

- [ ] Human-smoke the clear-data path on-device and confirm the app remains on People.

## 2026-07-10 — Mobile Demo Data Control Placement Cleaned Up

**Type:** Mobile / UX
**Source:** Human + Codex
**Related Files:**

- `apps/mobile/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Moved mobile demo-data reset behavior into the Evidence tab as the durable control home. The People homepage now shows a temporary `Clear Demo Data` action only while local data exists, points reset/import/export users to Evidence, and removes the clear-data prompt automatically once local data is cleared. The empty Dossier fallback no longer exposes a fake-friend reload action outside Evidence.

Validation passed:

- `cd apps/mobile && npm run check`

**Follow-Ups:**

- [ ] Human-smoke the clear-data path on the local iPhone build.

## 2026-07-09 — Mobile Next-Stage Native Build And Demo Path Receipt

**Type:** Mobile / QA / Ops
**Source:** Codex
**Related Files:**

- `docs/07-ops/MOBILE-REAL-USE-DEVICE-SMOKE-2026-07-09.md`
- `docs/07-ops/MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/SUPABASE_BACKEND.md`

**Summary:**

Ran the approved next-stage mobile directive through the local-safe path. Verified the repaired mobile new-person/Dossier workflow at code level, confirmed local AsyncStorage persistence and schema-versioned JSON export paths are present, scanned mobile UI language for forbidden sales-CRM terms, passed `npm run mobile:check`, and passed a fresh local iPhone build/install/launch with `cd apps/mobile && npm run ios:device:dev`. Added a fake-data relationship desk demo path receipt for future video/GIF capture or human smoke.

The remaining touch-by-touch physical iPhone smoke is blocked because Codex cannot inspect or tap the connected phone screen/native share sheet from the workspace. Supabase/RLS remains a separate gated fake-account task because no confirmed fake test credentials or service-role credential were available in the directive context.

**Follow-Ups:**

- [ ] Human-smoke the launched `Friend CRM Dev` build on iPhone using only fake data.
- [ ] Complete the confirmed fake-account Supabase/RLS smoke after the auth/account decision.

## 2026-07-09 — Full Goal-Based QA And Visual Audit Pass

**Type:** App / QA / UX / Ops
**Source:** Codex
**Related Files:**

- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/full-browser-audit.mjs`
- `docs/07-ops/full-qa-2026-07-09/REPORT.md`
- `docs/07-ops/full-qa-2026-07-09/`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Completed a full provider-disabled QA pass across the local-first web app, synthetic browser trial, visual audit, mobile browser viewport, tablet breakpoints, and Expo mobile build path. Fixed mobile Evidence Locker ordering so local export/restore controls stay ahead of optional hosted sync, stacked the person-rail next-move objective input to prevent cramped/clipped controls, and reduced full-browser-audit input clipping noise while preserving real clipping detection.

Validation passed:

- `FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check`
- `npm test`
- `npm run build`
- `npm audit --audit-level=moderate`
- `npm run mobile:check`
- Dated `audit:browser`, `trial:synthetic:browser`, `regression:mobile`, and `regression:tablet` runs against `http://127.0.0.1:5188`

Expo iOS build/install completed, but runtime content verification is blocked by existing non-Friend CRM Metro servers occupying ports `8081` and `8083`; screenshots and details are recorded in the QA receipt.

**Follow-Ups:**

- [ ] Rerun iOS simulator smoke with a clean Friend CRM Metro server/port and capture real Friend CRM app screens.
- [ ] Complete Supabase confirmed fake-user RLS smoke.
- [ ] Do a commit/PR readiness review for the already-dirty worktree.

## 2026-07-08 — Mobile Real-Use Repair Implemented Locally

**Type:** Mobile / App / UX
**Source:** Human + Agent
**Related Files:**

- `apps/mobile/App.tsx`
- `apps/mobile/src/core/insights.ts`
- `docs/07-ops/MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Implemented the P0 mobile repair pass from real-device feedback. The Expo app now gives newly created people actionable Dossier states, manual quick-add paths for confirmed memories, loose threads/open loops, and next moves, source-backed notes for manually created memories/loops, clearer sparse-profile recommended approach copy, keyboard-aware scrolling, visible `Done Typing` controls, one-line compact privacy/status labels, and clearer local JSON share/export status.

Validation passed:

- `cd apps/mobile && npm run check`
- `cd apps/mobile && npm run ios:device:dev`

The latest `Friend CRM Dev` build installed and launched on the connected iPhone with bundle `com.symposiumstudios.friendcrm.dev`.

**Follow-Ups:**

- [ ] Human-smoke the repaired flow on iPhone with a new fake person.
- [ ] Decide whether to cut a new TestFlight build after the smoke pass.

## 2026-07-08 — Mobile Real-Use Repair Initiative Created

**Type:** Ops / Mobile / UX
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Captured real-device mobile feedback into a focused repair initiative covering new-person empty states, manual memory/open-loop/next-move creation, debrief-to-review clarity, keyboard dismissal, compact privacy label wrapping, and export/share confirmation. Moved the initiative into the active hopper as the next P0 mobile repair task.

**Follow-Ups:**

- [ ] Implement the mobile real-use repair initiative.
- [ ] Validate on local iPhone dev build as `Friend CRM Dev`.

## 2026-07-06 — Mobile Evidence Clear And Plot Board Fix Submitted

**Type:** Mobile / App / Release
**Source:** Human + Agent
**Related Files:**

- `apps/mobile/App.tsx`
- `docs/07-ops/MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Fixed the TestFlight mobile bug where Evidence Locker `Clear Local Evidence` left the app stuck on `Loading private bureau...`. The root cause was that the app treated an intentionally empty people list as if it were still loading. The app now treats only unloaded data as loading, recovers from load failures into an explicit empty desk, confirms the destructive clear action, and keeps the user on Evidence Locker after local data is cleared.

Also upgraded mobile Plot Board so it has a real on-device planning entry point: users can choose a person, create a next move, add rationale/risk, file it into `Bad Idea?`, and reclassify cards through desktop-matching labels. Built and uploaded iOS build `1.0.0 (11)` to App Store Connect/TestFlight. EAS build ID: `c22199f4-7cde-4622-a1ba-58739536e81d`; EAS submit ID: `3673b203-0049-4bcf-bc32-660e47ff6da2`.

**Follow-Ups:**

- [ ] Confirm Apple finishes processing build `1.0.0 (11)`.
- [ ] Verify Evidence Locker clear flow on a real TestFlight install.
- [ ] Verify mobile Plot Board create/reclassify flow on a real TestFlight install.

## 2026-07-06 — TestFlight App Icon Refresh Submitted

**Type:** Mobile / Design / Release
**Source:** Human + Agent
**Related Files:**

- `.easignore`
- `apps/mobile/assets/icon.png`
- `apps/mobile/assets/splash-icon.png`
- `apps/mobile/assets/favicon.png`
- `apps/mobile/assets/android-icon-background.png`
- `apps/mobile/assets/android-icon-foreground.png`
- `apps/mobile/assets/android-icon-monochrome.png`
- `apps/mobile/package.json`
- `apps/mobile/package-lock.json`
- `docs/07-ops/MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Replaced the default Expo placeholder with branded Friend CRM app icon assets, fixed EAS archive filtering for the mobile app, updated Expo to the SDK-expected patch version, rebuilt the iOS app as `1.0.0 (10)`, and uploaded the icon-refresh binary to App Store Connect/TestFlight. EAS build ID: `62462331-4f4a-4e94-8f15-48afe2c76e4d`; EAS submit ID: `c9f771bc-b70c-4093-91dd-50f5a0a3029c`. This build was later superseded by Evidence/Plot Board fix build `1.0.0 (11)`.

**Follow-Ups:**

- [x] Submit Evidence/Plot Board fix build `1.0.0 (11)`.
- [ ] Confirm the branded app icon appears in App Store Connect/TestFlight.
- [ ] Verify internal TestFlight install on a device using the current build.

## 2026-07-06 — Expo TestFlight Build Submitted

**Type:** Mobile / Release / Ops
**Source:** Human + Agent
**Related Files:**

- `apps/mobile/app.json`
- `apps/mobile/eas.json`
- `apps/mobile/.easignore`
- `docs/07-ops/MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Completed the Friend CRM iOS production EAS build and uploaded the binary to App Store Connect/TestFlight. The build used bundle ID `com.symposiumstudios.friendcrm`, EAS project `@symposiumstudios/friend-crm-mobile`, ASC app ID `6787891531`, EAS build ID `4d107817-7fbf-467d-bea8-01d8779f6945`, and EAS submit ID `6e8d4eca-0d3a-4300-ac0d-c46ea13f6ecf`. EAS also created the App Store Connect app record, registered/linked the bundle identifier, created the `Team (Expo)` TestFlight group, and enabled TestFlight access for `stephensm2011@gmail.com`.

This initial binary was later superseded by icon-refresh build `1.0.0 (10)`.

**Follow-Ups:**

- [x] Submit icon-refresh build `1.0.0 (10)` so App Store Connect/TestFlight has a branded app icon.
- [ ] Verify internal TestFlight install using the current build.
- [ ] Rename App Store Connect listing from generated `Friend CRM (c0b031)` if desired.
- [ ] Add additional internal testers and beta test notes.

## 2026-07-06 — Expo TestFlight Setup Started

**Type:** Mobile / Release / Ops
**Source:** Human + Agent
**Related Files:**

- `apps/mobile/app.json`
- `apps/mobile/eas.json`
- `docs/07-ops/MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md`
- `docs/07-ops/testflight-2026-07-06/ios-smoke-home.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Configured the Expo mobile prototype for iOS/TestFlight using the Anchor EAS/App Store pattern. Added bundle ID `com.symposiumstudios.friendcrm`, EAS build/submit profiles, EAS owner/project metadata, and a TestFlight runbook. Created and linked EAS project `@symposiumstudios/friend-crm-mobile`, ran local validation, launched the app in iOS Simulator through Expo Go, bundled successfully, and captured a smoke screenshot. The Apple 2FA/signing blocker was resolved in the follow-up TestFlight build submission run.

**Follow-Ups:**

- [x] Resume `eas build --platform ios --profile production` with Apple 2FA code available.
- [x] Let EAS manage iOS signing credentials for `com.symposiumstudios.friendcrm`.
- [x] Submit the finished build to TestFlight.
- [x] Add App Store Connect app ID, EAS build ID, submit ID, and TestFlight URL to the runbook.

## 2026-07-02 — Supabase Auth And Sync Mode UI

**Type:** App / Backend / Ops
**Source:** Human + Agent
**Related Files:**

- `src/components/HostedSyncPanel.tsx`
- `src/components/SettingsView.tsx`
- `src/App.tsx`
- `src/lib/supabaseSync.ts`
- `src/lib/supabaseSync.test.ts`
- `src/styles.css`
- `docs/SUPABASE_BACKEND.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Added a guarded hosted sync panel to Evidence Locker. The app now shows Supabase configuration/session state, supports sign-in/sign-up/sign-out, keeps local mode as the default, requires synced mode plus an explicit write arming checkbox before hosted writes, and can push/pull through the existing Supabase sync helpers. Hosted sync now filters out unconfirmed durable memories before upload.

A public-client signup smoke succeeded, but the project currently requires email confirmation and returned no session, so authenticated RLS write verification still needs a confirmed fake test account or an auth-settings decision.

**Follow-Ups:**

- [ ] Complete authenticated fake-user RLS write/read smoke.
- [ ] Decide whether fake trial accounts should require email confirmation.
- [ ] Add mobile hosted sync controls only if the Expo app continues toward a hosted trial.

## 2026-07-02 — Supabase Cloud Project And Migration Push

**Type:** Backend / Ops
**Source:** Human + Agent
**Related Files:**

- `supabase/migrations/20260701123500_initial_friendcrm_schema.sql`
- `docs/SUPABASE_BACKEND.md`
- `docs/06-decisions/0008-optional-supabase-hosted-persistence.md`
- `PROJECT.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Created and linked the hosted Supabase project `friendcrm` with project ref `mjrqxmcicoreeovitscy`, pushed the initial Friend CRM schema/RLS migration, verified local and remote migration versions match, and configured gitignored local web/mobile env files with public client values. No service-role key, database password, private data, or real user data was committed.

**Follow-Ups:**

- [ ] Verify RLS with authenticated fake users before any real-data trial.
- [ ] Move the generated database password into a password manager or reset it from Supabase.

## 2026-07-01 — Supabase Hosted Persistence Foundation

**Type:** Backend / Docs / Decision
**Source:** Human + Agent
**Related Files:**

- `supabase/config.toml`
- `supabase/migrations/20260701123500_initial_friendcrm_schema.sql`
- `supabase/seed.sql`
- `src/lib/supabaseClient.ts`
- `src/lib/supabaseSync.ts`
- `apps/mobile/src/core/supabaseClient.ts`
- `docs/SUPABASE_BACKEND.md`
- `docs/06-decisions/0008-optional-supabase-hosted-persistence.md`
- `.env.example`

**Summary:**

Added an optional Supabase hosted persistence foundation while preserving local-first demo behavior. The migration defines user-owned tables for profiles, people, notes, memories, open loops, next moves, interactions, and sync events with RLS policies keyed by `auth.uid()`. Added optional Supabase clients/sync helpers for web and mobile and documented the hosted persistence boundary.

Cloud project creation was completed in the follow-up 2026-07-02 Supabase cloud project run.

**Follow-Ups:**

- [ ] Add auth UI and a visible local/synced mode switch before enabling hosted sync in the app.

## 2026-07-01 — Expo Mobile Prototype Port

**Type:** App / Mobile / Docs
**Source:** Human + Agent
**Related Files:**

- `apps/mobile/`
- `apps/mobile/App.tsx`
- `apps/mobile/src/core/storage.ts`
- `docs/07-ops/MOBILE-EXPO-PORT-2026-07-01.md`
- `docs/07-ops/mobile-expo-port-2026-07-01-web-smoke.png`
- `PROJECT.md`
- `README.md`
- `package.json`

**Summary:**

Added a first usable Expo TypeScript mobile prototype for Friend CRM under `apps/mobile/`. The mobile app includes People, Dossier, Debrief, Review, Plot Board, and Evidence Locker flows with fake seeded data, reset/clear controls, local AsyncStorage persistence, deterministic source-backed suggestion review, JSON export/share, paste-based import, and retro private-bureau styling.

Validation passed:

- `npm --prefix apps/mobile run check`
- `npm run build`
- Expo web smoke through Playwright

**Follow-Ups:**

- [ ] Re-run `npm run mobile:ios` with Expo Go/simulator fully available and capture iOS screenshots.
- [ ] Add document-picker/file-system import/export if the mobile prototype continues.
- [ ] Extract shared core package if web and mobile both keep evolving.

## 2026-07-08 — Full App QA Self-Audit Completed

**Type:** QA / Ops
**Source:** Human + Codex
**Related Files:**

- `docs/07-ops/FULL_APP_QA_SELF_AUDIT_DIRECTIVE_2026-07-07.md`
- `docs/07-ops/full-app-qa-2026-07-07.md`
- `docs/07-ops/full-app-qa-2026-07-07-screens/`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Ran the full local app QA self-audit requested by the 2026-07-07 directive using seeded fake people and synthetic data only. Static/unit, build, demo readiness, desktop/mobile/tablet browser regressions, full browser audit, UI smoke, logic-level synthetic trial, and browser-level synthetic trial all passed. The temporary local Vite server was started with provider env vars unset and stopped after QA.

The audit found no blockers, no source/privacy violations, and no provider-backed AI run. Medium UI follow-ups remain around the narrow mobile classified tagline/top strip and the cramped right-rail generated next-move input row.

**Follow-Ups:**

- [ ] Resolve the full-app QA medium UI warnings before a private real-data trial.

## 2026-07-01 — Portfolio Screenshot Package Captured

**Type:** Design / QA / Portfolio
**Source:** Human + Codex
**Related Files:**

- `docs/07-ops/portfolio-screenshots-2026-06-29/SHOT-LIST.md`
- `docs/07-ops/portfolio-screenshots-2026-06-29/01-desktop-people-desk.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/02-desktop-person-brief.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/03-desktop-review-panel.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/04-desktop-plot-board.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/05-desktop-poster-lab.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/06-desktop-evidence-locker.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/07-mobile-people-drawer.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/08-mobile-plot-board.png`
- `docs/07-ops/portfolio-screenshots-2026-06-29/09-tablet-people-editor.png`

**Summary:**

Booted the local Friend CRM Vite app and captured the missing nine-shot
portfolio screenshot package requested for the Symposium Studios Friend CRM
product page. The package covers desktop People Desk, person briefing, review
panel, Plot Board, Poster Lab, Evidence Locker, mobile dossier, mobile Plot
Board, and tablet people editor. Browser audit scripts completed with no
blocker findings; medium warnings remain around a mobile tagline control that
may clip vertically.

**Follow-Ups:**

- [ ] Fix or soften the mobile classified-tagline control clipping warning in a future UI polish pass.

## 2026-06-29 — Portfolio README And Case Study

**Type:** Docs / Portfolio
**Source:** Human + Agent
**Related Files:**

- `README.md`
- `docs/PORTFOLIO_CASE_STUDY.md`

**Summary:**

Reworked the public repo front door and added a repo-native portfolio case study so Friend CRM reads as a Symposium-ready product artifact: a tongue-in-cheek retro relationship desk with modern local-first behavior, AI-aware workflows, browser QA, and privacy-first boundaries.

**Follow-Ups:**

- [ ] Add hosted demo URL once available.
- [ ] Record a short walkthrough video or GIF.

## 2026-06-29 — Symposium Portfolio Page Package

**Type:** Docs / Portfolio
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/SYMPOSIUM-PORTFOLIO-PAGE-PACKAGE.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Created a ready-to-paste Symposium Studios portfolio page package for Friend CRM, including hero copy, product overview, walkthrough sections, screenshot mapping, AI/privacy framing, engineering notes, postmortem copy, metadata, CTA copy, alt text, and implementation notes.

**Follow-Ups:**

- [ ] Update the public README and repo-native case study.
- [ ] Publish a hosted fake-data demo link before adding final CTA URLs.

## 2026-06-29 — Symposium Portfolio Plan And Screenshot Gallery

**Type:** Docs / Design / Ops
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/PORTFOLIO-CASE-STUDY-PLAN.md`
- `docs/07-ops/portfolio-screenshots-2026-06-29/`
- `scripts/portfolio-screenshots.mjs`
- `package.json`

**Summary:**

Created a Symposium Studios portfolio plan that positions Friend CRM as a tongue-in-cheek retro relationship desk with modern local-first functionality, AI-aware workflows, and privacy-first boundaries. Added a repeatable portfolio screenshot capture script and generated a curated nine-image gallery covering desktop, mobile, and tablet states.

**Follow-Ups:**

- [ ] Convert the plan into final Symposium Studios page copy.
- [ ] Create or update the public README and repo-native case study.
- [ ] Pick a hosted demo target and publish the deterministic fake-data demo.

## 2026-06-25 — Launch-Demo Confidence Swarm Completed

**Type:** App / Design / QA / AI / Ops
**Source:** Human + Agent Swarm
**Related Files:**

- `src/App.tsx`
- `src/styles.css`
- `src/components/DossierPosterLab.tsx`
- `src/lib/aiGenerationRoute.ts`
- `src/lib/aiGenerationRoute.test.ts`
- `scripts/demo-readiness-check.mjs`
- `scripts/tablet-browser-regression.mjs`
- `package.json`
- `docs/BACKUP_RESTORE.md`
- `docs/07-ops/DEMO-CHECKLIST.md`
- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/tablet-breakpoint-regression-2026-06-25/`
- `docs/07-ops/LAUNCH-DEMO-CONFIDENCE-SWARM-2026-06-25.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Ran the goal-based next-level swarm directive. Added tablet browser regression coverage and screenshots for `768x1024` and `834x1112`; compacted the mobile People/profile editor into disclosure sections; improved Poster Lab's preview-first staging and safety copy; tightened demo checklist and demo readiness command output; clarified backup/restore and private-trial restore docs; added AI trust coverage proving unconfirmed memories stay out of provider-bound generation context; and fixed integration issues found by the swarm.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:tablet`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Package a local demo release candidate.
- [ ] Reduce remaining medium browser-audit input warnings.
- [ ] Run a project brain audit after the swarm.

## 2026-06-25 — Audit Fix, Backup Restore Confidence, And Swarm Directive Completed

**Type:** App / Mobile UX / Data Safety / QA / Ops
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `scripts/browser-synthetic-trial.mjs`
- `scripts/full-browser-audit.mjs`
- `scripts/mobile-browser-regression.mjs`
- `docs/BACKUP_RESTORE.md`
- `docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Completed the top audit-fix and backup/restore confidence work. Mobile person detail now behaves like a modal drawer with backdrop, body scroll lock, Escape close, close-button close, and exposed-backdrop tap close. Desktop Settings / Evidence Locker now hides the person rail and major view changes reset transient rail panels such as erase-file consequences and pre-meeting briefs.

Settings now separates export and saved-export restore into clearer action cards, uses more direct restore language for destructive local replacement, and keeps sample restore distinct. Browser regressions now cover Settings rail focus, transient rail cleanup, saved-export restore labels, and mobile drawer modal controls. The full browser audit scanner now ignores hidden file inputs for clipping checks.

Added `docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md`, a goal-based, self-checking swarm directive for the next large launch-demo push.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser`

**Follow-Ups:**

- [ ] Run Tablet Breakpoint Regression And Screenshots.
- [ ] Run Mobile People/Profile Editor Compaction.
- [ ] Run Launch-Demo Confidence Swarm Run.

## 2026-06-25 — Full Browser UI Audit Completed

**Type:** QA / Design / Ops
**Source:** Human + Agent
**Related Files:**

- `scripts/full-browser-audit.mjs`
- `package.json`
- `docs/07-ops/FULL-BROWSER-UI-AUDIT-2026-06-25.md`
- `docs/07-ops/full-browser-audit-2026-06-25/`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Ran a desktop and mobile browser audit covering People, selected-person detail, briefs, generated moves, Poster Lab, delete panel, Radar, Plot Board drag/drop, Reflection Log, Review Panel, Settings, and import preview. Captured screenshots/contact sheets, verified desktop Plot Board drag/drop, confirmed no obvious horizontal overflow in the audited screens, and documented prioritized UX findings.

Added `npm run audit:browser` as a repeatable Playwright audit command. The next active hopper item at the time was a focused audit fix pass for mobile drawer modal behavior and desktop Settings rail focus; that follow-up was completed later on 2026-06-25.

Validation passed:

- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser`

**Follow-Ups:**

- [x] Run Audit Fix Pass: Drawer And Settings Focus.
- [x] Run Backup / Restore Confidence Pass after the focus issues are resolved.

## 2026-06-25 — Mobile Person Detail Drawer Completed

**Type:** App / Mobile UX / Browser QA / Ops
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/styles.css`
- `scripts/mobile-browser-regression.mjs`
- `docs/07-ops/MOBILE-PERSON-DETAIL-DRAWER-2026-06-25.md`
- `PROJECT.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Changed the selected-person detail rail into a mobile drawer on narrow screens. The drawer is closed by default, opens when adding/selecting a person or selecting a person from Radar/Plot Board, includes a mobile-only `Close file` control, and closes when changing views or using keyboard view shortcuts. Desktop rail behavior remains unchanged.

Updated mobile regression coverage to assert the drawer starts closed, opens after person selection/add, closes via the close control, and still avoids horizontal overflow.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5183 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5183 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser`
- `npm run demo:check`

**Follow-Ups:**

- [x] Run Backup / Restore Confidence Pass.
- [ ] Later, group/collapse the inline mobile profile editor if it still feels long.

## 2026-06-25 — Browser-Level Synthetic Trial Harness Completed

**Type:** QA / Browser Automation / Demo Readiness / Ops
**Source:** Human + Agent
**Related Files:**

- `scripts/browser-synthetic-trial.mjs`
- `package.json`
- `docs/07-ops/BROWSER-SYNTHETIC-TRIAL-2026-06-25.md`
- `PROJECT.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Added `npm run trial:synthetic:browser`, a Playwright browser-level synthetic trial that injects a fake 10-person / 25-note dataset into local browser storage and exercises the playable UI.

The harness verifies People dataset loading, Person Rail brief generation, editable generated next moves without auto-add, Radar signals, Plot Board status persistence, Settings JSON export/import preview, and mobile viewport overflow against fake data only.

Validation passed:

- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5182 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser`
- `npm test`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run Mobile Person Detail Drawer.
- [ ] Consider adding this harness into `npm run demo:check` only if the baseline remains fast enough.

## 2026-06-25 — Briefs And Next Moves Quality Pass Completed

**Type:** AI / Product UX / Tests / Ops
**Source:** Human + Agent
**Related Files:**

- `src/lib/aiGenerationRoute.ts`
- `src/lib/aiGenerationRoute.test.ts`
- `src/lib/serverAiProvider.ts`
- `docs/PROMPTS.md`
- `PROJECT.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Improved brief and next-move quality while preserving the existing validated JSON contract and no-auto-outreach rules. Local/mock briefs now handle sparse files with honest "thin file" guidance, keep sensitive/private warnings visible without mystery scoring, and avoid inventing context.

Generated/fallback next moves now return three distinct editable options when possible: a direct option, a warmer option, and a careful low-pressure option. Risk reasons now explain sparse context, sensitive/private context, and known boundaries more clearly. Provider prompt guidance and `docs/PROMPTS.md` were updated to ask real provider-backed generation for the same direct/warmer/careful behavior.

Validation passed:

- `npm test -- --run src/lib/aiGenerationRoute.test.ts`
- `npm test`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run Browser-Level Synthetic Trial Harness.
- [ ] Continue tuning tone after browser-level or human-trial findings.

## 2026-06-25 — Synthetic Real-Use Trial And Fallback Parser Pass Completed

**Type:** App / AI / Tests / Ops
**Source:** Human + Agent
**Related Files:**

- `src/lib/insights.ts`
- `src/lib/prototypeTrial.test.ts`
- `package.json`
- `docs/07-ops/SYNTHETIC-REAL-USE-TRIAL-2026-06-25.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`
- `PROJECT.md`

**Summary:**

Ran a repo-safe synthetic real-use trial pass. Expanded the automated prototype trial to cover 25 synthetic notes across the seeded people, generated briefs and next moves, Radar signals, source-backed records, schema-versioned JSON export/import validation, Markdown export, note deletion cleanup, and person deletion impact.

Broadened deterministic fallback extraction so local/provider-disabled mode catches more realistic relationship language such as "circle back," "book," "invite," "introduce," "owed," "appreciates," and additional sensitive-context terms. Added `npm run trial:synthetic` as a direct repeatable command and wrote the dated synthetic trial report.

Validation passed:

- `npm test -- --run src/lib/prototypeTrial.test.ts`
- `npm run trial:synthetic`
- `npm test`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run Briefs And Next Moves Quality Pass.
- [ ] Later, add a browser-level synthetic trial harness if the logic-level trial is not enough.

## 2026-06-24 — Mobile Usability Audit And Touch Pass Completed

**Type:** App / Design / QA / Ops
**Source:** Human + Agent Swarm
**Related Files:**

- `src/App.tsx`
- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/mobile-browser-regression.mjs`
- `scripts/demo-readiness-check.mjs`
- `package.json`
- `docs/07-ops/MOBILE-USABILITY-AUDIT-2026-06-24.md`
- `docs/07-ops/mobile-usability-audit-2026-06-24/`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Ran a full mobile usability audit with parallel read-only agents, before/after screenshots, implementation, and QA validation. Implemented a focused mobile touch pass: compacted the small-phone shell, added real labels to People cards, moved Reflection Log composer before the person picker on mobile, made Review Panel a full-height mobile sheet, simplified Plot Board touch status changes, moved Settings data actions higher, and hid the selected-person rail on mobile Settings/Reflection.

Added dedicated mobile browser regression coverage through `scripts/mobile-browser-regression.mjs`, `npm run regression:mobile`, and `npm run demo:check`.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5180 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Design a true mobile Person Rail drawer or bottom sheet.
- [ ] Group the inline profile editor into collapsible mobile sections.
- [ ] Add tablet breakpoint screenshots/regression.

## 2026-06-23 — Sample Dataset Reset Flow Completed

**Type:** App / Demo UX / Data Safety / Tests
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Made the sample dataset restore path clearer and safer. Settings now explains the difference between export, import/replace, and restoring the built-in fake sample data. The restore sample control lives in its own warning panel, states that it replaces local browser data rather than merging, recommends exporting first, and uses a more explicit confirmation dialog before replacing local data with seed data.

Browser regression now covers restoring sample data after local changes by importing a regression dataset, restoring the fake seed friends, and verifying the seed people return while the imported regression person disappears.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5179 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- Settings mobile overflow check
- `npm run demo:check`

**Follow-Ups:**

- [ ] Choose the next active task from `FUTURE-TODO.md` or write a fresh hopper task.

## 2026-06-23 — Review Panel Edited / Rejected Browser Coverage Completed

**Type:** Engineering / Tests / Trust UX
**Source:** Human + Agent
**Related Files:**

- `scripts/browser-regression.mjs`
- `src/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/COMPLETED.md`

**Summary:**

Expanded the Playwright browser regression to cover the source-backed review workflow more safely. The regression now captures a note that produces both a memory and an open loop, edits the memory before saving, unselects/rejects the open-loop suggestion, saves the accepted records, verifies the edited memory persists in the person rail, and verifies the rejected open-loop text stays out of the active Unfinished Business list.

Also fixed a small cursor-trail duplicate-key warning observed while running the browser suite.

Validation passed:

- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5178 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- `npm test`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run Sample Dataset Reset Flow.

## 2026-06-23 — Main Site Zany Shell And Classified States Completed

**Type:** App / Design / Ops
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/components/PlotBoard.tsx`
- `src/components/ReflectionLog.tsx`
- `src/styles.css`
- `docs/07-ops/MAIN-SITE-ZANY-CITYDESK-PROPOSAL.md`
- `docs/07-ops/main-site-zany-run-2026-06-23/desktop-people.png`
- `docs/07-ops/main-site-zany-run-2026-06-23/desktop-plot.png`
- `docs/07-ops/main-site-zany-run-2026-06-23/mobile-people.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Implemented the first controlled CityDesk-inspired main app pass from the proposal. The app now has an in-world local status chrome, classified-ad empty states for low-risk blank surfaces, a right-rail Daily Alibi bulletin, and a Social Debt Receipt panel derived only from visible local counts/dates.

Trust-critical review, privacy, delete, import/export, and AI confirmation flows were kept structurally clear. Screenshots confirmed desktop People, desktop Plot Board, and mobile People layouts have no horizontal overflow.

Validation passed:

- `npm test`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Keep remaining CityDesk widget ideas parked unless another visual-fun pass is selected.
- [ ] Run Review Panel Edited / Rejected Browser Coverage next if prioritizing demo trust.

## 2026-06-23 — Component-Level Test Coverage Completed

**Type:** Engineering / Tests
**Source:** Human + Agent
**Related Files:**

- `package.json`
- `package-lock.json`
- `src/components/PlotBoard.test.tsx`
- `src/components/PersonRail.test.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Added component interaction test infrastructure with Testing Library and jsdom, then covered two extracted UI surfaces with meaningful interactions:

- `PlotBoard`: status changes through the keyboard-friendly select and person selection from a move card.
- `PersonRail`: BuddyScan Poster Lab open/close flow, context accordion expansion, poster text copy, and proof that the joke artifact does not call save/update callbacks.

Validation passed:

- `npm test -- --run src/components/PlotBoard.test.tsx src/components/PersonRail.test.tsx`
- `npm test`
- `npm run build`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Add browser coverage for edited/rejected review suggestions.
- [ ] Add a sample dataset reset flow if current reset remains too blunt.

## 2026-06-23 — BuddyScan 3000 Poster Lab Completed

**Type:** App / Design / Product / Privacy UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/components/DossierPosterLab.tsx`
- `src/components/DossierPoster.tsx`
- `src/components/PersonRail.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/AI-DOSSIER-VISUALS-PROPOSAL.md`
- `docs/07-ops/GTA-WEB-SATIRE-REFERENCE.md`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab.png`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab-shuffled.png`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab-shuffled-expanded.png`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/mobile-poster-lab.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Implemented the local-only BuddyScan 3000 Poster Lab as the first CityDesk-inspired fake-web artifact for Friend CRM. The Person Rail now has an opt-in Fake Dossier Art action that opens a loud poster modal with fake browser chrome, stamps, warning tape, context receipt, shuffleable bureau nonsense, and copyable poster text.

The poster uses only safe visible fields and derived counts by default: name, city, relationship labels, warmth, trust, last/next contact dates, profile image/initials, memory count, and active open-loop count. It excludes notes, memory text, open-loop descriptions, contact/social values, scraping, provider calls, and private/sensitive summaries. The UI labels the artifact as fake comedy, not memory, not analysis, and not evidence.

Follow-up refinement: compacted the Poster Lab right rail into accordion subsections so the modal opens shorter by default while keeping shuffle/copy controls immediately visible. Context Receipt and fine print can now expand only when needed.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [x] Run Component-Level Test Coverage.
- [ ] Keep provider-backed image generation parked until explicitly selected.

## 2026-06-23 — Actual Profile Photo Upload Pass Completed

**Type:** App / Product / Privacy UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/profile-photo-upload-2026-06-23/desktop-profile-photo-upload.png`
- `docs/07-ops/profile-photo-upload-2026-06-23/mobile-profile-photo-upload.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Added a bounded local profile photo upload path to the person editor. Users can now upload a small local image, remove it, keep the initials fallback, and see explicit copy that local uploads are stored as data URLs in browser data and included in JSON export. The upload path rejects non-image files and images over 350KB, and the editor now avoids stale async file-reader updates overwriting newer person edits.

Browser regression now covers adding, removing, re-adding, and persisting an uploaded local profile photo. Fresh desktop and mobile screenshots were captured for the upload UI.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Run AI Dossier Visuals Exploration.

## 2026-06-23 — Non-Trial Product Polish Sweep Completed

**Type:** App / Product / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/ReflectionLog.tsx`
- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Completed the remaining non-trial hopper polish after profile/social links: added a deterministic logo-click tagline easter egg, added keyboard shortcuts for view navigation plus quick-add and capture focus, surfaced a compact shortcuts reference in Settings, and expanded browser regression to cover Markdown export plus full import replacement after backup acknowledgement.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Choose the next non-trial hopper item.

## 2026-06-23 — Profile Photos And Social Links Completed

**Type:** App / Product / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/types.ts`
- `src/App.tsx`
- `src/components/Avatar.tsx`
- `src/components/PersonRail.tsx`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/profile-social-links-2026-06-23/desktop-profile-socials.png`
- `docs/07-ops/profile-social-links-2026-06-23/mobile-profile-socials.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Added optional user-entered profile photo references and structured contact/social links to person records. People rows and the Person Rail now show profile images when present with initials fallback, and the Person Rail displays launchable user-entered contact links with explicit no-scraping/no-syncing language. JSON export preserves the fields automatically, Markdown export now includes profile photo and contacts, import validation checks structured contact methods, and browser regression covers editing/persistence for profile photo and LinkedIn data.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Run Low-Risk Easter Eggs And Delight Pass.

## 2026-06-23 — Private Trial Parked And Non-Trial Hopper Refilled

**Type:** Ops / Product
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Parked the private real-data trial by user direction and refilled the active hopper with non-trial product polish: Profile Photos And Social Links, Low-Risk Easter Eggs And Delight Pass, Fast Capture And Navigation Shortcuts, and Export / Import Confidence Coverage.

**Follow-Ups:**

- [ ] Run Profile Photos And Social Links.

## 2026-06-23 — Relationship Setup And People List Playability Completed

**Type:** App / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/relationship-setup-playability-2026-06-23/desktop-people-setup.png`
- `docs/07-ops/relationship-setup-playability-2026-06-23/mobile-people-setup.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Made the People setup flow useful for real data entry by expanding the selected person editor with relationship labels, importance, trust, last contact, next contact, sensitivity, city, name, warmth, and summary controls. Replaced the People row's raw open-loop count with a visible "why now" signal such as debt overdue, nudge due, nudge soon, going cold, handle gently, do not fumble, or all quiet. Improved the Needs Attention filter to use explainable relationship signals instead of only open loops, and added browser regression coverage for quick add, search, relationship filtering, attention filtering, inline edits, why-now signals, and persistence after reload.

Validation passed:

- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Run the private real-data trial with private or carefully anonymized data.

## 2026-06-23 — Trustworthy Feedback States Completed

**Type:** App / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/components/PersonRail.tsx`
- `src/components/ReflectionLog.tsx`
- `src/components/ReviewPanel.tsx`
- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Added clearer trust feedback for generation, copy, add, export, note capture, and review flows. Brief and next-move generation now show loading/disabled states, copy/add/export actions report success or failure, Person Rail note capture keeps draft text until save completion, review copy plainly says the note is already saved and durable records require approval, and user-facing route/provider jargon was replaced with human trust language. Parked future fun ideas for profile media, social links, AI dossier visuals, easter eggs, and future visual skins in the backlog.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`
- `npm audit --audit-level=moderate`

**Follow-Ups:**

- [ ] Run Relationship Setup And People List Playability.

## 2026-06-23 — Cheeky Copy And Interaction Pass Completed

**Type:** Design / App / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/components/ReflectionLog.tsx`
- `src/components/ReviewPanel.tsx`
- `src/components/SettingsView.tsx`
- `src/components/PlotBoard.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/cheeky-copy-interaction-pass-2026-06-23/desktop-people.png`
- `docs/07-ops/cheeky-copy-interaction-pass-2026-06-23/desktop-plot-board.png`
- `docs/07-ops/cheeky-copy-interaction-pass-2026-06-23/desktop-evidence-locker.png`
- `docs/07-ops/cheeky-copy-interaction-pass-2026-06-23/mobile-people.png`

**Summary:**

Applied the approved GTA-IV-adjacent funny copy pass across navigation, People, Radar, Reflection Log, Review Panel, Person Rail, Settings, and Plot Board. Improved hard-to-read button labels with stronger foreground colors and text shadows, added cheesier hover motion and chunky shadows, added a reduced-motion-safe cursor trail, and made Plot Board drag/drop easier to use by adding an explicit "Move me" drag handle to every move card.

Validation passed:

- `npm run build`
- `npm test`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Finish the remaining Trustworthy Feedback States acceptance criteria for success/failure feedback on copy, add, export, and generation actions.

## 2026-06-23 — Extreme Retro Visual Pass Completed

**Type:** Design / App / UX
**Source:** Human + Agent
**Related Files:**

- `src/styles.css`
- `docs/07-ops/extreme-retro-visual-pass-2026-06-23/desktop-1440x1000.png`
- `docs/07-ops/extreme-retro-visual-pass-2026-06-23/mobile-390x844.png`
- `docs/07-ops/extreme-retro-visual-pass-2026-06-23/desktop-plot-board.png`

**Summary:**

Pushed the Friend CRM visual identity further into over-the-top late-90s/early-2000s retro-web territory: sticker-style page titles, stronger faux-window panel bars, halftone and scanline texture, striped filter blocks, beveled form controls, louder candy accents, and chunkier table/card treatments while preserving app behavior.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

**Follow-Ups:**

- [ ] Continue trust-feedback work without sanding off the new visual personality.

## 2026-06-23 — Cheekier 90s/Early-2000s Visual Pass Completed

**Type:** Design / App / UX
**Source:** Human + Agent
**Related Files:**

- `src/styles.css`
- `src/App.tsx`
- `docs/07-ops/cheeky-visual-pass-2026-06-23/desktop-1440x1000.png`
- `docs/07-ops/cheeky-visual-pass-2026-06-23/mobile-390x844.png`
- `docs/07-ops/cheeky-visual-pass-2026-06-23/desktop-plot-board.png`

**Summary:**

Pushed the visual direction from serious private desk toward a cheekier late-90s/early-2000s city-web feel with modern smoothness: glossy dark sidebar, taxi-yellow/cyan/magenta accent system, subtle scanlines, chunkier table/card borders, sticker-like board lane headers, louder selected states, and a tighter brand tagline.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

**Follow-Ups:**

- [ ] Continue tuning personality during Trustworthy Feedback States without reducing privacy clarity.

## 2026-06-23 — Branded Shell And Responsive Foundation Completed

**Type:** Design / App / UX
**Source:** Human + Agent Swarm
**Related Files:**

- `src/styles.css`
- `src/App.tsx`
- `docs/07-ops/ui-fix-run-2026-06-23/desktop-1440x1000.png`
- `docs/07-ops/ui-fix-run-2026-06-23/tablet-1024x900.png`
- `docs/07-ops/ui-fix-run-2026-06-23/mobile-390x844.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Added a branded responsive foundation for the prototype: ink/paper/signal/warning/danger/planning-blue design tokens, a stronger dark command-desk sidebar, cooler app surfaces, sharper selected states, mobile card stacking, and responsive board/detail behavior. Captured after-state screenshots for desktop, tablet, mobile, and Plot Board.

Validation passed:

- `npm run demo:check`
- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

**Follow-Ups:**

- [ ] Run Trustworthy Feedback States.
- [ ] Run Relationship Setup And People List Playability.

## 2026-06-23 — Plot Board Drag/Drop And Planning Polish Completed

**Type:** App / UX / Tests
**Source:** Human + Agent
**Related Files:**

- `src/components/PlotBoard.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Implemented desktop drag/drop movement between Plot Board columns while preserving visible status buttons and adding a keyboard-friendly status select for non-pointer movement. Movement uses the existing next-move status update path, so changes persist through local browser storage. Browser regression now verifies that a dragged card leaves the source column, appears in the destination column, and remains there after reload.

Validation passed:

- `npm run demo:check`
- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

**Follow-Ups:**

- [ ] Run Trustworthy Feedback States.

## 2026-06-23 — Full UI/UX And Functionality Audit Completed

**Type:** Design / App / Tests / Ops
**Source:** Human + Agent Swarm
**Related Files:**

- `docs/07-ops/UI-UX-AUDIT-2026-06-23.md`
- `docs/07-ops/ui-audit-2026-06-23/desktop-1440x1000.png`
- `docs/07-ops/ui-audit-2026-06-23/tablet-1024x900.png`
- `docs/07-ops/ui-audit-2026-06-23/mobile-390x844.png`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Ran a full design, UI/UX, responsive, and functionality audit with three read-only subagents plus live browser screenshots and targeted checks. Confirmed the app's deterministic flows pass current regression, identified that Plot Board drag/drop is not implemented, and converted the findings into a PR-sized design/playability fix plan.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run regression:browser`

**Follow-Ups:**

- [x] Run Branded Shell And Responsive Foundation.
- [x] Run Plot Board Drag/Drop And Planning Polish.
- [ ] Run Trustworthy Feedback States.

## 2026-06-23 — Balanced Trust, Coverage, And Trial Rehearsal Run Completed

**Type:** App / Tests / Privacy / Docs / Ops
**Source:** Human + Agent Swarm
**Related Files:**

- `src/components/SettingsView.tsx`
- `src/components/ReviewPanel.tsx`
- `src/components/ReflectionLog.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/SYNTHETIC-PRIVATE-TRIAL-REHEARSAL-2026-06-23.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Ran a balanced multi-agent pass with trust UX, regression coverage, and synthetic trial rehearsal workers. Added explicit backup acknowledgement before replacing local data, clearer review copy that separates saved notes from durable records, stronger capture-pending feedback, browser regression coverage for empty extraction state, and a repo-safe synthetic private-trial rehearsal report. The regression script was reconciled with the new trust copy and the combined app passed the full demo readiness command.

Validation passed:

- `npm run demo:check`

**Follow-Ups:**

- [ ] Run the human private real-data trial in provider-disabled local mode.
- [ ] Triage redacted trial findings into `NEXT-IN-HOPPER.md` and `FUTURE-TODO.md`.

## 2026-06-23 — Multi-Agent Demo Readiness Pass Completed

**Type:** App / AI / Tests / Privacy / Docs
**Source:** Human + Agent Swarm
**Related Files:**

- `src/types.ts`
- `src/lib/insights.ts`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/lib/crm.test.ts`
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/lib/aiGenerationRoute.ts`
- `src/data/seed.ts`
- `src/components/PersonRail.tsx`
- `src/components/ReflectionLog.tsx`
- `src/components/ReviewPanel.tsx`
- `src/components/SettingsView.tsx`
- `src/App.tsx`
- `scripts/browser-regression.mjs`
- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/PRIVATE-TRIAL-READINESS-2026-06-23-AGENT1.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Spawned parallel agents for private-trial readiness, demo polish, AI trust/safety, and coverage gaps. Fixed the main trust blocker by preserving sensitive/private labels on durable open loops, displaying those labels in the Person Rail, exporting them in Markdown, and normalizing older open loops without labels. Added malformed JSON import coverage to browser regression, clarified private-trial provider-disabled mode, and applied small demo trust polish for capture pending feedback, review dismissal wording, duplicate generated-move adds, and People filter empty states.

Validation passed:

- `npm test -- --run src/lib/crm.test.ts src/lib/dataValidation.test.ts src/lib/storage.test.ts`
- `npm run build`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run the private real-data trial with `FRIEND_CRM_DISABLE_PROVIDER=1` unless explicitly testing real-provider private use.
- [ ] Use redacted findings to decide whether parked polish items should move into the hopper.

## 2026-06-23 — PR 2 Person Rail Component Boundary Completed

**Type:** App / Tests / Maintainability
**Source:** Human + Agent
**Related Files:**

- `src/components/PersonRail.tsx`
- `src/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Extracted the Person Rail from `src/App.tsx` into `src/components/PersonRail.tsx` without changing behavior. The extracted component owns brief generation, generated next moves, manual next moves, capture, delete consequence panel, open loop status updates, memories, and timeline note deletion.

Validation passed:

- `npm run build`
- `npm test`
- `npm run demo:check`

**Follow-Ups:**

- [ ] Run the private real-data trial before doing trial-driven polish.

## 2026-06-23 — PR 4 Private Trial Run Kit Finalization Completed

**Type:** Research / Product / Privacy / Docs
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Tightened the private real-data trial kit with a preflight, safe trial flow, export-before-delete steps, destructive-test guardrails, cleanup rules, explicit anonymization guidance, and a redacted findings template that can safely drive future hopper updates.

Validation passed:

- `npm run build`

**Follow-Ups:**

- [ ] Run the private real-data trial outside the repo using `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`.
- [ ] Use `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md` for any repo-safe findings.

## 2026-06-23 — PR 3 Demo Readiness Command And Checklist Completed

**Type:** Ops / QA / Docs
**Source:** Human + Agent
**Related Files:**

- `scripts/demo-readiness-check.mjs`
- `package.json`
- `.env.example`
- `src/lib/serverAiProvider.ts`
- `src/lib/serverAiProvider.test.ts`
- `docs/07-ops/DEMO-CHECKLIST.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `PROJECT.md`

**Summary:**

Added `npm run demo:check` as a one-command local demo readiness baseline. The command runs tests, build, route smoke, and browser regression against a temporary local Vite server with provider calls disabled, while provider-key validation remains explicit through `npm run trial:provider`.

Validation passed:

- `npm run demo:check`

**Follow-Ups:**

- [x] Run PR 4: Private Trial Run Kit Finalization.
- [ ] Use `npm run trial:provider` separately when real-key synthetic AI behavior needs to be checked.

## 2026-06-23 — PR 1 Provider Trial Hardening Completed

**Type:** AI / Backend / Tests / Docs
**Source:** Human + Agent
**Related Files:**

- `src/lib/aiExtractorSchema.ts`
- `src/lib/aiGenerationSchema.ts`
- `src/lib/aiHttpTransport.ts`
- `src/lib/serverAiProvider.ts`
- `src/lib/aiHttpTransport.test.ts`
- `src/lib/serverAiProvider.test.ts`
- `scripts/provider-local-trial.mjs`
- `scripts/ui-regression-smoke.mjs`
- `docs/AI_HTTP_TRANSPORT.md`
- `docs/07-ops/PROVIDER-LOCAL-TRIAL-2026-06-23-PR1.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

**Summary:**

Hardened the local AI HTTP/provider boundary so invalid route payloads return `422` before provider or mock execution, OpenAI structured-output schemas use strict-compatible optional fields, provider `null` optionals are normalized before local validation, and the real-key synthetic provider trial passes.

Validation passed:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run trial:provider`
- `npm run smoke:ui`

**Follow-Ups:**

- [x] Run PR 3: Demo Readiness Command And Checklist.
- [x] Run PR 4: Private Trial Run Kit Finalization.

## 2026-06-23 — Demo PR Run Plan And Real-Key Provider Trial Recorded

**Type:** AI / Ops / Docs
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/DEMO-PR-RUN-PLAN.md`
- `docs/07-ops/PROVIDER-LOCAL-TRIAL-2026-06-23-REAL-KEY.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/PROJECT-PLAN.md`
- `PROJECT.md`

**Summary:**

Packaged the remaining fully functional demo work into PR-sized runs and attempted a real-key synthetic provider trial. The trial showed brief and next-move generation passing, while extract-memory failed with an OpenAI HTTP 400 and invalid payload handling needs to return `422`.

**Follow-Ups:**

- [x] Run PR 1: Provider Trial Hardening.
- [x] Add the demo readiness command/checklist.
- [x] Finalize the private trial kit.

## 2026-06-23 — Eighth Ten-Chunk Hardening Run Completed

**Type:** App / Tests / Docs / Ops
**Source:** Human + Agent
**Related Files:**

- `src/components/PlotBoard.tsx`
- `src/App.tsx`
- `scripts/browser-regression.mjs`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Extracted Plot Board into a focused component, added empty states for board columns, made browser regression start from seed data, and expanded browser regression to verify moving a next move between statuses.

**Follow-Ups:**

- [ ] Run the human private-data trial with 10 people and 25 notes.
- [ ] Run the provider-boundary trial with a real server-side key.
- [ ] Consider extracting Person Rail only if the boundary is clean enough to preserve behavior.

## 2026-06-23 — Seventh Ten-Chunk Hardening Run Completed

**Type:** App / Design / Tests / Docs / Ops
**Source:** Human + Agent
**Related Files:**

- `src/components/ReflectionLog.tsx`
- `src/App.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Extracted Reflection Log into a focused component, added person picker quick controls, disabled capture until text and at least one person are selected, tightened the empty capture state, and expanded browser regression to verify the capture-readiness path.

**Follow-Ups:**

- [ ] Run the human private-data trial with 10 people and 25 notes.
- [ ] Run the provider-boundary trial with a real server-side key.
- [ ] Continue extracting large UI slices only when the boundary is clean.

## 2026-06-23 — Sixth Ten-Chunk Hardening Run Completed

**Type:** App / Persistence / Tests / Docs / Ops
**Source:** Human + Agent
**Related Files:**

- `src/components/SettingsView.tsx`
- `src/components/ReviewPanel.tsx`
- `src/App.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `docs/BACKUP_RESTORE.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Added backup-before-replace JSON export from the import preview, extracted Review Panel into a focused component, expanded browser regression to verify the restore backup download, and updated backup/restore and project-state docs.

**Follow-Ups:**

- [ ] Run the human private-data trial with 10 people and 25 notes.
- [ ] Run the provider-boundary trial with a real server-side key.
- [ ] Continue extracting stable UI slices only when the boundary is clean.

## 2026-06-23 — Fifth Ten-Chunk Hardening Run Completed

**Type:** App / Persistence / AI / Tests / Docs / Ops
**Source:** Human + Agent
**Related Files:**

- `src/components/SettingsView.tsx`
- `src/App.tsx`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/styles.css`
- `scripts/browser-regression.mjs`
- `scripts/provider-local-trial.mjs`
- `package.json`
- `docs/07-ops/PROVIDER-LOCAL-TRIAL.md`
- `docs/07-ops/PROVIDER-LOCAL-TRIAL-2026-06-23-BIG-RUN-5.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/BACKUP_RESTORE.md`
- `docs/AI_HTTP_TRANSPORT.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Improved JSON import preview confidence with sample people, note range, and privacy totals; extracted Settings into a focused component; added a synthetic provider-boundary trial command and docs; expanded browser regression to cover richer restore preview and mobile overflow; and validated the updated app, smoke, provider trial, and browser paths.

**Follow-Ups:**

- [ ] Run the human private-data trial with 10 people and 25 notes.
- [ ] Run the provider-boundary trial with a real server-side key.
- [ ] Decide whether a restore diff or backup-before-replace flow is needed after real use.

## 2026-06-23 — Fourth Ten-Chunk Hardening Run Completed

**Type:** App / Persistence / Tests / Docs / Research
**Source:** Human + Agent
**Related Files:**

- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/App.tsx`
- `src/styles.css`
- `scripts/ui-regression-smoke.mjs`
- `scripts/browser-regression.mjs`
- `package.json`
- `docs/PERSISTENCE_BACKUP_PLAN.md`
- `docs/BACKUP_RESTORE.md`
- `docs/AI_HTTP_TRANSPORT.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/PRIVATE-TRIAL-SIMULATION-2026-06-23-BIG-RUN-4.md`
- `PROJECT.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Added an explicit CRM data schema migration registry while keeping unversioned raw imports compatible, made generated next-move drafts editable before adding them to the Plot Board, expanded AI HTTP smoke coverage, added Playwright browser regression automation for core playable paths, documented IndexedDB migration trigger criteria, and recorded a simulated private-trial readiness pass.

**Follow-Ups:**

- [ ] Run the human private-data trial with 10 people and 25 notes.
- [ ] Improve import preview confidence for valuable private datasets.
- [ ] Decide whether provider-backed generation quality is ready for real private use.

## 2026-06-23 — Third Ten-Chunk Hardening Run Completed

**Type:** App / AI / Backend / Persistence / Tests / Docs / Research
**Source:** Human + Agent
**Related Files:**

- `src/lib/browserAiClient.ts`
- `src/lib/browserAiClient.test.ts`
- `src/lib/serverAiProvider.ts`
- `src/lib/serverAiProvider.test.ts`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/lib/storage.ts`
- `src/lib/storage.test.ts`
- `src/App.tsx`
- `scripts/ui-regression-smoke.mjs`
- `package.json`
- `docs/07-ops/MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-3.md`
- `docs/07-ops/PRIVATE-TRIAL-DRY-RUN-2026-06-23.md`

**Summary:**

Wired browser UI calls through the development AI HTTP routes with local fallback behavior, added schema-versioned JSON export/import while preserving backward compatibility with raw exports, added server-only OpenAI-compatible provider adapters for briefs and next moves, added a repeatable UI smoke helper, and recorded browser/private-trial dry-run evidence.

**Follow-Ups:**

- [ ] Run the private real-data trial.
- [ ] Add a schema migration framework before storage-engine changes.
- [ ] Add automated browser-level regression tests.

## 2026-06-23 — Second Ten-Chunk Hardening Run Completed

**Type:** App / AI / Backend / Privacy / Tests / Docs / Ops
**Source:** Human + Agent
**Related Files:**

- `vite.config.ts`
- `src/lib/aiHttpTransport.ts`
- `src/lib/aiHttpTransport.test.ts`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/App.tsx`
- `src/styles.css`
- `docs/AI_HTTP_TRANSPORT.md`
- `docs/BACKUP_RESTORE.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`
- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/PROJECT-BRAIN-AUDIT-2026-06-23-BIG-RUN-2.md`
- `docs/07-ops/MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-2.md`

**Summary:**

Added Vite development HTTP transport for AI route shells, strengthened JSON import validation with enum/date/reference/duplicate checks, added import preview before replacing local data, wired generated/fallback briefs into the person rail with copy support, documented repeatable UI regression smoke, added a private real-data trial kit, updated backup/restore and AI transport docs, and recorded a second browser smoke.

**Follow-Ups:**

- [x] Wire browser UI calls through the development AI HTTP routes.
- [x] Add schema versioning and migration tests.
- [x] Add provider adapters for generated briefs and next moves.

## 2026-06-23 — Ten-Chunk Prototype Hardening Run Completed

**Type:** App / AI / Backend / Privacy / Tests / Docs / Ops / Decision
**Source:** Human + Agent
**Related Files:**

- `src/lib/serverAiProvider.ts`
- `src/lib/serverAiProvider.test.ts`
- `src/lib/aiGenerationSchema.ts`
- `src/lib/aiGenerationRoute.ts`
- `src/lib/aiGenerationRoute.test.ts`
- `src/lib/dataValidation.ts`
- `src/lib/dataValidation.test.ts`
- `src/lib/storage.test.ts`
- `src/App.tsx`
- `src/styles.css`
- `.env.example`
- `docs/PERSISTENCE_BACKUP_PLAN.md`
- `docs/06-decisions/0007-local-first-persistence-before-hosted-backend.md`
- `docs/07-ops/MANUAL-BROWSER-SMOKE-2026-06-23.md`
- `docs/07-ops/PROJECT-BRAIN-AUDIT-SKILL.md`
- `docs/07-ops/ADR-CREATION-SKILL.md`

**Summary:**

Completed a broad prototype-hardening run: added an OpenAI-compatible server-side provider adapter, provider/fallback shells for briefs and next moves, generated next-move drafts in the person rail, faster capture/review controls, validated JSON import/restore, export/import validation tests, a local-first persistence ADR, manual browser smoke report, and two reusable ops skills.

**Follow-Ups:**

- [ ] Add HTTP transport for AI route shells.
- [ ] Strengthen JSON import validation and restore preview.
- [ ] Wire generated brief output into the brief UI.
- [ ] Add UI-level regression tests.
- [ ] Run a private real-data trial.

## 2026-06-23 — Simulated Prototype Trial Completed

**Type:** Research / Tests / Ops
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/SIMULATED-PROTOTYPE-TRIAL-2026-06-23.md`
- `src/lib/prototypeTrial.test.ts`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`

**Summary:**

Ran a simulated prototype trial against the core app flow using 10 people and 25 notes. The trial exercised extraction review, Radar, briefs, next moves, Markdown/JSON export, note delete, and person delete. The prototype scored 30/40: playable with focused fixes.

**Follow-Ups:**

- [ ] Add a real server-only provider adapter behind the extractor shell.
- [ ] Tighten capture and review UX for repeated use.
- [ ] Run a manual browser demo polish and regression pass.

## 2026-06-23 — AI Route Shell And Review Wiring Added

**Type:** AI / App / Decision
**Source:** Human + Agent
**Related Files:**

- `docs/06-decisions/0006-ai-backend-shape.md`
- `docs/06-decisions/README.md`
- `src/lib/aiExtractorRoute.ts`
- `src/lib/aiExtractorRoute.test.ts`
- `src/lib/aiExtractorSchema.ts`
- `src/App.tsx`
- `src/styles.css`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Chose a framework-neutral extractor route/controller core as the first AI backend shape, added the validated extractor route shell with mock provider behavior, wired note capture through that shell with deterministic fallback, and added prototype trial target metrics in Settings.

**Follow-Ups:**

- [ ] Run the real-use trial before committing to provider details.
- [ ] Add a real server-only provider adapter when backend/secret handling is ready.

## 2026-06-23 — AI Extractor Schema Validation Added

**Type:** AI / Tests
**Source:** Human + Agent
**Related Files:**

- `src/lib/aiExtractorSchema.ts`
- `src/lib/aiExtractorSchema.test.ts`
- `docs/AI_INTEGRATION_BOUNDARY.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Added a dependency-free validator for future Memory Extractor AI output. The validator accepts valid structured responses and rejects malformed dates, unknown person IDs, invalid enum values, missing basis text, invalid JSON, and risky instructions before output can reach review flows.

**Follow-Ups:**

- [ ] Decide backend shape for the first server-side AI route.
- [ ] Implement route failure/fallback behavior before provider calls.

## 2026-06-22 — Review Workflow, Playability Pass, And Trial Harness Added

**Type:** App / Research / Docs
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/lib/crm.test.ts`
- `src/styles.css`
- `docs/07-ops/REAL-USE-TRIAL-HARNESS.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Completed three sequential prototype-readiness runs: strengthened the source-backed review workflow with edit-before-save, improved capture and person detail playability, and added a real-use trial harness for testing 10 people and 25 notes.

**Follow-Ups:**

- [ ] Run the real-use trial and write a trial report.
- [ ] Move trial findings into the hopper or parked backlog.

## 2026-06-22 — Real AI Integration Boundary Planned

**Type:** AI / Architecture
**Source:** Human + Agent
**Related Files:**

- `docs/AI_INTEGRATION_BOUNDARY.md`
- `docs/06-decisions/0005-server-side-ai-boundary.md`
- `docs/06-decisions/README.md`
- `docs/ARCHITECTURE.md`
- `PROJECT.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Documented the future server-side AI boundary, including the Memory Extractor route contract, validation rules, failure behavior, prompt logging policy, secret-handling rules, and the requirement that durable memories/open loops remain source-backed and user-confirmed.

**Follow-Ups:**

- [ ] Strengthen the source-backed review workflow before wiring provider calls.
- [ ] Add validation schema tests when implementation begins.

## 2026-06-22 — Export And Delete Privacy UX Added

**Type:** App / Privacy
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/lib/crm.ts`
- `src/lib/crm.test.ts`
- `src/styles.css`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Added individual note deletion, source-backed cleanup for deleted notes, visible person delete consequence summaries, and export warnings that show private/sensitive data counts before JSON or Markdown export.

**Follow-Ups:**

- [ ] Consider optional sensitive/private export filtering after real use.
- [ ] Add UI-level interaction tests once the UI settles.

## 2026-06-22 — Local CRUD And Delete Coverage Tightened

**Type:** App / Tests
**Source:** Human + Agent
**Related Files:**

- `src/lib/crm.ts`
- `src/lib/crm.test.ts`
- `src/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Extracted core CRM state mutations into testable helpers, wired the app to use them, and added focused tests for person add/update/delete, note capture contact history, accepted suggestion persistence, shared-record delete detachment, open loop status, and next move status.

**Follow-Ups:**

- [ ] Add explicit note delete UX.
- [ ] Add clearer person delete consequences in the UI.

## 2026-06-22 — Project Brain Audit And Initial ADRs Added

**Type:** Docs / Decision
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/PROJECT-BRAIN-AUDIT.md`
- `docs/06-decisions/README.md`
- `docs/06-decisions/0001-vite-react-local-first-mvp.md`
- `docs/06-decisions/0002-deterministic-core-before-ai.md`
- `docs/06-decisions/0003-source-backed-user-confirmed-memory.md`
- `docs/06-decisions/0004-no-scraping-automated-sending-hidden-scoring.md`
- `PROJECT.md`
- `AGENTS.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Completed the Milestone 0 project brain audit and captured the foundational decisions for the current local-first MVP, deterministic core before AI, source-backed user-confirmed memory, and privacy/product constraints.

**Follow-Ups:**

- [ ] Add a reusable Project Brain Audit Skill.
- [ ] Add a reusable ADR Creation Skill.

## 2026-06-22 — Whole-Project Plan Added

**Type:** Ops / Docs
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/PROJECT-PLAN.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/OPERATING-MANUAL.md`
- `PROJECT.md`

**Summary:**

Added a whole-project milestone plan and expanded the parked backlog so future work can be selected from a coherent roadmap without overloading the active hopper.

**Follow-Ups:**

- [ ] Move focused slices from the project plan into `NEXT-IN-HOPPER.md` only when they are ready for near-term execution.

## 2026-06-22 — Project Operating System Added

**Type:** Ops / Docs
**Source:** Human + Agent
**Related Files:**

- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`
- `docs/07-ops/SKILLS.md`
- `docs/07-ops/SHIPPING-UPDATE-SKILL.md`
- `docs/07-ops/OPERATING-MANUAL.md`
- `docs/07-ops/PROMPT-TEMPLATE.md`
- `AGENTS.md`
- `PROJECT.md`

**Summary:**

Added a lightweight project operating system so future human and AI work can stay aligned, track active tasks, preserve completed work, and update project state after meaningful changes.

**Follow-Ups:**

- [ ] Run a project brain audit.
- [ ] Keep ops docs updated after meaningful work.

## 2026-06-22 — Initial Local-First MVP Scaffold Added

**Type:** App / Docs
**Source:** Human + Agent
**Related Files:**

- `src/App.tsx`
- `src/lib/insights.ts`
- `src/lib/storage.ts`
- `src/data/seed.ts`
- `src/types.ts`
- `src/styles.css`
- `README.md`
- `docs/START_HERE.md`
- `docs/MVP_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/BUILD_PLAN.md`

**Summary:**

Created the first runnable Friend CRM MVP scaffold with seeded people, local browser storage, People, Radar, Plot Board, Reflection Log, person dossier, deterministic extraction review, brief generation, export/reset, tests, and build scripts.

**Follow-Ups:**

- [ ] Tighten CRUD and delete coverage.
- [ ] Add ADRs for current architecture decisions.
