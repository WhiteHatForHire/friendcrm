# DEMO-PR-RUN-PLAN.md — Path To Fully Functional Demo

This document packages the remaining work into reviewable PR-sized runs.

Goal: get Friend CRM to a fully functional local demo product without adding production infrastructure, scraping, automated sending, hidden scoring, real private data in the repo, or committed secrets.

---

# Current Demo State

The local-first app is playable and has:

- People, Radar, Plot Board, Reflection Log, Person Rail, and Settings.
- Source-backed note review.
- Editable AI-generated next moves.
- Generated briefs.
- JSON and Markdown export.
- JSON import with validation, preview, and backup-before-replace.
- Vite development AI HTTP routes.
- OpenAI-compatible provider adapters.
- Browser regression coverage.

The remaining demo blockers are:

- Human private-data trial has not been run.
- Post-trial findings triage is waiting on a redacted findings report.
- Demo polish should be trial-driven rather than invented before real use.

Completed demo-readiness work:

- Provider-backed extraction passes the synthetic provider trial.
- Invalid AI route payloads return `422` before provider or mock execution.
- `npm run demo:check` runs the baseline non-secret demo validation stack.
- Private trial kit and redacted findings template exist.
- Person Rail has been extracted from `src/App.tsx`.

---

# PR 1 — Provider Trial Hardening

**Type:** AI / Backend / Tests  
**Priority:** P0  

## Goal

Make the provider-backed local AI trial pass with a real server-side key and synthetic data.

## Scope

- Fix OpenAI extractor request failure.
- Ensure invalid AI route payloads remain rejected before provider/mock execution.
- Keep deterministic fallback available.
- Do not print, commit, or expose API keys.

## Files Likely Touched

- `src/lib/serverAiProvider.ts`
- `src/lib/aiExtractorRoute.ts`
- `src/lib/aiHttpTransport.ts`
- `src/lib/aiHttpTransport.test.ts`
- `scripts/provider-local-trial.mjs`
- `docs/AI_HTTP_TRANSPORT.md`
- `docs/07-ops/PROVIDER-LOCAL-TRIAL.md`

## Acceptance Criteria

- `OPENAI_API_KEY` loaded from local server env only.
- `npm run trial:provider` passes against a freshly started local Vite server.
- Extract-memory, generate-brief, and generate-next-moves all pass with synthetic data.
- Invalid payloads return `422`.
- No real private data or secrets are committed.

## Validation

```bash
npm test
npm run build
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run trial:provider
npm run smoke:ui
```

---

# PR 2 — Person Rail Component Boundary

**Type:** App / Maintainability  
**Priority:** P1  

## Goal

Extract Person Rail or smaller Person Rail subcomponents without changing behavior.

## Scope

- Extract only if the boundary stays clean.
- Preserve brief, generated moves, manual next move, capture, delete, open loop status, and timeline behavior.
- Avoid redesign.

## Files Likely Touched

- `src/App.tsx`
- `src/components/PersonRail.tsx` or smaller component files
- `scripts/browser-regression.mjs`

## Acceptance Criteria

- Person Rail behavior is unchanged.
- Browser regression still covers brief, generated move edit/add, delete consequences, and capture/review.
- `src/App.tsx` becomes easier to review.

## Validation

```bash
npm test
npm run build
npm run regression:browser
```

---

# PR 3 — Demo Readiness Command And Checklist

**Type:** Ops / QA / Docs  
**Priority:** P1  

## Goal

Create one repeatable demo-readiness command/checklist for local demo prep.

## Scope

- Add a script that runs the non-secret validation stack.
- Document the provider-key validation separately.
- Add a demo checklist for reset, seed state, AI mode, export/import safety, and browser demo flow.

## Files Likely Touched

- `package.json`
- `scripts/`
- `docs/07-ops/DEMO-CHECKLIST.md`
- `docs/07-ops/UI-REGRESSION-SMOKE.md`

## Acceptance Criteria

- A human can run one command for baseline demo readiness.
- Provider-key validation remains explicit and local-only.
- Demo checklist does not require private data.

## Validation

```bash
npm run demo:check
```

---

# PR 4 — Private Trial Run Kit Finalization

**Type:** Research / Product / Privacy  
**Priority:** P1  

## Goal

Make the private real-data trial easy to run without leaking private data into the repo.

## Scope

- Tighten the private trial worksheet.
- Add a redacted findings template.
- Add clear export-before-delete steps.
- Add explicit rule: findings must be anonymized before repo entry.

## Files Likely Touched

- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`

## Acceptance Criteria

- Trial can be run with 10 people and 25 notes.
- No private names, notes, or secrets are required in repo docs.
- Output is a redacted findings summary that can drive PRs.

## Validation

```bash
npm run build
```

---

# PR 5 — Post-Trial Findings Triage

**Type:** Product / App / Ops  
**Priority:** P1  

## Goal

Convert private trial findings into the next active execution queue.

## Scope

- Read redacted findings only.
- Update `NEXT-IN-HOPPER.md`.
- Move parked items to `FUTURE-TODO.md`.
- Update `PROJECT.md` or ADRs if product truth changes.

## Files Likely Touched

- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`
- `PROJECT.md`
- ADRs only if needed

## Acceptance Criteria

- Hopper contains 5-10 concrete tasks.
- No private trial data is committed.
- Work is prioritized by demo usefulness and privacy trust.

---

# PR 6 — Demo Polish From Trial Findings

**Type:** App / Design / Product  
**Priority:** P2  

## Goal

Apply the highest-impact polish found during private trial.

## Scope

- Keep changes narrow and trial-driven.
- Preserve private-desk tone.
- Avoid marketing copy and sales CRM language.

## Acceptance Criteria

- Top 2-4 usability issues from trial are addressed.
- Browser regression passes.
- Docs are updated if workflow truth changes.

## Validation

```bash
npm test
npm run build
npm run regression:browser
```

---

# Recommended Run Order

1. PR 1 — Provider Trial Hardening.
2. PR 3 — Demo Readiness Command And Checklist.
3. PR 4 — Private Trial Run Kit Finalization.
4. Run the private real-data trial outside the repo.
5. PR 5 — Post-Trial Findings Triage.
6. PR 6 — Demo Polish From Trial Findings.
7. PR 2 — Person Rail Component Boundary can happen anytime, but should not block demo validation.

---

# Current Blockers

- Provider-backed extraction failed the latest synthetic real-key trial.
- Private real-data trial still needs human-entered or carefully anonymized data.

---

# Non-Negotiables

- Do not commit real API keys.
- Do not commit private relationship data.
- Do not scrape private messages.
- Do not add automated sending.
- Do not add hidden scoring.
- Durable memories/open loops must remain source-backed and user-confirmed.
