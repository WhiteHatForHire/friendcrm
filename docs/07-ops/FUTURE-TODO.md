# FUTURE-TODO.md — Parked Backlog

This document tracks future work that is not currently in the active hopper.

Do not use this as the near-term execution list. Active work belongs in `NEXT-IN-HOPPER.md`.

Move items from this file into `NEXT-IN-HOPPER.md` only when they are ready to be worked on soon.

---

# Product Backlog

Items below are parked until they are ready to move into `NEXT-IN-HOPPER.md`. The whole-project map lives in `PROJECT-PLAN.md`.

---

## Milestone 0 — Project Brain And Decisions

- Add Project Brain Audit Skill.
- Add ADR Creation Skill.

## Milestone 1 — Deterministic Local Core

- Extract state transition helpers from large UI components where useful.
- Add UI-level integration coverage for the most important CRUD flows after the UI settles.
- Add export coverage for people, notes, memories, open loops, next moves, and interactions.
- Add optional export filtering for sensitive/private records if real use shows it is needed.

## Milestone 2 — Source-Backed Review Workflow

- Improve deterministic extraction suggestions.
- Add edit-before-save for suggested memories and open loops.
- Show source note basis near every proposed durable record.
- Add sensitivity flags to review flow.
- Add tests for accepted and rejected suggestions.
- Add rejected-suggestion behavior if needed for auditability.

## Milestone 3 — Real AI Extraction Boundary

- Document server-side Memory Extractor route contract.
- Add extractor schema validation.
- Specify failure and fallback behavior for invalid AI output.
- Document prompt logging policy.
- Add server-only API key handling with no real secrets.
- Wire AI extractor output into the existing review surface.
- Keep deterministic fallback available for local/demo use.

## Milestone 4 — Briefs And Next Moves

- Add server-side pre-meeting brief route.
- Add server-side next-move generator route.
- Add copy/edit flow for next moves.
- Add risk reasons and warmer/more direct alternatives.
- Add sensitive context warnings in briefs and next moves.
- Test brief behavior when context is sparse or missing.

## Milestone 5 — Demo Polish And Real-Use Trial

- Improve visual polish and scanning density.
- Add basic keyboard shortcuts.
- Add better empty states.
- Improve responsive behavior.
- Add sample dataset reset flow if current reset is not enough.
- Run the MVP success test with 25 notes across 10 people.
- Log real-use friction into hopper or future backlog.

## Milestone 6 — Persistence And Deployment Decision

- Compare IndexedDB, SQLite, Supabase/Postgres, and local file/database options.
- Decide whether remote access matters.
- Decide whether auth is needed.
- Record persistence decision in an ADR.
- Add deployment notes after the MVP is worth sharing.
- Document backup/export path for local-only use.

## Milestone 7 — Post-MVP Expansion

- Explore calendar/email integrations after local MVP proves useful.
- Consider multi-user accounts only after single-user private workflow works.
- Explore simple social graph visualization after Plot Board is useful.
- Add mobile app or mobile-specific experience later.
- Explore relationship recovery workflows.
- Explore trip/dinner planning mode.

---

## Product

- Add calendar/email integrations after the local MVP proves useful.
- Consider multi-user accounts only after the single-user private workflow works.
- Explore a simple social graph view after the Plot Board is useful.
- Add mobile app or mobile-specific experience later.

## Design

- Polish dense table/list scanning states after core CRUD is stable.
- Add keyboard shortcuts for fast capture and navigation.
- Refine empty states around real use, not marketing copy.

## Engineering

- Move local browser storage to SQLite, IndexedDB, or a small backend once persistence needs are clearer.
- Split large UI components into focused modules when behavior stabilizes.
- Add broader tests for export, delete, and review flows.

## AI / Automation

- Add server-side Memory Extractor with schema validation.
- Add pre-meeting brief generation using confirmed context.
- Add next-move generation with risk explanations.
- Add drift detection using interaction history.

## Backend / Infra

- Add single-user auth only when remote persistence exists.
- Add deployment notes after the MVP is ready for a hosted demo.

## Research

- Test whether the app answers the MVP questions after 25 notes across 10 people.
- Compare local storage, IndexedDB, SQLite, and Supabase for the next persistence step.

## Ops

- Add Project Brain Audit Skill.
- Add ADR Creation Skill.
- Add Design Foundation Skill.
- Add App Scaffold Skill.

---

# Future Product Ideas

- Private relationship recovery checklist for neglected important people.
- Lightweight trip/dinner planning mode.
- Relationship-specific boundaries and "do not repeat" review surface.

---

# Parking Lot

Use this section for raw ideas that are not ready to spec.
