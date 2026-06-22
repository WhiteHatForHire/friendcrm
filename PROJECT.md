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
- People, Person Detail, Radar, Plot Board, Reflection Log, Settings, export/reset, deterministic extraction suggestions, and deterministic briefs exist.
- Real server-side AI is not wired yet.
- Durable AI-generated memory still must require explicit user confirmation.

---

## Current Technical Direction

- Frontend: Vite React TypeScript.
- Styling: custom CSS for the current MVP.
- Data: local browser storage for the current prototype.
- AI: deterministic source-backed suggestions for now; real AI should be server-side only when implemented.
- Auth: none for local demo.
- Tests: Vitest for focused logic coverage.

Reference docs:

- [`START_HERE.md`](docs/START_HERE.md)
- [`MVP_SPEC.md`](docs/MVP_SPEC.md)
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`AI_INTEGRATION_BOUNDARY.md`](docs/AI_INTEGRATION_BOUNDARY.md)
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

---

## Current Non-Priorities

- No message scraping.
- No automated sending or automated outreach.
- No multi-user accounts.
- No social graph visualization beyond a simple board.
- No calendar/email integrations.
- No mobile app.
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
