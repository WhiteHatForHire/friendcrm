# Full Goal-Based QA Receipt - 2026-07-09

**Tester:** Codex
**Target:** Friend CRM local-first web app plus Expo mobile prototype
**Mode:** Provider disabled / deterministic local fallback
**Primary URL:** `http://127.0.0.1:5188/`

## Verdict

Web/local-first QA passes after two fixes:

- Evidence Locker now keeps local export/restore controls above optional hosted sync on mobile.
- The person-rail next-move generator now gives the objective input enough width instead of squeezing it beside the action button.

The web product is playable against the documented MVP path: people management, profile editing, relationship fields, notes, review-confirmed memories/open loops, deterministic/provider-disabled AI fallback, next-move drafts, Plot Board movement, export/import preview, sample restore, delete consequences, and mobile/tablet responsive layouts.

Native iOS build/install succeeded, but runtime verification is blocked by existing non-Friend CRM Metro servers occupying ports `8081` and `8083`.

## Scope Comparison

| Expected area | QA result |
| --- | --- |
| First-run and seeded fake data | Pass. Browser runs start from cleared local storage and built-in fake people. |
| Contact creation/editing | Pass. Add-person, profile fields, relationship labels, contact/social fields, photo upload/remove, persistence, filters, and why-now signals are covered. |
| Relationship notes/reminders | Pass. Debrief capture saves notes, delete confirmation removes source-backed records, open loop statuses update. |
| Source-backed memory review | Pass. Notes save first; suggested memories/open loops remain non-durable until accepted. Rejected suggestions do not persist. |
| Deterministic AI/fallback | Pass. Provider-disabled route smoke, brief generation, extraction, and next-move drafts all return validated local/mock/fallback output. |
| Next-move suggestions | Pass. Drafts are editable, not auto-added, and only enter Plot Board after explicit Add. |
| Import/export/reset/delete | Pass. JSON and Markdown exports trigger, malformed import is blocked, valid import preview requires panic copy/acknowledgement, sample restore confirms replacement, person delete shows consequences. |
| Privacy/safety copy | Pass. Export warning, local-only status, sensitive/private labels, source receipts, no-scraping copy, and hosted write arming remain visible. |
| Empty/loading/error states | Pass for covered web states: empty extraction, empty memories/open loops/notes, malformed import, provider fallback, delete panels, drawer close. |
| Responsive/mobile/tablet | Pass after Evidence Locker ordering fix. No horizontal overflow in mobile/tablet regressions. |
| Native iOS simulator | Build/install pass; runtime blocked by existing Metro servers from other projects. |
| Hosted Supabase RLS | Not covered. Existing hopper task still needs a confirmed fake account/auth decision. |
| Real provider AI | Intentionally not covered. Provider disabled for safe deterministic QA. |

## Screenshots

Primary receipt folder:

- `docs/07-ops/full-qa-2026-07-09/screenshots/`
- `docs/07-ops/full-qa-2026-07-09/mobile/`
- `docs/07-ops/full-qa-2026-07-09/tablet/`

Counts:

- Full browser audit: 21 screenshots.
- Mobile regression: 6 screenshots.
- Tablet regression: 12 screenshots.
- iOS simulator blocker evidence: 2 screenshots.

Key files:

- `screenshots/desktop-people.png`
- `screenshots/desktop-review-panel.png`
- `screenshots/desktop-import-preview.png`
- `screenshots/mobile-settings.png`
- `mobile/mobile-settings.png`
- `tablet/tablet-768x1024-settings.png`
- `ios-simulator-after-mobile-ios.png`
- `ios-simulator-after-port-8083.png`

## Fixes Made

1. Moved optional hosted sync below local export/restore actions in Evidence Locker.
   - Keeps local-first backup controls above the fold on mobile.
   - Preserves hosted sync as guarded optional infrastructure.

2. Stacked the next-move generator input and button in the person rail.
   - Prevents the objective field from shrinking beside `Cook Something Up`.
   - Cleared visual audit input clipping findings.

3. Tightened `scripts/full-browser-audit.mjs` input clipping classification.
   - Browser-native input types and unlabeled native input noise are ignored.
   - Button/select/textarea and real visible control clipping checks remain active.

## Validation Commands

Passed:

- `FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check`
- `npm test`
- `npm run build`
- `npm audit --audit-level=moderate`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5188 FRIEND_CRM_DISABLE_PROVIDER=1 FRIEND_CRM_AUDIT_DIR=docs/07-ops/full-qa-2026-07-09/screenshots npm run audit:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5188 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5188 FRIEND_CRM_DISABLE_PROVIDER=1 FRIEND_CRM_MOBILE_SCREENSHOT_DIR=docs/07-ops/full-qa-2026-07-09/mobile npm run regression:mobile`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5188 FRIEND_CRM_DISABLE_PROVIDER=1 FRIEND_CRM_TABLET_SCREENSHOT_DIR=docs/07-ops/full-qa-2026-07-09/tablet npm run regression:tablet`
- `npm run mobile:check`
- `npm run mobile:ios` build/install step completed with `0 error(s), and 1 warning(s)`.
- `npm --prefix apps/mobile run ios -- --port 8083` build/install step completed with `0 error(s), and 0 warning(s)`.

Final full baseline result:

- `npm test`: 14 files passed, 80 tests passed.
- `npm run build`: production build passed.
- UI smoke: 7 checks passed.
- Desktop browser regression: 16 checks passed.
- Mobile browser regression: 5 checks passed.
- Tablet browser regression: 8 checks passed.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.

## Blockers And Risks

- Native iOS runtime verification is blocked by local environment port conflicts:
  - `8081` is owned by `DreamPostcards/app/mobile`.
  - `8083` is owned by `AnchorSobriety/artifacts/mobile-app`.
  - Expo skipped starting Friend CRM Metro in both attempts and opened an existing development-client server instead.
- Supabase authenticated fake-user RLS smoke remains unverified.
- Real provider-backed AI was not tested by design; this run used provider-disabled deterministic behavior only.
- Existing repo worktree had substantial pre-existing uncommitted changes before this QA pass. This receipt does not separate historical changes into commit boundaries.

## Recommended Next Steps

1. Free or override Expo Metro ports, then rerun iOS simulator smoke until Friend CRM content is visible.
2. Complete the Supabase confirmed test account and RLS smoke with fake data.
3. Do a commit/PR readiness review to separate existing historical/generated changes from this QA pass.
