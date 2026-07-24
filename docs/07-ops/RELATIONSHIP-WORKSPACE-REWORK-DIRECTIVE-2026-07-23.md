# Relationship Workspace Rework Directive

**Status:** Approved for implementation

## Outcome

Make Friend CRM read as one calm, private relationship workspace rather than a
set of novelty screens. Keep the retro bureau flavor in supporting copy, while
making the primary jobs immediately clear.

## Product Decisions

### 1. Dossier is intentional, never sticky

- Opening a person from People, a move, or Debrief opens that person's Dossier.
- Opening the Dossier tab directly starts at a neutral picker, not the last
  person viewed.
- The picker explains the job of a Dossier, provides a People shortcut, and
  offers recent people when available.
- Loading, import, reset, and clearing must not silently select the first
  person just to fill the Dossier screen.

### 2. Plot Board becomes Next Moves

- Its job is to plan, defer, and complete small relationship follow-ups.
- Retain the existing stored statuses for compatibility, but present them as
  `Next`, `Later`, `Complete`, and `Archived`.
- A newly created move starts in `Next`.
- Use direct language in the heading, empty states, controls, and notices.
- Keep light wit only in secondary help text.

### 3. Debrief is post-contact capture

- Name the surface `Debrief` rather than `Debrief Booth`.
- Lead with: choose the people involved, write what happened, then review any
  proposed durable records.
- Preserve explicit approval for memories and unfinished business.

### 4. Evidence becomes Settings

- Name the primary navigation entry `Settings`.
- Keep privacy, local storage, export, import, demo data controls, and display
  preferences together.
- `Evidence Locker` may remain an optional visual joke in a secondary
  description, but it must not be the user-facing navigation concept.

## Implementation Scope

- Update the Expo mobile app end-to-end, including tab behavior, notifications,
  Dossier empty state, Next Moves copy, Debrief copy, and Settings copy.
- Align the desktop/browser demo's navigation and Plot Board/ Debrief/Settings
  copy with the same product language.
- Do not change persisted schemas, AI behavior, data ownership, or local-first
  storage. Existing status values map to the new labels in the UI.

## Acceptance Criteria

- Direct Dossier tab opens a neutral picker and does not show the prior person.
- Selecting a person from People, Next Moves, or Debrief opens their Dossier.
- New moves appear under `Next`; moves can be changed to `Later`, `Complete`,
  or `Archived`.
- Primary navigation says `Next Moves`, `Debrief`, and `Settings` where those
  destinations are exposed.
- No primary product copy asks the user to understand `Bad Idea?`, `Loaded`,
  `Handled`, or `Evidence Locker`.
- Existing records and status values remain readable and editable.
- Type checks, tests, web build, and a fresh local iPhone install pass.
- No EAS/TestFlight build is used for the device test.

## Non-Goals

- No hosted sync, back-end, schema, or AI change.
- No automated outreach, scraping, hidden scoring, or real-data expansion.
