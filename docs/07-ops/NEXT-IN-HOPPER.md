# NEXT-IN-HOPPER.md — Active Build Queue

This document tracks the current active queue for the project.

It is not the full backlog. It is the near-term hopper: the work that should happen next, in order, to keep the project moving toward a shippable MVP.

Update this file whenever a task is completed, superseded, blocked, or moved into active work.

---

# Current Shipping Objective

Turn the current local-first Vite React MVP into a trustworthy, playable, and branded private relationship desk: preserve the deterministic source-backed core, keep the Plot Board planning surface reliable, and make the UI feel intentional enough for a private real-data trial.

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

## 1. Local Demo Release Candidate Packaging

**Status:** Ready  
**Priority:** P1  
**Type:** Demo Readiness / Ops

### Goal

Package the current green demo baseline into a clear local release-candidate handoff so a human can run, review, and decide whether to commit/push or cut a PR.

### Acceptance Criteria

- Add or update a concise release-candidate note under `docs/07-ops/`.
- Include exact validation commands and latest pass results.
- Include known residual risks such as remaining medium browser-audit input warnings.
- Include changed-file categories and operator instructions.
- Do not commit or push unless explicitly asked.

## 2. Browser Audit Noise Reduction

**Status:** Ready  
**Priority:** P2  
**Type:** QA / Browser Automation

### Goal

Reduce the remaining medium browser-audit false positives around generic input clipping without weakening real visual bug detection.

### Acceptance Criteria

- `npm run audit:browser` no longer reports generic `input` clipping warnings unless a visible user-facing control is actually clipped.
- Hidden/file inputs and expected browser-native input scroll widths are classified appropriately.
- Audit still catches real horizontal overflow and button clipping.
- Audit findings remain written to `findings.json`.

## 3. Tablet Screenshot Contact Sheet

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

## 4. Project Brain Audit After Swarm

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

## 5. Commit / PR Readiness Review

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

---

# Recently Moved Out

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
