# AGENTS.md — Agent Instructions

This repo is Friend CRM: a private relationship intelligence desk for remembering people, context, promises, boundaries, social opportunities, and next moves.

Read `PROJECT.md` first. It is the current source of truth.

---

# Required Orientation

Before meaningful work, read:

1. `PROJECT.md`
2. `AGENTS.md`
3. `docs/07-ops/SKILLS.md`
4. `docs/07-ops/NEXT-IN-HOPPER.md`
5. Relevant product, design, architecture, prompt, or ADR docs

Important product docs:

- `docs/START_HERE.md`
- `docs/MVP_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/PROMPTS.md`
- `docs/BUILD_PLAN.md`

Check `docs/06-decisions/` before changing architecture or major product direction. Create or update ADRs when decisions change.

---

# Product Rules

- Keep Friend CRM a private relationship intelligence desk, not a sales CRM.
- Do not use sales CRM language such as "lead", "pipeline", "deal", "conversion", or "campaign".
- Do not scrape private messages.
- Do not build automated sending or automated outreach.
- Do not add hidden scoring.
- Do not add real user data, private data, secrets, credentials, or API keys.
- Keep user-owned data exportable and deletable.
- Keep sensitive/private note handling visible near the relevant content.
- Any AI-generated durable memory or open loop must be source-backed and explicitly user-confirmed.
- Build deterministic CRUD and review flows before real AI features.

---

# Engineering Rules

- Keep changes focused and reviewable.
- Prefer the existing Vite React TypeScript app structure.
- Preserve local-first behavior until a persistence decision is documented.
- Do not create production infrastructure unless explicitly asked.
- Do not commit or push unless explicitly asked.
- Run relevant validation before finalizing work.
- Update docs or ADRs when product truth, architecture, privacy posture, or AI behavior changes.

Useful validation commands:

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

---

# Skills and Operating Docs

The repo uses reusable skills and operating docs to keep agentic work organized.

## Skills Index

Agents should check:

- `docs/07-ops/SKILLS.md`

## Operating Docs

The main operating docs are:

- `docs/07-ops/OPERATING-MANUAL.md` — how to use the repo as an agentic project brain and shipping system.
- `docs/07-ops/PROJECT-PLAN.md` — whole-project roadmap and milestone plan.
- `docs/07-ops/PROMPT-TEMPLATE.md` — reusable prompt templates for common agent runs.
- `docs/07-ops/NEXT-IN-HOPPER.md` — active near-term build queue.
- `docs/07-ops/FUTURE-TODO.md` — parked backlog and future ideas.
- `docs/07-ops/COMPLETED.md` — completed work log.
- `docs/07-ops/SHIPPING-UPDATE-SKILL.md` — reusable skill for updating project state after meaningful work.

## Required Agent Behavior

When starting meaningful work:

1. Read `PROJECT.md`.
2. Read `AGENTS.md`.
3. Check `docs/07-ops/SKILLS.md`.
4. Check `docs/07-ops/NEXT-IN-HOPPER.md`.
5. Read relevant product, design, architecture, prompt, or ADR docs.
6. Make the smallest useful change.
7. Update docs or ADRs if product truth changes.
8. Run the Shipping Update Skill after completed meaningful work.
9. Summarize completed work and open follow-ups.

Every meaningful PR should update one of:

- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`

Do not let completed work remain as active work in the hopper.

## Symposium Publishing Boundary

- This repo may contribute public-safe artifacts to `symposiumstudios.ai`, but
  it must never deploy or alias the shared production domain.
- Use a transfer brief and merge the contribution into
  `../symposium-studios`; that repo is the sole production publisher.
- Preview URLs may remain isolated. Never run `vercel --prod`,
  `vercel deploy --prod`, or `vercel alias` for the Symposium project here or
  from a temporary snapshot.
- Read `../../standards/symposium-production-deployment.md` before public web
  publishing work.
