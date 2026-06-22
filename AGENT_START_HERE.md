# Agent Start Here - Friend CRM

## Mission

Build the first working MVP of Friend CRM: a private relationship intelligence desk.

## Source docs

Use these docs as the product contract:

- `docs/START_HERE.md`
- `docs/MVP_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/PROMPTS.md`
- `docs/BUILD_PLAN.md`

## Recommended first implementation

1. Scaffold a Next.js or Vite React app.
2. Implement deterministic data model first.
3. Add seeded fake people.
4. Build People, Person Detail, Radar, Plot Board, and Reflection Log.
5. Add AI memory extraction only after CRUD and review flows work.
6. Add pre-meeting brief and next-move generation.
7. Add export/delete.

## Hard constraints

- Do not build automated sending.
- Do not scrape private messages.
- Do not use sales CRM language.
- Do not save AI-generated memories without user confirmation.
- Keep sensitive/private note handling visible.

## Definition of done

The MVP is done when a user can enter 25 notes across 10 people, accept extracted memories/open loops, generate a useful brief, and export/delete data.

