# Synthetic Private Trial Rehearsal - 2026-06-23

Synthetic/readiness pass only. No real private data, secrets, `.env.local` values, screenshots, or exports were used, inspected, printed, or committed.

## Scope

- Read `PROJECT.md`, `AGENTS.md`, `docs/07-ops/SKILLS.md`, `docs/07-ops/NEXT-IN-HOPPER.md`, `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`, `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`, `docs/07-ops/DEMO-CHECKLIST.md`, and `docs/07-ops/PRIVATE-TRIAL-READINESS-2026-06-23-AGENT1.md`.
- Inspected validation scripts for demo readiness, browser regression, UI smoke, and provider-route trial behavior.
- Ran synthetic validation only.
- Did not edit `NEXT-IN-HOPPER.md`, `COMPLETED.md`, or `FUTURE-TODO.md`.

## Summary

Friend CRM is ready for a cautious local/mock private-trial rehearsal with synthetic or human-entered local data, provided the trial starts with provider calls explicitly disabled and raw exports stay outside the repo. The automated baseline is healthy and exercises the core playable path: app shell, brief generation, editable generated next moves, capture/review/save, note deletion, Plot Board movement, JSON export, malformed import rejection, import preview, backup-before-replace, person delete consequences, and mobile overflow.

The remaining readiness risk is not basic app availability. It is human-trial operational clarity: provider mode, browser data isolation, export storage, and redacted handoff discipline need to remain explicit before any real private notes are entered.

## Redaction Confirmation

- [x] No private names.
- [x] No contact details.
- [x] No direct quotes from private notes.
- [x] No exact private dates, places, employers, or channels.
- [x] No screenshots or exports.
- [x] No API keys, secrets, or `.env.local` content.
- [x] Findings are written as product behavior, not private story details.

## Validation

### `npm run demo:check`

Result: PASS.

- `npm test`: 11 test files passed, 69 tests passed.
- `npm run build`: passed.
- `npm run smoke:ui`: passed app shell and AI-route shape checks with provider disabled.
- `npm run regression:browser`: passed app shell, brief rendering, editable generated next move, capture/review save, note delete, Plot Board movement, Settings export/import preview, person delete consequences, and mobile overflow.

### Synthetic Provider-Route Rehearsal

Command shape:

```bash
FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --host 127.0.0.1 --port 5175
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:provider
```

Result: PASS.

- Extract-memory route accepted a synthetic private-desk note.
- Brief route accepted synthetic context.
- Next-move route returned drafts only.
- Invalid route payload remained rejected.
- Temporary local server was stopped after the check.

## Synthetic Rehearsal Checks

| Area | Result | Notes |
| --- | --- | --- |
| Provider-disabled baseline | Pass | `demo:check` starts Vite with `FRIEND_CRM_DISABLE_PROVIDER=1`. |
| Source-backed review path | Pass | Browser regression captures a note, shows review suggestions, accepts them, and saves durable records. |
| Generated next moves | Pass | Browser regression verifies generated drafts can be edited before adding. Provider-route trial confirms drafts only. |
| Briefs | Pass | Browser regression verifies a generated/fallback brief renders with route/fallback labeling. |
| Export/import safety | Partial pass | JSON export, malformed import rejection, import preview, and backup-before-replace are exercised. Markdown export and full replacement/restore are not exercised by `demo:check`. |
| Delete safety | Pass | Note delete cleanup and person delete consequence visibility are exercised. |
| Browser data isolation | Manual | Regression clears the app local-storage key, but human private trials still require a fresh profile, private window, or dedicated local origin. |
| Findings handoff | Manual | Template is strong, but redaction remains a human discipline before findings are shared back to agents. |

## Top Findings

1. The local/mock demo baseline is healthy enough to support a human private-trial rehearsal.
2. The safest first private trial should still use `FRIEND_CRM_DISABLE_PROVIDER=1`; a normal local dev server can use a configured server-side key unless the tester deliberately disables provider calls.
3. Automated coverage exercises the core playable path, but it does not replace the full private-trial kit target of 10 people, 25 notes, accepted memories/open loops, multiple briefs, Markdown export, and restore confidence.
4. Export/import confidence is strong for preview and backup-before-replace, but the human trial should still prove the export-before-delete path before deleting anything valuable.
5. The biggest repo-safe reporting risk is accidental over-sharing in findings. Raw notes, screenshots, exact private details, exports, and `.env.local` content should never be handed back to an agent.

## Trust / Privacy Concerns

- Provider mode is the main consent boundary. Keep mock/local behavior as the default for private real-data trialing unless real-provider private use is explicitly chosen.
- Browser storage can silently mix seed, demo, and trial records if the tester does not isolate the origin or profile.
- Exported JSON and Markdown contain private relationship context by design. They should be stored outside the repo in a private location and secured or deleted after the trial.
- Sensitive/private context may be useful in briefs, but the human trial should explicitly check whether it appears too prominently for comfort.

## Recommended Hopper Items

1. Add a short "Private Trial Start Command" block to the human-facing trial checklist that makes `FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --host 127.0.0.1 --port 5175` the default first private-trial mode.
2. Add a "Fresh Browser / Dedicated Origin" preflight checkbox to reduce local-storage mixing between seed, demo, and private trial data.
3. Expand browser regression or add a separate synthetic trial script for Markdown export, full import replacement, restore-from-export confidence, and the minimum trial dataset shape.
4. Add a final redaction gate to the findings workflow: rewrite findings as product behavior before any agent sees them.
5. Add a human-trial check for brief sensitivity prominence so private/sensitive records are visible but not accidentally over-emphasized.

## Recommended Next Action

Run the human private real-data trial next in provider-disabled local mode, using `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`. Record only redacted product findings with `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`, then let the main agent move concrete work into the hopper.
