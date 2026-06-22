# PROJECT-PLAN.md — Whole Project Plan

This document gives the whole-project plan for Friend CRM.

Use it as the map. Use `NEXT-IN-HOPPER.md` as the near-term execution queue. Use `FUTURE-TODO.md` as the parked backlog.

---

# Product North Star

Friend CRM should become a private relationship intelligence desk for a real social life.

It helps one person remember people, preserve context, track promises, prepare before contact, and notice drift before it becomes neglect.

The product is not a sales CRM. It must avoid automated outreach, message scraping, hidden scoring, and durable AI-generated memory without user confirmation.

---

# MVP Definition Of Done

The MVP is shippable when Marcus can:

- Enter and manage at least 50 people.
- Capture at least 25 interaction notes across at least 10 people.
- Review and accept extracted memories and open loops.
- See who needs attention through Radar.
- Plan next moves through Plot Board.
- Generate useful pre-meeting briefs from confirmed context.
- Export all data.
- Delete notes and people with clear consequences.
- Keep sensitive/private notes visible, labeled, and user-controlled.

---

# Current State

As of 2026-06-22:

- Vite React TypeScript app exists.
- Seeded fake people exist.
- Local browser storage exists.
- People, Person Detail, Radar, Plot Board, Reflection Log, Settings, export/reset, deterministic extraction suggestions, and deterministic briefs exist.
- Pure CRM state helpers exist for core mutations.
- Individual note deletion exists and removes source-backed memories/open loops from that note.
- Person deletion shows related-data consequences and detaches shared notes/interactions.
- Export actions show counts for private people and sensitive/private notes and memories.
- The server-side AI integration boundary is documented in `docs/AI_INTEGRATION_BOUNDARY.md`.
- ADR 0005 captures the server-side AI boundary decision.
- Vitest covers radar, extraction behavior, person add/update/delete, note capture contact updates, note deletion, accepted suggestions, open loop status, and next move status.
- Real server-side AI is not wired yet.
- Initial ADRs exist under `docs/06-decisions/`.
- The project brain audit exists at `docs/07-ops/PROJECT-BRAIN-AUDIT.md`.
- The project operating system exists under `docs/07-ops/`.

---

# Milestone 0 — Project Brain And Decisions

## Goal

Make the repo self-orienting for future human and AI work.

## Key Work

- Audit project docs for coherence.
- Create initial ADRs for current stack and product constraints.
- Keep `PROJECT.md`, `AGENTS.md`, ops docs, and source docs aligned.
- Add reusable skills as they become useful.

## Exit Criteria

- Future agents can identify the current objective, constraints, architecture, and next task without guessing.
- Major product and architecture decisions are captured in ADRs.
- Active, future, and completed work are clearly separated.

---

# Milestone 1 — Deterministic Local Core

## Goal

Make the non-AI app dependable enough for real private use.

## Key Work

- Tighten Person CRUD.
- Tighten Note CRUD.
- Tighten Open Loop CRUD.
- Tighten Next Move CRUD.
- Make delete behavior explicit and tested.
- Make export behavior complete and trustworthy.
- Improve test coverage around state transitions.
- Keep local-first behavior intact.

## Exit Criteria

- A user can manage people, notes, memories, open loops, next moves, and exports without AI.
- Radar reliably surfaces neglected people and overdue promises.
- Delete/export flows are understandable and safe.
- `npm test` and `npm run build` pass.

---

# Milestone 2 — Source-Backed Review Workflow

## Goal

Make the review workflow strong enough that AI can later plug into it safely.

## Key Work

- Improve deterministic extraction suggestions.
- Make suggestion accept/reject/edit behavior explicit.
- Show source note basis near every proposed memory/open loop.
- Support sensitivity flags in the review flow.
- Persist only accepted records.
- Add tests for review behavior.

## Exit Criteria

- Messy notes can become reviewed memories/open loops.
- Every durable memory/open loop is traceable to a note.
- Rejected suggestions are not saved.
- Sensitive/private suggestions are visible before save.

---

# Milestone 3 — Real AI Extraction Boundary

## Goal

Introduce server-side AI extraction without weakening privacy, traceability, or user confirmation.

## Key Work

- Implement schema validation for extractor output.
- Implement failure and fallback behavior.
- Add server-only API key handling.
- Wire the UI review surface to AI suggestions.
- Keep deterministic fallback available for local/demo use.

## Exit Criteria

- AI can propose structured memories and open loops from notes.
- Invalid AI output is rejected safely.
- No prompts containing private raw notes are logged in production.
- No accepted durable memory exists without explicit user action.
- No real secrets are committed.

---

# Milestone 4 — Briefs And Next Moves

## Goal

Make the product useful before a dinner, call, meeting, date, ask, or repair conversation.

## Key Work

- Add pre-meeting brief route.
- Use confirmed memories, recent notes, open loops, and sensitive boundaries.
- Add next-move generator route.
- Include risk reasons and warmer/more direct alternatives.
- Add copy/edit flow.
- Add sensitive context warnings.

## Exit Criteria

- User can generate a concise useful brief in under 10 seconds.
- Briefs use only supplied context.
- Next moves are editable and never sent automatically.
- Sensitive boundaries are surfaced clearly.

---

# Milestone 5 — Demo Polish And Real-Use Trial

## Goal

Make the MVP smooth enough to use repeatedly and evaluate honestly.

## Key Work

- Improve visual polish and scanning.
- Add empty states.
- Add basic keyboard shortcuts.
- Add sample dataset reset.
- Improve mobile/responsive behavior enough for review.
- Run the MVP success test with 25 notes across 10 people.

## Exit Criteria

- Marcus can use the app before and after real interactions.
- The app answers the core MVP questions.
- Friction points from real use are logged into the hopper or future backlog.

---

# Milestone 6 — Persistence And Deployment Decision

## Goal

Decide whether the next step is still local-only, local database, or hosted backend.

## Key Work

- Compare IndexedDB, SQLite, Supabase/Postgres, and simple local file/database options.
- Decide whether remote access matters.
- Decide whether auth is needed.
- Add deployment notes only after the product flow is worth sharing.

## Exit Criteria

- Persistence decision is recorded in an ADR.
- If hosted, privacy and logging posture are documented.
- If local-only, backup/export path is documented.

---

# Milestone 7 — Post-MVP Expansion

## Goal

Expand only after the private single-user product proves useful.

## Candidate Work

- Calendar/email integrations.
- Mobile app.
- Multi-user or shared context.
- Social graph visualization.
- Trip/dinner planning mode.
- Relationship recovery workflows.
- Advanced drift detection.

## Exit Criteria

- Expansion work is supported by real usage signals.
- New features do not compromise privacy, consent, or source-backed memory.

---

# Cross-Cutting Workstreams

## Privacy

- Keep sensitive/private labels visible.
- Avoid prompt logging of raw personal data.
- Make export/delete dependable.
- Do not add scraping or automated sending.

## Product Language

- Keep the app strategic and a little funny.
- Avoid sales CRM language.
- Prefer human relationship language over operational sales terms.

## Testing

- Grow tests around state transitions before adding complex AI behavior.
- Keep smoke checks simple and repeatable.
- Validate every meaningful change with `npm test` and `npm run build`.

## Documentation

- Update `PROJECT.md` when current truth changes.
- Update ADRs when architecture or product direction changes.
- Run the Shipping Update Skill after meaningful work.

---

# Planning Rule

Do not work directly from this whole-project plan.

When a milestone item becomes near-term, move a focused slice into `NEXT-IN-HOPPER.md` with acceptance criteria. Keep the rest parked in `FUTURE-TODO.md`.
