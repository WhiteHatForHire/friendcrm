# Full App QA Self-Audit Directive - 2026-07-07

## Objective

Run a full QA pass on Friend CRM as a local-first private relationship intelligence desk. The goal is to boot the local app, exercise every major surface with synthetic data, and leave a ranked fix list before real contact import or hosted expansion.

## Hard Boundaries

- Do not import real contacts, private messages, private notes, credentials, API keys, or user data.
- Use seeded fake people and synthetic trial data only.
- Do not add scraping, automated sending, hidden scoring, sales CRM terminology, or production infrastructure.
- Do not run provider-backed AI unless explicitly configured and approved; deterministic fallback is acceptable.
- Stop any local dev servers you start.

## Read First

1. `PROJECT.md`
2. `AGENTS.md`
3. `docs/START_HERE.md`
4. `docs/MVP_SPEC.md`
5. `docs/ARCHITECTURE.md`
6. `docs/AI_INTEGRATION_BOUNDARY.md`
7. `docs/AI_HTTP_TRANSPORT.md`
8. `docs/BACKUP_RESTORE.md`
9. `docs/DESIGN_SYSTEM.md`
10. `docs/07-ops/NEXT-IN-HOPPER.md`
11. This directive

## Audit Scope

Core app surfaces:

- People list.
- Person detail.
- Create/edit/delete person.
- Relationship notes.
- Sensitive/private note behavior.
- Memory extraction review shell.
- User-confirmed durable memory/open loop behavior.
- Radar.
- Plot Board.
- Reflection Log.
- Settings.
- Export/reset/delete data.
- Brief generation and next-move draft behavior.
- Deterministic fallback when provider is disabled.

Layouts:

- Desktop.
- Mobile narrow width.
- Tablet width.
- Mobile drawer behavior for person detail.
- Text overflow, sticky controls, and touch targets.

Data/privacy:

- Local storage behavior.
- Import/export schema behavior.
- No private data in fixtures or receipts.
- AI suggestions remain source-backed and user-confirmed before durable save.

## Local Validation Commands

```bash
npm test
npm run build
npm run demo:check
npm run regression:browser
npm run regression:mobile
npm run regression:tablet
npm run audit:browser
npm run smoke:ui
npm run trial:synthetic
npm run trial:synthetic:browser
```

If a browser script needs a running dev server, start one locally and shut it down when complete. Prefer disabling provider calls unless explicitly approved.

## QA Method

1. Inspect `git status --short --branch`.
2. Run static/unit validation.
3. Start local app only as needed.
4. Run browser/mobile/tablet regression scripts.
5. Manually inspect core surfaces if scripts identify gaps.
6. Fix narrow, low-risk local issues only if safe and clearly in scope.
7. Stop local processes.

## Required Output

Create:

```text
docs/07-ops/full-app-qa-2026-07-07.md
```

The receipt must include:

- Commit/branch tested.
- Commands run and results.
- Local boot status.
- Product-surface pass/fail table.
- Desktop/mobile/tablet findings.
- Privacy/source-backed-memory review.
- Ranked findings and recommended next action.

Update `docs/07-ops/NEXT-IN-HOPPER.md` if QA changes the immediate next task.
