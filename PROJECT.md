# PROJECT.md — Friend CRM

Friend CRM is a private relationship intelligence desk. It helps one person remember people, promises, context, social opportunities, boundaries, and next moves without turning personal life into sales software.

The product should feel organized, strategic, slightly uncomfortable in the right way, and fast to scan.

---

## Current Objective

Turn the initial local-first MVP into a trustworthy private relationship desk that can support real use:

- Manage people.
- Capture relationship notes.
- Extract source-backed memories and open loops.
- Review and confirm durable records.
- See who needs attention.
- Plan next moves.
- Generate useful pre-meeting briefs.
- Export and delete user-owned data.

The current next work should be selected from [`NEXT-IN-HOPPER.md`](docs/07-ops/NEXT-IN-HOPPER.md).

---

## Current Phase

Phase 1 / early Phase 2:

- Vite React TypeScript app exists.
- Seeded fake people exist.
- Local browser storage exists.
- People, Person Detail, Radar, Next Moves, Debrief, Settings, export/reset, validated extraction shell, deterministic fallback, and deterministic briefs exist.
- Browser UI can use development AI HTTP routes for extraction, briefs, and generated next moves, with local fallback behavior.
- OpenAI-compatible server-side provider adapters exist for development/server use when a server-side key is configured.
- Desktop, mobile, and tablet browser regression checks are part of the local demo readiness baseline.
- Expo TypeScript mobile app prototype exists under `apps/mobile/` with local fake-data persistence and reset controls.
- Supabase hosted persistence foundation exists as optional schema/client work, with a hosted `friendcrm` Supabase project linked, the initial migration pushed, and a guarded web auth/sync UI in Settings.
- A repeatable synthetic real-use trial can exercise 25 fake notes across the seed people through the core logic paths.
- A browser-level synthetic trial can exercise a fake 10-person / 25-note dataset through the playable UI.
- Mobile Dossier opens intentionally from a person selection; its direct tab starts with a neutral picker rather than a persisted active person.
- Mobile People editing is grouped into compact profile sections on narrow screens.
- Briefs and next-move drafts handle sparse/private context more gracefully, with direct, warmer, and careful next-move options.
- Real provider-backed AI is not deployed to a production route yet.
- Durable AI-generated memory still must require explicit user confirmation.

---

## Current Technical Direction

- Frontend: Vite React TypeScript.
- Mobile: Expo React Native TypeScript prototype under `apps/mobile/`.
- Styling: custom CSS for the current MVP.
- Data: local browser storage for the current prototype.
- Export/import: schema-versioned JSON envelopes with backward-compatible raw-data import and an explicit migration registry.
- Persistence: stay local-first by default; optional Supabase hosted persistence foundation exists for future authenticated sync, with the hosted schema currently applied in Supabase project `mjrqxmcicoreeovitscy` and web sync kept behind sign-in plus an explicit write arming switch.
- AI: deterministic source-backed suggestions plus validated route shells and Vite development HTTP transport; real provider calls must stay server-side and keep deterministic fallback.
- Auth: none for local demo.
- Tests: Vitest for focused logic coverage.

Reference docs:

- [`START_HERE.md`](docs/START_HERE.md)
- [`MVP_SPEC.md`](docs/MVP_SPEC.md)
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`AI_INTEGRATION_BOUNDARY.md`](docs/AI_INTEGRATION_BOUNDARY.md)
- [`AI_HTTP_TRANSPORT.md`](docs/AI_HTTP_TRANSPORT.md)
- [`BACKUP_RESTORE.md`](docs/BACKUP_RESTORE.md)
- [`SUPABASE_BACKEND.md`](docs/SUPABASE_BACKEND.md)
- [`DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`PROMPTS.md`](docs/PROMPTS.md)
- [`BUILD_PLAN.md`](docs/BUILD_PLAN.md)

---

## Current Decisions

Architecture Decision Records live in [`docs/06-decisions/`](docs/06-decisions/README.md).

Current accepted decisions:

- [`ADR 0001 - Vite React Local-First MVP`](docs/06-decisions/0001-vite-react-local-first-mvp.md)
- [`ADR 0002 - Deterministic Core Before AI`](docs/06-decisions/0002-deterministic-core-before-ai.md)
- [`ADR 0003 - Source-Backed User-Confirmed Memory`](docs/06-decisions/0003-source-backed-user-confirmed-memory.md)
- [`ADR 0004 - No Scraping, Automated Sending, Or Hidden Scoring`](docs/06-decisions/0004-no-scraping-automated-sending-hidden-scoring.md)
- [`ADR 0005 - Server-Side AI Integration Boundary`](docs/06-decisions/0005-server-side-ai-boundary.md)
- [`ADR 0006 - AI Backend Shape`](docs/06-decisions/0006-ai-backend-shape.md)
- [`ADR 0007 - Local-First Persistence Before Hosted Backend`](docs/06-decisions/0007-local-first-persistence-before-hosted-backend.md)
- [`ADR 0008 - Optional Supabase Hosted Persistence`](docs/06-decisions/0008-optional-supabase-hosted-persistence.md)

---

## Current Non-Priorities

- No message scraping.
- No automated sending or automated outreach.
- No multi-user accounts.
- No social graph visualization beyond a simple board.
- No calendar/email integrations.
- No production mobile release.
- No sentiment surveillance.
- No production infrastructure until explicitly requested.
- No real API keys, credentials, private data, or user data in the repo.

---

## Non-Negotiables

- Do not use sales CRM language such as "lead", "pipeline", "deal", "conversion", or "campaign".
- User owns all data.
- Sensitive/private notes must be easy to flag, export, and delete.
- The database owns facts; AI proposes structure and language.
- Do not save AI-generated memories or open loops without user confirmation.
- Keep AI suggestions traceable to user-entered notes.
- Check ADRs before changing architecture or major product direction.

---

## Current Operating Docs

- [`OPERATING-MANUAL.md`](docs/07-ops/OPERATING-MANUAL.md) — how to use the repo as an agentic project brain and shipping system.
- [`PROJECT-PLAN.md`](docs/07-ops/PROJECT-PLAN.md) — whole-project roadmap and milestone plan.
- [`DEMO-PR-RUN-PLAN.md`](docs/07-ops/DEMO-PR-RUN-PLAN.md) — PR-sized path to a fully functional local demo product.
- [`DEMO-CHECKLIST.md`](docs/07-ops/DEMO-CHECKLIST.md) — local demo validation command and human demo checklist.
- [`NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md`](docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md) — goal-based swarm directive for a self-checking launch-demo push.
- [`PROMPT-TEMPLATE.md`](docs/07-ops/PROMPT-TEMPLATE.md) — reusable prompt templates for agent runs.
- [`SKILLS.md`](docs/07-ops/SKILLS.md) — master index of reusable project skills.
- [`NEXT-IN-HOPPER.md`](docs/07-ops/NEXT-IN-HOPPER.md) — active near-term build queue.
- [`FUTURE-TODO.md`](docs/07-ops/FUTURE-TODO.md) — parked backlog and future ideas.
- [`COMPLETED.md`](docs/07-ops/COMPLETED.md) — completed work log.
- [`SHIPPING-UPDATE-SKILL.md`](docs/07-ops/SHIPPING-UPDATE-SKILL.md) — reusable skill for updating project state after meaningful work.

---

## How To Move The Project

1. Read `PROJECT.md`, `AGENTS.md`, `docs/07-ops/SKILLS.md`, and `docs/07-ops/NEXT-IN-HOPPER.md`.
2. Pick one focused task from the hopper.
3. Read the relevant product or architecture docs.
4. Make the smallest useful change.
5. Validate with the relevant commands.
6. Run the Shipping Update Skill.
7. Keep completed work out of the active hopper.
