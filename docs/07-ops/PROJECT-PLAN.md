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

As of 2026-06-25:

- Vite React TypeScript app exists.
- Seeded fake people exist.
- Local browser storage exists.
- People, Person Detail, Radar, Plot Board, Reflection Log, Settings, export/import/reset, validated extraction shell, deterministic fallback, editable generated next-move drafts, and generated/fallback briefs exist.
- Pure CRM state helpers exist for core mutations.
- Individual note deletion exists and removes source-backed memories/open loops from that note.
- Person deletion shows related-data consequences and detaches shared notes/interactions.
- Export actions show counts for private people and sensitive/private notes and memories.
- Review suggestions can be edited before save while keeping basis and sensitivity visible.
- Person detail shows a compact current-context snapshot and source labels for memories/open loops.
- Capture shows selected-person and note metadata.
- The real-use trial harness exists at `docs/07-ops/REAL-USE-TRIAL-HARNESS.md`.
- A simulated prototype trial report exists at `docs/07-ops/SIMULATED-PROTOTYPE-TRIAL-2026-06-23.md`.
- Automated simulated trial coverage exists in `src/lib/prototypeTrial.test.ts`.
- A synthetic real-use trial report exists at `docs/07-ops/SYNTHETIC-REAL-USE-TRIAL-2026-06-25.md`.
- `npm run trial:synthetic` runs the repeatable 25-note fake-data MVP trial.
- A browser synthetic trial report exists at `docs/07-ops/BROWSER-SYNTHETIC-TRIAL-2026-06-25.md`.
- `npm run trial:synthetic:browser` runs the fake 10-person / 25-note playable UI trial against a local app server.
- Deterministic extraction fallback now recognizes more normal relationship follow-up language and sensitive-context cues.
- Briefs and generated/fallback next moves handle sparse and sensitive/private context more gracefully, with direct, warmer, and careful next-move options.
- A manual browser smoke report exists at `docs/07-ops/MANUAL-BROWSER-SMOKE-2026-06-23.md`.
- A third browser smoke report exists at `docs/07-ops/MANUAL-BROWSER-SMOKE-2026-06-23-BIG-RUN-3.md`.
- A repeatable UI regression smoke checklist exists at `docs/07-ops/UI-REGRESSION-SMOKE.md`.
- A private real-data trial kit exists at `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`.
- A private trial dry run exists at `docs/07-ops/PRIVATE-TRIAL-DRY-RUN-2026-06-23.md`.
- The server-side AI integration boundary is documented in `docs/AI_INTEGRATION_BOUNDARY.md`.
- ADR 0005 captures the server-side AI boundary decision.
- AI extractor schema validation exists in `src/lib/aiExtractorSchema.ts`.
- AI backend shape is documented in ADR 0006.
- Local-first persistence before hosted backend is documented in ADR 0007.
- The extractor route/controller shell exists in `src/lib/aiExtractorRoute.ts`.
- Vite development HTTP transport for AI route shells exists in `vite.config.ts` and `src/lib/aiHttpTransport.ts`.
- Browser UI uses the development AI HTTP transport for note extraction, brief generation, and next-move generation with local fallback behavior.
- The OpenAI-compatible extractor provider adapter exists in `src/lib/serverAiProvider.ts`.
- The OpenAI-compatible brief and next-move provider adapters exist in `src/lib/serverAiProvider.ts`.
- Brief and next-move generation route shells exist in `src/lib/aiGenerationRoute.ts`.
- JSON export/import uses a current schema-versioned envelope plus an explicit migration registry that preserves unversioned raw-data import.
- JSON import preview includes counts, sample person names, note date range, and private/sensitive totals before replacement.
- JSON import preview includes a backup-before-replace export action for the current browser dataset.
- IndexedDB migration trigger criteria are documented in `docs/PERSISTENCE_BACKUP_PLAN.md`.
- Browser-level desktop regression automation exists at `scripts/browser-regression.mjs`.
- Browser-level mobile regression automation exists at `scripts/mobile-browser-regression.mjs` and is included in `npm run demo:check`.
- Synthetic provider-boundary trial automation exists at `scripts/provider-local-trial.mjs`.
- Mobile selected-person detail now opens as a drawer; see `docs/07-ops/MOBILE-PERSON-DETAIL-DRAWER-2026-06-25.md`.
- Demo PR packaging exists at `docs/07-ops/DEMO-PR-RUN-PLAN.md`.
- A real-key synthetic provider trial report exists at `docs/07-ops/PROVIDER-LOCAL-TRIAL-2026-06-23-REAL-KEY.md`.
- Settings has been extracted into `src/components/SettingsView.tsx`.
- Review Panel has been extracted into `src/components/ReviewPanel.tsx`.
- Reflection Log has been extracted into `src/components/ReflectionLog.tsx`.
- Plot Board has been extracted into `src/components/PlotBoard.tsx`.
- Note capture is wired through the validated extractor shell with deterministic fallback.
- Capture/review includes low-click review controls, keyboard shortcuts, person picker quick controls, and disabled capture until text and at least one person are selected.
- Settings includes schema-versioned JSON export, backward-compatible validated JSON import/restore with preview, Markdown export, reset, and prototype trial metrics.
- Vitest covers radar, extraction behavior, person add/update/delete, note capture contact updates, note deletion, accepted/edited/rejected suggestions, open loop status, next move status, and component interactions for `PlotBoard` and `PersonRail`.
- Real provider-backed server-side AI is not connected to a deployed production route yet.
- A human private-data trial has not been completed yet.
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

- Improve deterministic extraction suggestions after real-use trial findings.
- Decide whether rejected-suggestion audit behavior is needed.

## Exit Criteria

- Messy notes can become reviewed memories/open loops.
- Every durable memory/open loop is traceable to a note.
- Rejected suggestions are not saved.
- Sensitive/private suggestions are visible before save.
- Edited suggestions are saved with source note IDs.

---

# Milestone 3 — Real AI Extraction Boundary

## Goal

Introduce server-side AI extraction without weakening privacy, traceability, or user confirmation.

## Key Work

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
- Use `npm run regression:browser` for browser-level playable-path checks when Vite is running.
- Validate every meaningful change with `npm test` and `npm run build`.

## Documentation

- Update `PROJECT.md` when current truth changes.
- Update ADRs when architecture or product direction changes.
- Run the Shipping Update Skill after meaningful work.

---

# Planning Rule

Do not work directly from this whole-project plan.

When a milestone item becomes near-term, move a focused slice into `NEXT-IN-HOPPER.md` with acceptance criteria. Keep the rest parked in `FUTURE-TODO.md`.
