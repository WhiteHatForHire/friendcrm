# Friend CRM

Private relationship intelligence desk for remembering people, context, promises, social opportunities, and next moves.

## App

This repo now contains a Vite React TypeScript MVP. It runs fully in the browser with local storage and seeded demo data.

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm test
npm run build
npm audit --audit-level=moderate
```

## Current MVP Surface

- People list with filtering, quick add, inline profile edits, warmth, importance, sensitivity, and open loop signals.
- Person dossier with confirmed memories, open loops, next moves, timeline, capture, delete, and a deterministic pre-meeting brief.
- Reflection Log for interaction notes.
- Source-backed extraction review for proposed memories and open loops.
- Radar for neglected people, upcoming follow-ups, overdue promises, fragile relationships, protected people, and social opportunities.
- Plot Board for next moves by status.
- JSON and Markdown export plus seed reset.

AI calls are intentionally not wired yet. The first implementation uses deterministic extraction suggestions so durable memories still require explicit user acceptance.

## Start here

Read:

1. `AGENT_START_HERE.md`
2. `docs/START_HERE.md`
3. `docs/MVP_SPEC.md`
4. `docs/ARCHITECTURE.md`
5. `docs/BUILD_PLAN.md`

## MVP

Build a single-user local-first app where the user can manage people, capture notes, extract durable memories, track open loops, view relationship radar, and generate pre-meeting briefs.

No automated outreach. No message scraping. No hidden scoring.
