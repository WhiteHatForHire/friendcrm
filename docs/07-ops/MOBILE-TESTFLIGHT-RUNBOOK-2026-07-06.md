# MOBILE-TESTFLIGHT-RUNBOOK-2026-07-06.md - Friend CRM Expo TestFlight Run

Status: submitted to App Store Connect; waiting for Apple processing.

Goal: get the Expo mobile prototype uploaded to TestFlight as a local-first fake-data prototype.

---

# Release Candidate

- App: Friend CRM
- Bundle ID: `com.symposiumstudios.friendcrm`
- Version/build: `1.0.0` with EAS remote build numbers.
- EAS owner: `symposiumstudios`
- Apple ID: configured in EAS submit profile from the Anchor submission pattern.
- Apple Team ID: configured in EAS submit profile from the Anchor submission pattern.
- EAS project: `@symposiumstudios/friend-crm-mobile`
- EAS project ID: `86b2980d-e2de-4d45-853a-1012f4d98a5f`
- App Store Connect app ID: `6787891531`
- Distribution certificate serial: `51FA294196211C44B1950FD717E51E0E`
- Provisioning profile Developer Portal ID: `6SD442R5FZ`
- Apple Team: `Q9B7K2SJ4D`
- Current EAS build ID: `c22199f4-7cde-4622-a1ba-58739536e81d`
- Current EAS submit ID: `3673b203-0049-4bcf-bc32-660e47ff6da2`
- TestFlight URL: `https://appstoreconnect.apple.com/apps/6787891531/testflight/ios`
- Current EAS submission URL: `https://expo.dev/accounts/symposiumstudios/projects/friend-crm-mobile/submissions/3673b203-0049-4bcf-bc32-660e47ff6da2`
- Current IPA URL: `https://expo.dev/artifacts/eas/0-NBhviKtYITugWTabKusldJ1j7hkagf8H8IxRAtTW4.ipa`
- Current App Store Connect build: `1.0.0 (11)`
- Data mode: local fake data only.
- AI/provider calls: not included in mobile release candidate.
- Private data: none committed or bundled intentionally.

---

# TestFlight Scope

This candidate should be submitted as a prototype for internal TestFlight first.

It should not be represented as a production private-data app yet because:

- Mobile hosted sync controls are not implemented.
- Supabase fake-user RLS smoke is still pending.
- Mobile import/export is paste/share based.
- iOS device/simulator QA is still pending for this candidate.

---

# Required App Store Connect Setup

- App record created in App Store Connect.
- Bundle ID: `com.symposiumstudios.friendcrm`.
- ASC app ID: `6787891531`.
- EAS reported the name `Friend CRM` was already taken and created the App Store Connect record as `Friend CRM (c0b031)`. Rename later in App Store Connect if a better available listing name is chosen.
- Add beta test information:
  - Beta description: `Friend CRM is a tongue-in-cheek private relationship desk prototype for fake-data testing. It helps testers add people, capture debrief notes, review source-backed memories/open loops, plan next moves, export local data, and reset to sample data.`
  - What to test: `Test People, Dossier, Debrief, Review, Plot Board, Evidence Locker, reset fake friends, local persistence, export/share, and paste import. Use fake data only.`
  - Feedback email: use the Symposium/Apple account support email chosen in App Store Connect.
- Add internal testers first.
- External testers/public link can follow after Beta App Review if needed.

---

# Validation Checklist

- [x] `npm --prefix apps/mobile run check`
- [x] `npm test`
- [x] `npm run build`
- [x] EAS project created and linked.
- [x] `npm run mobile:ios` launched Metro and Expo Go on `iPhone 17 Pro`.
- [x] iOS bundle completed in Expo Go.
- [x] Captured iOS smoke screenshot at `docs/07-ops/testflight-2026-07-06/ios-smoke-home.png`.
- [ ] Smoke People.
- [ ] Smoke Dossier edit.
- [ ] Smoke Debrief note capture.
- [ ] Smoke Review approval/rejection.
- [ ] Smoke Plot Board status changes.
- [ ] Smoke Evidence Locker reset/export/import.
- [ ] Capture full iOS screenshot set.
- [x] Run EAS production build.
- [x] Submit production build to App Store Connect/TestFlight.
- [x] Replace default Expo app icon with branded Friend CRM icon assets.
- [x] Submit icon refresh build `1.0.0 (10)` to App Store Connect/TestFlight.
- [x] Fix Evidence Locker clear-local-data loading lock and mobile Plot Board missing creation flow.
- [x] Submit fix build `1.0.0 (11)` to App Store Connect/TestFlight.
- [x] Internal TestFlight access enabled for `stephensm2011@gmail.com`.
- [ ] Wait for Apple build processing to finish.
- [ ] Confirm build appears under TestFlight.
- [ ] Add any additional internal testers.

---

# 2026-07-06 Run Log

Completed:

- Read Anchor app-store and EAS configuration from `AnchorSobriety/artifacts/mobile-app/`.
- Added Friend CRM iOS bundle ID: `com.symposiumstudios.friendcrm`.
- Added Friend CRM EAS config using the Anchor profile pattern.
- Created and linked EAS project `@symposiumstudios/friend-crm-mobile`.
- EAS project URL: `https://expo.dev/accounts/symposiumstudios/projects/friend-crm-mobile`
- EAS project ID: `86b2980d-e2de-4d45-853a-1012f4d98a5f`
- Ran local validation:
  - `npm --prefix apps/mobile run check`
  - `npm test`
  - `npm run build`
- Ran iOS Expo smoke:
  - Metro started.
  - Expo Go installed on `iPhone 17 Pro`.
  - App bundled successfully.
  - Screenshot saved.

Observed:

- Expo Go first-run developer menu overlay appeared over the app. This is not expected in the standalone TestFlight binary.
- Runtime warning: React Native `SafeAreaView` is deprecated. This is not blocking for TestFlight but should be cleaned up in a follow-up.

Initial blocker resolved:

- `eas build --platform ios --profile production` reached Apple credential setup.
- EAS restored the Apple account from local keychain and logged in with the stored password.
- Apple required a 6-digit 2FA code for `stephensm2011@gmail.com`.
- No code was available during the active prompt window, so the interactive EAS build was stopped.
- `eas build:list --platform ios --limit 5 --json --non-interactive` returned `[]`, so no Friend CRM iOS build was queued before the stop.

Follow-up run:

- Apple 2FA/signing setup was completed.
- New provisioning profile was active:
  - Distribution certificate serial: `51FA294196211C44B1950FD717E51E0E`
  - Developer Portal ID: `6SD442R5FZ`
  - Apple Team: `Q9B7K2SJ4D`
  - Expiration: `2027-05-15`
- Production EAS build queued and finished.
- Build ID: `4d107817-7fbf-467d-bea8-01d8779f6945`
- App version/build: `1.0.0 (3)`
- IPA: `https://expo.dev/artifacts/eas/G4TD1lSEvPDuC40rFjFvtiycew9CLn0a7AV0GLozcUg.ipa`
- Bundle identifier registered in Apple Developer.
- App Store Connect app created with ASC app ID `6787891531`.
- EAS created TestFlight group `Team (Expo)`.
- TestFlight access enabled for `stephensm2011@gmail.com`.
- Existing App Store Connect API key `A625YUMQ65` was reused from EAS servers.
- Submission scheduled and completed.
- EAS submit ID: `6e8d4eca-0d3a-4300-ac0d-c46ea13f6ecf`
- App Store Connect processing URL: `https://appstoreconnect.apple.com/apps/6787891531/testflight/ios`

Icon refresh run:

- Replaced the default Expo placeholder icon with branded Friend CRM assets:
  - `apps/mobile/assets/icon.png`
  - `apps/mobile/assets/splash-icon.png`
  - `apps/mobile/assets/favicon.png`
  - `apps/mobile/assets/android-icon-background.png`
  - `apps/mobile/assets/android-icon-foreground.png`
  - `apps/mobile/assets/android-icon-monochrome.png`
- Added root `.easignore` so EAS uploads the mobile app without bulky unrelated repo artifacts.
- Updated Expo from `57.0.1` to `57.0.2` after `expo-doctor` flagged the SDK patch mismatch.
- Validated:
  - `npm --prefix apps/mobile run check`
  - `npx expo-doctor`
  - `npx expo export:embed --eager --platform ios --dev false --entry-file index.ts --bundle-output /tmp/friendcrm-ios.bundle --assets-dest /tmp/friendcrm-assets`
- Two intermediate icon-refresh builds failed before the archive filter was corrected:
  - Build `1.0.0 (8)` failed because the first root `.easignore` was too broad.
  - Build `1.0.0 (9)` failed because `src/` was excluded from the mobile archive.
- Current icon-refresh build succeeded:
  - Build ID: `62462331-4f4a-4e94-8f15-48afe2c76e4d`
  - App version/build: `1.0.0 (10)`
  - IPA: `https://expo.dev/artifacts/eas/Xn4c2yrDyUAtt6cg238yOZGdkH9mSt2ICDAYPf2crt8.ipa`
- Current icon-refresh submission succeeded:
  - Submit ID: `c9f771bc-b70c-4093-91dd-50f5a0a3029c`
  - Submission URL: `https://expo.dev/accounts/symposiumstudios/projects/friend-crm-mobile/submissions/c9f771bc-b70c-4093-91dd-50f5a0a3029c`
  - App Store Connect processing URL: `https://appstoreconnect.apple.com/apps/6787891531/testflight/ios`

Evidence clear and Plot Board fix run:

- Root cause for the Evidence Locker bug:
  - `Clear Local Evidence` intentionally set `people: []`.
  - The app shell treated any state without a selected person as a loading state.
  - Result: clearing local data put the app into a valid empty dataset, but the UI rendered `Loading private bureau...` forever.
- Fix:
  - The app now treats only `data === null` as loading.
  - Empty datasets render explicit empty-bureau screens instead of the loading screen.
  - Evidence clear now confirms the destructive action, clears AsyncStorage, leaves the user on Evidence Locker, and explains that the empty desk is intentional.
  - Load failures recover into an empty desk with a visible notice instead of hanging.
- Plot Board mobile gap:
  - Mobile previously only showed status chips for existing moves.
  - Desktop has a person-rail workflow for creating/manual/generative next moves, so mobile felt like it was missing the planning entry point.
- Plot Board fix:
  - Added a mobile-native Plot Board composer: choose target person, write the move, add optional rationale, choose risk, and file it into `Bad Idea?`.
  - Renamed mobile status controls to match desktop labels: `Bad Idea?`, `Loaded`, `Handled`, `Never Mind`.
  - Added column counts and plain-language helper copy.
- Validation:
  - `npm --prefix apps/mobile run check`
  - `npx expo-doctor`
  - `npm test`
  - `npm run build`
  - `npx expo export:embed --eager --platform ios --dev false --entry-file index.ts --bundle-output /tmp/friendcrm-ios-clear-plot-fix.bundle --assets-dest /tmp/friendcrm-clear-plot-assets`
- Current fix build succeeded:
  - Build ID: `c22199f4-7cde-4622-a1ba-58739536e81d`
  - App version/build: `1.0.0 (11)`
  - IPA: `https://expo.dev/artifacts/eas/0-NBhviKtYITugWTabKusldJ1j7hkagf8H8IxRAtTW4.ipa`
- Current fix submission succeeded:
  - Submit ID: `3673b203-0049-4bcf-bc32-660e47ff6da2`
  - Submission URL: `https://expo.dev/accounts/symposiumstudios/projects/friend-crm-mobile/submissions/3673b203-0049-4bcf-bc32-660e47ff6da2`
  - App Store Connect processing URL: `https://appstoreconnect.apple.com/apps/6787891531/testflight/ios`

Current state:

- The Evidence/Plot Board fix binary has been uploaded to App Store Connect.
- Apple is processing build `1.0.0 (11)`.
- Apple normally takes several minutes before the build appears in TestFlight.
- No App Store review submission has been made.
- No external TestFlight public link has been created yet.

---

# Known Prototype Limits

- Local-first only.
- No real provider-backed AI calls.
- No mobile Supabase auth/sync controls yet.
- No native document picker import/export yet.
- No automated native E2E test yet.
