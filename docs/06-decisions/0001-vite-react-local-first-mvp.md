# ADR 0001 - Vite React Local-First MVP

**Status:** Accepted  
**Date:** 2026-06-22

---

## Context

Friend CRM is currently a single-user private MVP. The product needs fast iteration on relationship data modeling, review flows, radar surfaces, and privacy mechanics before production infrastructure or multi-user features matter.

The repo already contains a Vite React TypeScript app with seeded fake people, local browser storage, custom CSS, and Vitest tests.

## Decision

Use Vite React TypeScript as the current app foundation.

Keep the MVP local-first for now:

- Browser local storage is acceptable for the first prototype.
- No auth is required for the local demo.
- No production backend or hosted infrastructure should be added until the product flow is proven useful.
- Persistence changes must be captured in a future ADR.

## Consequences

This keeps the app fast to run, easy to inspect, and inexpensive to change.

It also means:

- Local storage is not a final persistence layer.
- Export/delete behavior matters from day one.
- Any future backend, database, auth, or deployment work should be a deliberate milestone, not incidental scaffolding.

## Follow-Ups

- Compare IndexedDB, SQLite, Supabase/Postgres, and local file/database options before replacing local storage.
- Add a persistence ADR when the next data layer is chosen.
- Keep `npm test` and `npm run build` as baseline validation.
