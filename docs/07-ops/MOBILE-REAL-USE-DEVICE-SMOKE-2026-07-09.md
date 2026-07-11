# Mobile Real-Use Device Smoke - 2026-07-09

**Tester:** Codex
**Scope:** Friend CRM Expo mobile prototype under `apps/mobile/`
**Mode:** Local-first, fake-data only, no EAS/TestFlight/App Store actions

## Verdict

Fresh local iPhone build/install passed and launched `Friend CRM Dev`.

The code-level repair path is present for the mobile new-person/Dossier workflow: a fake person can be added, Official Story can be edited, and Dossier quick-add can create a confirmed remembered thing, a loose thread, and a next move in local state. Memory and loose-thread quick-adds create source notes, the Dossier lists are derived immediately from the current data object, data is persisted through AsyncStorage, and JSON export uses the schema-versioned mobile envelope.

The remaining hands-on smoke is blocked on physical device UI access from this Codex run. The local build launched on the connected iPhone, but Codex cannot inspect or tap the physical phone screen or native share sheet from the workspace. A human should complete the touch-by-touch checklist below on the launched build.

## Native Build Receipt

Passed:

```bash
npm run mobile:check
```

Passed with local physical-device build/install/launch:

```bash
cd apps/mobile
npm run ios:device:dev
```

Result:

- Xcode `Release-iphoneos` build succeeded.
- JS bundle embedded successfully.
- App installed with bundle `com.symposiumstudios.friendcrm.dev`.
- App launched as `Friend CRM Dev`.
- No EAS, TestFlight, or App Store action was run.

Notes:

- The build output included normal React Native/Expo warnings from dependencies and Hermes global warnings.
- The command loaded local Expo public env variable names but no secret values were printed into this receipt.

## Simulator Attempt Receipt

Attempted:

```bash
npm --prefix apps/mobile run ios -- --device <booted simulator> --port 8099
```

Result:

- The command selected the intended booted simulator and reached `Planning build`.
- It then remained silent for several minutes.
- A side process check did not show an active Friend CRM `xcodebuild` or Metro process.
- The attempt was stopped and replaced with the local physical-device build path above.

## Code-Level Workflow Inspection

Relevant files:

- `apps/mobile/App.tsx`
- `apps/mobile/src/core/storage.ts`
- `apps/mobile/src/core/insights.ts`
- `apps/mobile/src/core/types.ts`

Observed implementation:

- Add-person flow creates a local `Person`, selects it, and opens Dossier.
- Official Story edits patch the selected `Person.summary`.
- Quick-add remembered thing creates a source `RelationshipNote` and confirmed `Memory`.
- Quick-add loose thread creates a source `RelationshipNote` and `OpenLoop`.
- Quick-add next move creates a queued `NextMove`.
- Dossier sections filter current `data.memories`, `data.openLoops`, and `data.nextMoves`, so created records appear immediately after state update.
- App-wide `useEffect` persists `data` through `saveData(data)`.
- `saveData` writes to AsyncStorage key `friend-crm:mobile:data:v1`.
- `loadData` reads that key on app start and falls back to demo fake data if storage is empty or malformed.
- `exportJson(data)` returns a schema-versioned `friend-crm-mobile` JSON envelope.
- Export/share status distinguishes shared/copied, dismissed, and failed outcomes.
- Compact labels use one-line shrinking text in badges/chips to avoid splitting `Sensitive`/`Private`.
- No forbidden sales-CRM UI terms were found in the mobile app scan; the only regex hit was the MIT license phrase `to deal`.

## Relationship Desk Demo Path

Use fake data only. Suggested fake person: `Johnny Test`.

1. Open `Friend CRM Dev`.
2. Go to People.
3. Add `Johnny Test`.
4. Confirm the keyboard can be dismissed and the submit action is reachable.
5. Confirm Dossier opens for `Johnny Test`.
6. Edit Official Story with synthetic context: `Met at a fake community dinner; likes short updates.`
7. Tap `Done Typing`.
8. In Quick Add, add remembered thing: `Prefers short voice notes before noon.`
9. Add loose thread: `Send the pretend reading list.`
10. Add next move: `Check in Friday with one low-pressure question.`
11. Confirm Things Remembered, Unfinished Business, and Next Moves update immediately in Dossier.
12. Force quit and reopen the app.
13. Confirm `Johnny Test` and the three added records persist.
14. Go to Evidence Locker.
15. Tap `Share Local JSON Export`.
16. Confirm the app reports shared/copied, dismissed, or failed status clearly.
17. Confirm no real contacts, names, relationship notes, chat exports, or private data were entered.

## Supabase / RLS Status

Not run in this directive pass.

Blocker:

- The hosted Supabase smoke still needs a confirmed fake test account or an explicit auth-setting decision.
- No fake test email/password or service-role credential was available in the directive context.
- No secrets were printed or committed.

Decision:

- Keep Supabase/RLS as a separate gated task.
- Do not use real accounts or real relationship data for this smoke.

## Remaining Human Smoke Checklist

- Create fake person on the physical iPhone build.
- Edit Official Story and dismiss keyboard.
- Add one remembered thing, one loose thread, and one next move.
- Confirm immediate Dossier update.
- Restart app and confirm AsyncStorage persistence.
- Share local JSON export and confirm status copy.
- Record pass/fail notes in `docs/07-ops/MOBILE-REAL-USE-REPAIR-INITIATIVE-2026-07-08.md`.

