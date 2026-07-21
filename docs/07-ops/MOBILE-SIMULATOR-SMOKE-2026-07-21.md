# Mobile Simulator Smoke — 2026-07-21

## Scope

Validate the current mobile source, including the demo-control repair, in an
iPhone 17 simulator before spending another TestFlight build.

## Environment

- Simulator: iPhone 17, iOS 26.5
- App: locally built `Friend CRM Dev`
- Data: bundled fake sample data and simulator-only synthetic contact data

## Passed

- Native iOS simulator build installed and launched from the current source.
- People, Dossier, Evidence Locker, and bottom navigation rendered without a
  JavaScript crash.
- Clearing the sample desk produced a true empty People screen with no
  `Clear Demo Data` card.
- Adding a local person after clearing the sample desk kept that demo-only card
  hidden, which verifies the release-blocking regression fix.
- Local person data survived terminate and relaunch.
- Evidence Locker restored the bundled sample desk and its expected 10 people,
  5 notes, and 5 memories.
- `npm run check` passed.
- Native simulator logs contained no Friend CRM JavaScript exception or crash.

## Non-Blocking Simulator Notes

- The generic React Native developer badge, `Open debugger to view warnings`,
  is present in the local debug build. It is not an app warning and is absent
  from a TestFlight release build.
- Simulator accessibility automation duplicated a typed test name after a
  failed accessibility set-value attempt. This was an automation-input
  artifact, not a Friend CRM save or rendering defect.

## Release Readiness

No simulator-discovered blocker remains. The next TestFlight candidate should
include the mobile demo-control repair, then receive one short physical-iPhone
confirmation before App Store submission.
