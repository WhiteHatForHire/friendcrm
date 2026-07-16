# MOBILE-EXPO-PORT-2026-07-01.md - Expo iOS Prototype

This document records the first Expo mobile port of Friend CRM.

Status: first usable local-first prototype.

---

# What Was Built

Added an Expo TypeScript app at:

`apps/mobile/`

The mobile app is a reinterpretation of Friend CRM for iOS/mobile, not a pixel-for-pixel copy of the Vite web app.

It preserves the core product stance:

- Tongue-in-cheek retro relationship bureau.
- Fake/demo data by default.
- Local-first persistence.
- Source-backed review before durable memory.
- No scraping.
- No automated outreach.
- No hidden scoring.
- No provider calls from mobile.
- No real API keys or private data in the repo.

---

# Mobile Screens

## People

- Loads fake seed people.
- Search people.
- Add a person.
- Shows vibe, trust, privacy, loose threads, and last-seen signal.
- Includes prominent `Reset Fake Friends` control.

## Person Dossier

- Shows person profile, city, relationship labels, vibe, trust, privacy, summary, memories, open loops, and next moves.
- Allows lightweight editing of summary, city, vibe, and privacy.
- Shows deterministic pre-meeting brief from local data.

## Debrief

- Captures a note.
- Allows one or more people to be selected.
- Runs deterministic/source-backed extraction using copied core logic.
- Shows editable review suggestions.
- Requires explicit approval before suggestions become durable memories/open loops.

## Plot Board

- Mobile-first status sections.
- Status changes use chips/buttons instead of drag/drop.
- Person names link back to dossier context.

## Evidence Locker

- Shows local prototype counts.
- Resets to fresh fake friends.
- Clears local data.
- Shares local JSON export through React Native `Share`.
- Imports backup JSON through paste-in text area.

---

# Data And Persistence

Persistence uses:

`@react-native-async-storage/async-storage`

The storage adapter lives at:

`apps/mobile/src/core/storage.ts`

The first mobile pass stores a schema-versioned mobile export envelope:

```ts
{
  schemaVersion: 1,
  exportedAt: string,
  app: "friend-crm-mobile",
  data: CrmData
}
```

No Supabase or hosted persistence was added. This follows the current local-first product direction.

---

# Shared / Copied Core

The first pass copies stable web logic into:

- `apps/mobile/src/core/types.ts`
- `apps/mobile/src/core/seed.ts`
- `apps/mobile/src/core/insights.ts`

This avoids a risky monorepo/package extraction during the first port.

Future improvement:

- Extract shared model, seed, and deterministic insight logic into a proper shared package if the mobile app continues.

---

# How To Run

Install mobile dependencies:

```bash
npm --prefix apps/mobile install
```

Start Expo:

```bash
npm run mobile:start
```

Run iOS:

```bash
npm run mobile:ios
```

Run web smoke target:

```bash
npm run mobile:web
```

Type-check mobile:

```bash
npm run mobile:check
```

---

# Validation

Passed:

- `npm --prefix apps/mobile run check`
- `npm run build`
- Expo web smoke through Playwright at `http://localhost:8081`

Smoke screenshot:

`docs/07-ops/mobile-expo-port-2026-07-01-web-smoke.png`

iOS attempt:

- `npm --prefix apps/mobile run ios` started Metro.
- Expo attempted to open on `iPhone 17 Pro`.
- The command remained at the Expo Go fetch/open step for more than two minutes without emitting an error.
- The server was stopped to avoid leaving a long-running process.

Follow-up:

- Re-run `npm run mobile:ios` with the simulator/Expo Go path fully available and capture an iOS screenshot.

---

# Known Gaps

- Mobile app uses copied core logic instead of a shared package.
- Import is paste-based rather than document-picker-based.
- Export uses share-sheet text rather than a dedicated file flow.
- No profile photo upload on mobile yet.
- No hosted persistence.
- No real provider calls.
- No App Store/EAS build configuration beyond basic Expo scaffold.
- No automated native E2E test yet.

---

# Next Recommended Work

1. Run on iOS simulator and capture screenshots.
2. Add a real document import/export flow with Expo file/document APIs.
3. Extract shared core package if both web and mobile will keep moving.
4. Add Expo screenshot set for the Symposium Studios portfolio page.
5. Decide whether mobile remains a portfolio companion or becomes a production target.

