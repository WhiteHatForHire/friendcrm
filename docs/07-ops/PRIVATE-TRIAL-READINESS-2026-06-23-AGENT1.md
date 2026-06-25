# Private Trial Readiness - Agent 1 - 2026-06-23

Synthetic/readiness scout only. No real private data, secrets, `.env.local` values, screenshots, or exports were used or inspected.

## Scope

- Read `PROJECT.md`, `AGENTS.md`, `docs/07-ops/SKILLS.md`, `docs/07-ops/NEXT-IN-HOPPER.md`, `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`, `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`, and `docs/07-ops/DEMO-CHECKLIST.md`.
- Checked relevant safety docs: `docs/AI_INTEGRATION_BOUNDARY.md`, ADR 0003, ADR 0004, and ADR 0005.
- Inspected the documented validation scripts without reading private env values.
- Ran synthetic validation only.

## Synthetic Dry-Run Results

### `npm run demo:check`

Result: PASS.

- `npm test`: 11 test files passed, 68 tests passed.
- `npm run build`: passed.
- `npm run smoke:ui`: passed all route and malformed-request checks with provider disabled.
- `npm run regression:browser`: passed app shell, brief, editable generated next move, capture/review, note delete, Plot Board movement, Settings export/import preview, person delete consequences, and mobile overflow checks.

### Synthetic provider-script shape check

Command shape used:

```bash
FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --host 127.0.0.1 --port 5175
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:provider
```

Result: PASS.

- Extract-memory route accepted synthetic note payload.
- Brief route accepted synthetic context.
- Next-move route returned drafts only.
- Invalid payload remained rejected.

The temporary server was stopped after the check.

## Handoff Assessment

The private-trial kit is sufficient to hand to a human today for a local/mock private trial if the human starts the app with providers explicitly disabled and keeps raw exports outside the repo.

It is not yet clear enough for a private trial that intentionally sends private notes to a real provider. That may be acceptable later, but the current kit should make provider mode an explicit consent decision before any private notes are entered.

## Top 5 Risks Or Gaps

1. Provider mode is the main ambiguity. `npm run demo:check` disables providers, but a normal dev server may use a server-side key if one is configured. For the next private trial, the human should run with `FRIEND_CRM_DISABLE_PROVIDER=1` unless they are deliberately testing provider behavior with private local use.
2. Browser/local-storage isolation is underspecified. The kit says reset/export, but does not require a fresh browser profile, incognito window, or dedicated local origin. Existing demo data and private trial data could mix.
3. Export handling is directionally safe but not operationally precise. The kit says keep exports outside the repo, but should also ask the human to choose a non-synced/private storage location and delete or secure raw exports after the trial.
4. Findings redaction is strong, but the handoff path still depends on human judgment. The template should be used only after rewriting findings as product behavior; no raw private notes, exact dates, direct quotes, contact details, screenshots, or exports should be handed back to an agent.
5. Destructive testing is documented, but restore confidence should be proven before deleting anything valuable. The human should export JSON and Markdown, import the JSON into preview, use Backup Current JSON before replacement, and only delete a disposable person/note.

## Can The Human Private Trial Run Now?

Yes, conditionally.

Recommended safe mode for the next private real-data trial:

```bash
FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --host 127.0.0.1 --port 5175
```

Run the trial with local browser data only, keep raw exports outside the repo, and record only redacted product findings using `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`.

## Recommended Next Action

Before entering private notes, add a one-line provider-mode decision to the human trial checklist: "For private real-data trial, start with `FRIEND_CRM_DISABLE_PROVIDER=1` unless this is explicitly a real-provider private trial."
