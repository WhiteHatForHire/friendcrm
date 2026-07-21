# Front-Facing Demo Audit — 2026-07-21

## Scope

Desktop release-readiness review of the deterministic local Friend CRM web
demo. This audit covers the People desk, navigation, demo-data controls, and
the Evidence Locker's public-facing posture. It does not authorize real-data
collection, provider calls, or hosted sync.

## Implemented In This Pass

- Removed the dense desktop telemetry strip so the product opens directly into
  the working desk.
- Added a persistent sidebar control that clears sample data in one action and
  changes to `Restore demo` when the desk is empty.
- Added the same clear-data action to Evidence Locker.
- Hid the system mouse cursor for fine-pointer devices and replaced the former
  dot trail with a retro rainbow trail of arrow pointers. Touch and
  reduced-motion behavior remain unaffected.

## What Is Already Working

- The People desk quickly communicates a relationship workspace through a
  readable list, active dossier, and privacy-forward visual language.
- The fake-data flow is deterministic, local to browser storage, and can be
  cleared and restored without a reload.
- The retro bureau presentation is distinctive without obscuring the primary
  people and notes workflow.

## Highest-Value Release Improvements

1. Add a first-run choice: `Take the 60-second tour` or `Open a blank desk`.
   The current seeded desk is useful, but first-time visitors need a clear way
   to understand the intended path before confronting the full workspace.
2. Simplify hosted-demo Evidence Locker. Keep export, restore, clear, and a
   concise local-only privacy note. Hide prototype trial targets and inactive
   sync scaffolding behind an advanced area or omit them from the public demo.
3. Seed three curated story threads with visible breadcrumbs: a pending intro,
   a private boundary, and an active collaboration. The existing sample data
   proves breadth, while these small stories would prove the workflow.
4. Make the right dossier rail progressive. Keep the three most useful blocks
   open and collapse lower-priority detail until a visitor asks for it.
5. Give every destination a one-sentence purpose and one first action. People
   is already close; Radar, Plot Board, Debrief, and Review should immediately
   explain why someone would open them.

## Additional Recommendations

- Keep `Demo data. Local to this browser.` near reset controls only, instead of
  repeating technical demo status throughout the interface.
- Use plain core action labels such as `Add person` and `Save note`; reserve
  bureau jokes for secondary copy, empty states, and receipts.
- Capture four or five clean desktop states and a short walkthrough after the
  curated-tour work is in place.
- Consider a small cursor-effects setting after public feedback, while keeping
  reduced-motion support as the default accessibility guardrail.

## Validation Receipt

- Browser inspection at `http://127.0.0.1:5177` confirmed no desktop top
  chrome, a hidden fine-pointer system cursor, and an active cursor trail.
- Clearing the demo left the desk empty and exposed `Restore demo`.
- Restoring the demo repopulated all 10 seeded people.

## Release Boundary

These source changes are ready for local review. The currently staged Symposium
static package is a separate release artifact and needs to be regenerated after
the public-demo scope above is approved and its production branch is ready.
