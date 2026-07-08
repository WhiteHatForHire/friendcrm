# Full App QA Self-Audit Receipt - 2026-07-07 Directive

**Run date:** 2026-07-08
**Worker:** isolated app QA pass
**Branch tested:** `main`
**Commit tested:** `df1c9e3` - `Add full app QA self-audit directive`
**Directive:** `docs/07-ops/FULL_APP_QA_SELF_AUDIT_DIRECTIVE_2026-07-07.md`

## Scope And Boundaries

Executed a local-first full app QA pass using seeded fake people and synthetic data only.

- No real contacts, private notes, credentials, API keys, or private exports were imported.
- No provider-backed AI was intentionally run. The temporary Vite server was started with `OPENAI_API_KEY`, `AI_PROVIDER_API_KEY`, and `AI_PROVIDER_MODEL` unset.
- No app code changes were made.
- Temporary local server was stopped after browser QA.

## Commands Run

| Command | Result | Notes |
| --- | --- | --- |
| `git status --short --branch` | Pass | Started clean on `main...origin/main`. |
| `npm test` | Pass | 13 test files, 79 tests passed. |
| `npm run build` | Pass | TypeScript and Vite production build succeeded. |
| `npm run demo:check` | Pass | Demo baseline passed with provider mode disabled; nested test/build/smoke/browser/mobile/tablet checks passed. |
| `npm run trial:synthetic` | Pass | 1 prototype synthetic trial test passed. |
| `lsof -nP -iTCP:5174 -sTCP:LISTEN || true` | Pass | Port was free before local boot. |
| `env -u OPENAI_API_KEY -u AI_PROVIDER_API_KEY -u AI_PROVIDER_MODEL npm run dev -- --port 5174` | Pass | Local app booted at `http://127.0.0.1:5174/`. |
| `npm run regression:browser` | Pass | 16 browser regression checks passed. |
| `npm run regression:mobile` | Pass | 5 mobile regression checks passed. |
| `npm run regression:tablet` | Pass | 8 tablet breakpoint checks passed. |
| `FRIEND_CRM_AUDIT_DIR=docs/07-ops/full-app-qa-2026-07-07-screens npm run audit:browser` | Pass with medium findings | No blockers; repeated mobile tagline clipping warnings plus desktop input clipping warnings. |
| `npm run smoke:ui` | Pass | 7 HTTP/UI smoke checks passed. |
| `npm run trial:synthetic:browser` | Pass | 6 browser synthetic trial checks passed with fake 10-person / 25-note dataset. |
| `lsof -nP -iTCP:5174 -sTCP:LISTEN || true` | Pass | No listener remained after shutdown. |
| `rg -n "\\b(lead\|leads\|pipeline\|deal\|deals\|conversion\|campaign\|scrap\|send automatically\|automated send\|hidden scoring)\\b" src docs package.json scripts` | Pass with expected docs hits | No app-code sales/scraping/sending/scoring violations found; hits were rule/prohibition docs. |
| `rg -n "OPENAI_API_KEY\|AI_PROVIDER\|dangerouslySetInnerHTML\|localStorage\|friend-crm:data:v1\|confirmed\|sourceNoteId" src scripts vite.config.ts docs/AI_INTEGRATION_BOUNDARY.md docs/BACKUP_RESTORE.md` | Pass | Confirmed server-only provider references, localStorage key, and source-backed confirmed memory paths. |

## Local Boot Status

Local boot succeeded on `http://127.0.0.1:5174/` with provider env vars unset. Browser scripts exercised the app through Playwright against that local server. The server was stopped and port `5174` was verified clear afterward.

## Product Surface Pass/Fail

| Surface | Verdict | Evidence |
| --- | --- | --- |
| People list | Pass | Browser regression, mobile regression, tablet regression, full audit screenshots. |
| Person detail | Pass | Desktop rail, mobile drawer, tablet drawer, brief generation, profile editing, photo upload/remove paths passed. |
| Create/edit/delete person | Pass | Add/edit fields persist; delete consequences panel appears. |
| Relationship notes | Pass | Capture, note persistence, note deletion cleanup passed. |
| Sensitive/private note behavior | Pass | Badges visible; export counts include private/sensitive totals; synthetic private records exercised. |
| Memory extraction review shell | Pass | Review panel requires explicit user action; empty extraction keeps note and disables durable save. |
| User-confirmed durable memory/open loops | Pass | Accepted edited memory saved; rejected open loop stayed out; code scan confirms `confirmed` and `sourceNoteId` paths. |
| Radar | Pass | Browser and synthetic trial verified cold/protected/overdue/opening signals. |
| Plot Board | Pass | Desktop drag and mobile/tablet status-select flows passed and persisted. |
| Reflection Log | Pass | Capture flow and review shell passed on desktop and mobile. |
| Settings / Evidence Locker | Pass | JSON export, Markdown export path, import preview, sample restore, privacy counts, and rail hiding passed. |
| Export/reset/delete data | Pass | Export/download, saved-export preview, sample restore, person delete panel, and note delete passed. |
| Brief generation | Pass | Deterministic/local route output rendered with source-backed context and provider-disabled fallback language. |
| Next-move drafts | Pass | Drafts generated, editable, and not auto-added until explicit Add. |
| Deterministic fallback | Pass | Demo check reported provider disabled; smoke routes returned validated mock/local outputs. |

## Layout Review

| Layout | Verdict | Notes |
| --- | --- | --- |
| Desktop | Pass with medium polish follow-up | No blocker overflow. Audit flagged some tight input controls in generated moves/poster/delete states. Visual review shows the right-rail objective input can feel cramped beside the action button. |
| Mobile narrow | Pass with medium polish follow-up | No horizontal overflow in regression and synthetic trial. Audit repeatedly flagged the mobile classified-tagline button as clipped. Visual review confirms the top tagline/control is very tight at `390px`. |
| Tablet | Pass | `768x1024` and `834x1112` People, drawer, compact editor, Plot Board, Review Panel, and Settings checks passed. |
| Mobile drawer behavior | Pass | Drawer opens/closes, person detail/brief renders, and Settings hides dossier rail. |
| Text overflow/sticky controls/touch targets | Pass with medium review note | Primary flows work. Review panel sticky action area is functional but dense on mobile when scrolled into the suggestion stack. |

## Privacy And Source-Backed Memory Review

- App storage remains local browser `localStorage` under `friend-crm:data:v1` for the current prototype.
- Export/restore UI warns that exports include private relationship data and reports sensitive/private totals.
- Browser trial used a synthetic 10-person / 25-note dataset only.
- Provider-backed AI was not invoked intentionally; local/mock transport handled extractor, brief, and next-move checks.
- Provider code remains server-side in `src/lib/serverAiProvider.ts`; browser UI uses the local HTTP boundary.
- Durable memory remains source-backed by `sourceNoteId` and confirmed before use in generation contexts.
- No scraping, automated sending, hidden scoring, or app-code sales CRM terminology was found in the inspected source paths.

## Ranked Findings

1. **Medium - Mobile classified tagline/control clips at narrow width.**
   The full browser audit reported the same control clipping across every audited mobile surface. Visual review of `mobile-people-closed-drawer.png` confirms the top classified strip is very tight on `390px`.

2. **Medium - Right-rail generated move/objective input is cramped on desktop.**
   The scanner reported input clipping in generated move, poster lab, and delete panel screenshots. The clearest visible issue is the objective input beside `Cook Something Up`, where text truncates aggressively in the narrow rail.

3. **Low/Medium - Mobile review panel is usable but dense.**
   The review sheet works and tests pass, but the sticky action area can visually crowd the suggestion list while scrolled. This matches earlier parked future work about restacking/collapsing dense review modal items.

## Recommended Next Action

Run a narrow UI polish pass before private real-data trial:

1. Fix or simplify the mobile classified-tagline control so it does not clip at `390px`.
2. Give the generated next-move objective/input row a more forgiving responsive layout in the right rail.
3. Re-run `npm run audit:browser`, `npm run regression:mobile`, and `npm run trial:synthetic:browser`.

No blocker prevents continued synthetic/local QA, but these medium UI issues should be resolved before asking a human to trust the app with private relationship data.
