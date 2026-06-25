# ADR 0007 - Local-First Persistence Before Hosted Backend

**Status:** Accepted  
**Date:** 2026-06-23

---

## Context

Friend CRM currently stores prototype data in browser `localStorage`. The app handles private relationship notes, memories, open loops, and sensitive context, so persistence choices carry privacy and trust consequences.

The prototype now has enough CRUD, review, export, delete, and simulated trial coverage to consider the next persistence step, but it is still too early to add production infrastructure, auth, hosted database operations, or remote sync.

Options considered:

- Keep `localStorage`.
- Move to IndexedDB.
- Move to SQLite or a local file database.
- Add a hosted database such as Supabase/Postgres.
- Add a small backend now.

## Decision

Keep Friend CRM local-first for the next prototype phase.

The next persistence improvement should be explicit backup/restore and, when needed, IndexedDB-backed browser storage. Do not add hosted persistence until the product loop has survived more real use and auth/logging requirements are documented.

## Consequences

This keeps private data local and avoids premature infrastructure.

It also means:

- Remote access is intentionally deferred.
- Local backup/restore becomes more important.
- JSON export remains part of the trust model.
- A future hosted backend must preserve export/delete guarantees.
- Import/restore validation and preview should happen before relying on larger local storage.

## Follow-Ups

- Add schema versioning and migration tests.
- Keep Markdown export for human-readable backup.
- Revisit IndexedDB when localStorage becomes limiting.
- Revisit hosted persistence only after auth, logging, backup, and deployment posture are documented.
