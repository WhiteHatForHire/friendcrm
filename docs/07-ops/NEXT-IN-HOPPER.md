# NEXT-IN-HOPPER.md - Friend CRM Active Queue

This hopper was reset from current repo state, HQ daily logs, completed-work receipts, and repo-safe project summaries. It should describe the next logical work, not a historical wish list.

## Current Shipping Objective

Move toward a local-first relationship desk using synthetic/contact-safe fixtures before any private contact import.

## Hopper Rules

- Keep this to the next 5-10 real moves.
- Move completed work to `COMPLETED.md` instead of leaving it here.
- Put speculative or later ideas in `FUTURE-TODO.md`.
- Do not add private raw source, credentials, exports, or sensitive third-party material.

Turn the current local-first Vite React MVP and Expo mobile prototype into a trustworthy, playable, and branded private relationship desk: preserve the deterministic source-backed core, make new-person mobile flows actually useful, keep the Plot Board planning surface reliable, and make the UI feel intentional enough for fake-data trial and portfolio demo use.

## Active Tasks
## 1. Resolve Full App QA Medium UI Warnings

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

- `Friend CRM Dev` is installed from the latest local build.
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

## 2. TestFlight Processing Check And Internal Tester Setup

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

## 2A. Mobile App Store Copy Safety Pass

**Status:** Ready
**Priority:** P0
**Type:** Mobile / UX Copy / App Store

### Goal

Apply the safest high-priority recommendations from `docs/07-ops/COPY-AUDIT-APP-STORE-PARODY-2026-07-11.md` to the mobile app before the next TestFlight/App Store candidate.

### Acceptance Criteria

- Primary mobile actions no longer use `suspect`, `interrogate`, `snooping`, or `target`.
- Evidence includes a plain local-only/no-scraping/no-auto-outreach disclaimer.
- Review flow keeps explicit approval language for memories, open loops, and next moves.
- Cheeky parody copy remains in secondary labels, empty states, receipts, and flavor text rather than trust-critical destructive actions.
- `cd apps/mobile && npm run check` passes.
- Local iPhone build is pushed before the next TestFlight build.

## 3. Supabase Confirmed Test Account And RLS Smoke

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

## 4. iOS Simulator Smoke And Mobile Screenshot Set

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

## 5. Hosted Fake-Data Demo Packaging

**Status:** Ready
**Priority:** P1
**Type:** Portfolio / Demo / Release

### Goal

Prepare Friend CRM for a public fake-data hosted demo so the Symposium page has a real product link.

### Acceptance Criteria

- Confirm deterministic demo mode works without real provider keys.
- Add deployment notes for Vercel/Netlify or chosen static host.
- Ensure `.env.local` and any real provider keys stay ignored.
- Add public-demo warning copy if needed.
- Run `FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check`.

## 6. Walkthrough Video / GIF Capture

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

## 7. Tablet Screenshot Contact Sheet

**Status:** Ready
**Priority:** P2
**Type:** QA / Visual Review

**Status:** Ready
**Priority:** P0
**Type:** QA fix pass

### Goal

Complete the narrow UI polish follow-up from `docs/07-ops/full-app-qa-2026-07-07.md` before any private real-data trial.

### Acceptance Criteria

- [ ] Mobile classified-tagline/top-strip control no longer clips at `390px`.
- [ ] Right-rail generated next-move objective/input row has a more forgiving responsive layout.
- [ ] Mobile Review Panel density is inspected and either improved or explicitly deferred with rationale.
- [ ] Validation reruns include `npm run audit:browser`, `npm run regression:mobile`, and `npm run trial:synthetic:browser`.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## 2. Define Local Source Model

**Status:** Ready
**Priority:** P0
**Type:** Focused next step

### Goal

Complete `Define Local Source Model` as the next practical move for this project. Use current repo docs, completed-work receipts, HQ daily-log context, and repo-safe source material.

### Acceptance Criteria

- [ ] The repo contains a clear output for this task: a working change, brief, decision note, review receipt, or ready-to-use artifact.
- [ ] The output says what it unlocks next, or it moves the next hopper item into an obvious ready/blocked state.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## 3. Create Synthetic Relationship Fixtures

**Status:** Ready
**Priority:** P0
**Type:** Focused next step
### Goal

Complete `Create Synthetic Relationship Fixtures` as the next practical move for this project. Use current repo docs, completed-work receipts, HQ daily-log context, and repo-safe source material.

### Acceptance Criteria

- [ ] The repo contains a clear output for this task: a working change, brief, decision note, review receipt, or ready-to-use artifact.
- [ ] The output says what it unlocks next, or it moves the next hopper item into an obvious ready/blocked state.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## 8. Project Brain Audit After Swarm

**Status:** Ready
**Priority:** P1
**Type:** Docs / Repo Health

## 4. Build Next-Move Planner Contract

**Status:** Ready
**Priority:** P1
**Type:** Focused next step
### Goal

Complete `Build Next-Move Planner Contract` as the next practical move for this project. Use current repo docs, completed-work receipts, HQ daily-log context, and repo-safe source material.

### Acceptance Criteria

- [ ] The repo contains a clear output for this task: a working change, brief, decision note, review receipt, or ready-to-use artifact.
- [ ] The output says what it unlocks next, or it moves the next hopper item into an obvious ready/blocked state.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## 9. Commit / PR Readiness Review

**Status:** Ready
**Priority:** P1
**Type:** Git / Review / Release Hygiene

## 5. Sketch Local UI Workflow

**Status:** Ready
**Priority:** P1
**Type:** Focused next step
### Goal

Complete `Sketch Local UI Workflow` as the next practical move for this project. Use current repo docs, completed-work receipts, HQ daily-log context, and repo-safe source material.

### Acceptance Criteria

- [ ] The repo contains a clear output for this task: a working change, brief, decision note, review receipt, or ready-to-use artifact.
- [ ] The output says what it unlocks next, or it moves the next hopper item into an obvious ready/blocked state.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## 6. Decide Import Order

**Status:** Ready
**Priority:** P1
**Type:** Focused next step

### Goal

Complete `Decide Import Order` as the next practical move for this project. Use current repo docs, completed-work receipts, HQ daily-log context, and repo-safe source material.

### Acceptance Criteria

- 2026-07-09: Full goal-based QA and visual audit completed; local release-candidate receipt was added under `docs/07-ops/full-qa-2026-07-09/`, Evidence Locker mobile ordering and next-move generator layout were fixed, browser audit input noise was reduced, and the provider-disabled demo baseline passed. Native iOS build/install succeeded but runtime content smoke is blocked by existing non-Friend CRM Metro servers on ports `8081` and `8083`.
- 2026-07-09: Mobile next-stage native build receipt completed; `npm run mobile:check` passed, local iPhone build/install/launch passed via `cd apps/mobile && npm run ios:device:dev`, and `docs/07-ops/MOBILE-REAL-USE-DEVICE-SMOKE-2026-07-09.md` now contains the fake-data relationship desk demo path plus the remaining human physical-device UI smoke blocker.
- 2026-07-08: Mobile Real-Use Repair implemented locally; new-person Dossier flows now have manual memory/open-loop/next-move creation, keyboard dismissal affordances, sparse-profile copy, compact label wrapping fixes, and export/share status. `npm run check` and `npm run ios:device:dev` passed, and `Friend CRM Dev` was installed/launched on iPhone.
- 2026-07-06: Friend CRM Expo TestFlight build submitted; iOS production build finished, App Store Connect app `6787891531` was created, TestFlight group was created, and the binary was uploaded for Apple processing.
- 2026-07-06: Friend CRM Expo TestFlight setup started; app gained iOS bundle ID, EAS config, EAS project link, local validation, and iOS Expo smoke screenshot. EAS production build is blocked at Apple 2FA/signing setup.
- 2026-07-02: Supabase Auth And Sync Mode UI completed; Evidence Locker now has Supabase config/session status, sign-in/sign-up/sign-out controls, local/synced mode gate, explicit hosted write arming, guarded push/pull controls, and a confirmed-memory hosted sync guard.
- 2026-07-02: Supabase Cloud Project And Migration Push completed; project `friendcrm` was created, repo CLI was linked, the initial migration was pushed, and local gitignored web/mobile env files were configured with public client values.
- 2026-07-01: Supabase Hosted Persistence Foundation completed; local Supabase config, migration/RLS schema, optional web/mobile clients, sync mapper, ADR, and backend docs were added.
- 2026-07-01: Expo Mobile Prototype Port completed; `apps/mobile/` now contains a local-first Expo app with fake-data reset, People, Dossier, Debrief/Review, Plot Board, Evidence Locker, AsyncStorage persistence, and mobile port documentation.
- 2026-06-29: Portfolio README And Case Study completed; `README.md` and `docs/PORTFOLIO_CASE_STUDY.md` now frame Friend CRM as a portfolio-ready retro relationship desk with modern AI/privacy boundaries.
- 2026-06-29: Symposium Portfolio Page Package completed; ready-to-paste page copy, metadata, screenshot mapping, alt text, CTAs, AI/privacy framing, engineering notes, and postmortem copy were added in `docs/07-ops/SYMPOSIUM-PORTFOLIO-PAGE-PACKAGE.md`.
- 2026-06-29: Symposium Portfolio Plan And Screenshot Gallery completed; portfolio positioning, page plan, captions, screenshot capture script, and nine portfolio screenshots were added under `docs/07-ops/portfolio-screenshots-2026-06-29/`.
- 2026-06-25: Launch-Demo Confidence Swarm Run completed; tablet regression/screenshots, mobile profile editor compaction, Poster Lab preview-first staging, demo checklist/script tightening, AI trust coverage, backup/restore docs, and full validation matrix were completed. See `docs/07-ops/LAUNCH-DEMO-CONFIDENCE-SWARM-2026-06-25.md`.
- 2026-06-25: Audit Fix, Backup/Restore Confidence, and Next-Level Swarm Directive run completed; mobile drawer modal behavior, desktop Settings rail focus, transient rail cleanup, saved-export restore copy, browser coverage, audit scanner signal, and `docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md` were added/updated.
- 2026-06-25: Full Browser UI Audit completed; desktop and mobile screenshots, contact sheets, Plot Board drag/drop verification, detail-panel review, Settings/import review, and prioritized findings were recorded in `docs/07-ops/FULL-BROWSER-UI-AUDIT-2026-06-25.md`.
- 2026-06-25: Mobile Person Detail Drawer completed; selected-person detail now opens as a mobile drawer with a close affordance, desktop rail behavior stays intact, and mobile/browser synthetic regressions pass.
- 2026-06-25: Browser-Level Synthetic Trial Harness completed; `npm run trial:synthetic:browser` now loads a fake 10-person / 25-note dataset in the browser and exercises People, briefs, generated moves, Radar, Plot Board, Settings export/import preview, and mobile overflow.
- 2026-06-25: Briefs And Next Moves Quality Pass completed; fallback/mock briefs now handle sparse and sensitive context better, generated moves include direct/warmer/careful options, provider prompt guidance was updated, and focused tests cover the behavior.
- 2026-06-25: Synthetic Real-Use Trial And Fallback Parser Pass completed; the automated trial now covers 25 synthetic notes across the seed people, generated briefs/next moves, export/import validation, delete cleanup, and broader deterministic extraction language.
- 2026-06-24: Mobile Usability Audit And Touch Pass completed; mobile shell, People cards, Reflection Log, Review Panel, Plot Board, Settings, mobile screenshots, and dedicated mobile browser regression were added.
- 2026-06-23: Sample Dataset Reset Flow completed; Settings now separates export, import/replace, and restore-sample behavior, sample restore has explicit warning copy, and browser regression covers restoring fake seed data after local changes.
- 2026-06-23: Review Panel Edited / Rejected Browser Coverage completed; browser regression now edits a suggested memory, rejects an open-loop suggestion, verifies the edited durable memory persists, and verifies rejected open-loop text stays out of the active list.
- 2026-06-23: Main Site Zany Shell And Classified States completed; app-wide local status chrome, classified empty states, Daily Alibi bulletin, Social Debt Receipt panel, screenshots, and validation added.
- 2026-06-23: Component-Level Test Coverage completed; Testing Library/jsdom added and interaction tests for `PlotBoard` and `PersonRail` added.
- 2026-06-23: BuddyScan 3000 Poster Lab completed; local-only Fake Dossier Art modal, CityDesk-inspired poster styling, context receipt, shuffle/copy controls, safety labels, screenshots, and browser coverage added.
- 2026-06-23: Actual Profile Photo Upload Pass completed; bounded local image upload, remove control, explicit export/privacy copy, stale async upload protection, screenshots, and browser coverage added.
- 2026-06-23: Non-trial product polish sweep completed; deterministic logo tagline easter egg, keyboard shortcuts, Settings shortcut reference, Markdown export regression, and full import replacement coverage added.
- 2026-06-23: Profile Photos And Social Links completed; optional profile photo references, structured user-entered contact/social links, avatar display, Markdown export, validation, and browser regression coverage added.
- 2026-06-23: Private real-data trial parked; non-trial product polish moved into the active hopper.
- 2026-06-23: Relationship Setup And People List Playability completed; richer person editor, relationship labels, why-now People row signals, improved Needs Attention filtering, persistence coverage, and screenshots added.
- 2026-06-23: Trustworthy Feedback States completed; loading/disabled states, copy/add/export confirmations, safer note capture, plain trust language, and backlog parking for fun product ideas added.
- 2026-06-23: Cheeky copy and interaction pass completed; funny private-intel copy, readable button text, stronger shadows/text shadows, hover motion, reduced-motion-safe cursor trail, and Plot Board drag handles added.
- 2026-06-23: Extreme retro visual pass completed; sticker page titles, faux-window panel bars, halftone dots, striped filter blocks, beveled controls, and louder candy accents added.
- 2026-06-23: Cheekier 90s/early-2000s visual pass completed; glossy dark sidebar, taxi-yellow/cyan accents, scanlines, chunkier cards, and louder Plot Board styling added.
- 2026-06-23: Branded Shell And Responsive Foundation completed; design tokens, dark command-desk sidebar, reduced beige dominance, responsive card stacking, and after screenshots added.
- 2026-06-23: Plot Board Drag/Drop And Planning Polish completed; desktop drag/drop, status-button fallback, keyboard-friendly status select, persistence via existing data path, and browser regression coverage added.
- 2026-06-23: Full UI/UX and functionality audit completed; screenshots, validation results, Plot Board drag/drop finding, and PR-sized fix plan added in `docs/07-ops/UI-UX-AUDIT-2026-06-23.md`.
- 2026-06-23: Balanced trust/coverage/rehearsal run completed; backup acknowledgement, clearer review/capture trust copy, empty extraction browser regression, and synthetic private-trial rehearsal report added.
- 2026-06-23: Multi-agent demo readiness pass completed; open-loop sensitivity persistence fixed, provider-disabled private trial guidance added, malformed import browser regression added, and demo trust polish applied.
- 2026-06-23: PR 2 Person Rail Component Boundary completed; `src/components/PersonRail.tsx` extracted from `src/App.tsx` with tests, build, smoke, and browser regression passing.
- 2026-06-23: PR 4 Private Trial Run Kit Finalization completed; private trial preflight, export-before-delete path, cleanup rules, anonymization rules, and redacted findings template added.
- 2026-06-23: PR 3 Demo Readiness Command And Checklist completed; `npm run demo:check` and `DEMO-CHECKLIST.md` added, with provider validation kept explicit and local-only.
- 2026-06-23: PR 1 Provider Trial Hardening completed; real-key synthetic provider trial, full tests, build, and UI smoke passed.
- 2026-06-23: Demo PR Run Plan created; provider real-key trial attempted with synthetic data, identifying provider extractor and invalid-payload hardening as the next P0.
- 2026-06-23: Eighth Ten-Chunk Hardening Run completed; Plot Board extracted, board empty states added, browser regression reset to seed data, and Plot Board status-move coverage added.
- 2026-06-23: Seventh Ten-Chunk Hardening Run completed; Reflection Log extracted, capture-readiness UX polished, picker quick controls added, and browser regression updated.
- 2026-06-23: Sixth Ten-Chunk Hardening Run completed; backup-before-replace export added to import preview, Review Panel extracted, and browser regression updated.
- 2026-06-23: Fifth Ten-Chunk Hardening Run completed; richer import preview, Settings component extraction, provider-boundary trial harness, provider trial docs/report, expanded browser regression, and mobile overflow check added.
- 2026-06-23: Fourth Ten-Chunk Hardening Run completed; schema migration registry, editable generated next moves, Playwright browser regression, expanded AI HTTP smoke, IndexedDB trigger criteria, and simulated private-trial readiness note added.
- 2026-06-23: Third Ten-Chunk Hardening Run completed; browser UI wired to development AI HTTP routes, schema-versioned JSON export/import added, brief/next-move provider adapters added, repeatable UI smoke script added, and private trial dry run recorded.
- 2026-06-23: Second Ten-Chunk Hardening Run completed; AI HTTP dev mount, stricter import validation, import preview, generated brief UI, UI regression smoke checklist, private trial kit, backup/restore docs, AI transport docs, and browser smoke added.
- 2026-06-23: Ten-Chunk Prototype Hardening Run completed; provider adapter, generation shells, capture/review UX, JSON restore, persistence ADR, browser smoke, export/import tests, ops skills, and docs state updates added.
- 2026-06-23: Simulated Prototype Trial With 10 People / 25 Notes completed; see `docs/07-ops/SIMULATED-PROTOTYPE-TRIAL-2026-06-23.md` and `src/lib/prototypeTrial.test.ts`.
- 2026-06-23: Implement AI Extractor Schema Validation completed; see `src/lib/aiExtractorSchema.ts` and `src/lib/aiExtractorSchema.test.ts`.
- 2026-06-23: Decide Backend Shape For Server-Side AI completed; see `docs/06-decisions/0006-ai-backend-shape.md`.
- 2026-06-23: Implement AI Extractor Route Shell completed; see `src/lib/aiExtractorRoute.ts`.
- 2026-06-23: Wire Memory Extractor To Review UI completed; note capture now uses the validated extractor shell with deterministic fallback.
- 2026-06-23: Prototype Polish From Known Friction completed; Settings now includes prototype trial target metrics.
- 2026-06-22: Strengthen Source-Backed Review Workflow completed; editable review items, source basis, sensitivity labels, and edited suggestion tests added.
- 2026-06-22: Playability Pass On Capture + Person Detail completed; capture metadata, empty states, person context snapshot, and source labels added.
- 2026-06-22: Real-Use Trial Harness completed; see `docs/07-ops/REAL-USE-TRIAL-HARNESS.md`.
- 2026-06-22: Plan Real AI Integration Boundary completed; see `docs/AI_INTEGRATION_BOUNDARY.md` and `docs/06-decisions/0005-server-side-ai-boundary.md`.
- 2026-06-22: Add Explicit Note and Person Export/Delete UX Pass completed; see `src/App.tsx`, `src/lib/crm.ts`, and `src/styles.css`.
- 2026-06-22: Tighten Local CRUD and Delete Coverage completed; see `src/lib/crm.ts` and `src/lib/crm.test.ts`.
- 2026-06-22: Audit Project Brain completed; see `docs/07-ops/PROJECT-BRAIN-AUDIT.md`.
- 2026-06-22: Create Initial ADRs for Current Architecture completed; see `docs/06-decisions/`.

- [ ] The repo contains a clear output for this task: a working change, brief, decision note, review receipt, or ready-to-use artifact.
- [ ] The output says what it unlocks next, or it moves the next hopper item into an obvious ready/blocked state.
- [ ] Private raw source, credentials, exports, financial/legal/health material, and client-sensitive data stay out of Git unless explicitly redacted and approved.

## Blocked / Waiting

None yet.

## Recently Moved Out

Hopper reset completed on 2026-06-28. Use `COMPLETED.md` for completed-work history and `FUTURE-TODO.md` for parked backlog.