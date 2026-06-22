# ADR 0002 - Deterministic Core Before AI

**Status:** Accepted  
**Date:** 2026-06-22

---

## Context

Friend CRM depends on trustworthy relationship records: people, notes, memories, open loops, next moves, interactions, exports, and deletes.

AI can help structure notes and generate language, but it should not be the foundation of the product. The core product value is the relationship data model and review surfaces.

The current app includes deterministic extraction suggestions and deterministic briefs as a stand-in for future AI behavior.

## Decision

Build and harden deterministic CRUD, review, radar, export, and delete flows before adding real server-side AI.

AI integration should wait until:

- Core data mutation flows are dependable.
- Review acceptance/rejection behavior is clear.
- Source-backed memory is visible in the UI.
- Export/delete behavior is safe enough for private data.
- Tests cover the important deterministic state transitions.

## Consequences

This reduces the risk of impressive-looking AI hiding weak product mechanics.

It also means:

- The next engineering work should focus on CRUD/delete/export coverage and source-backed review flows.
- AI prompts and schemas can be designed against real app behavior instead of speculation.
- Deterministic fallback behavior should remain useful for local demos and tests.

## Follow-Ups

- Tighten Person, Note, Open Loop, Next Move, export, delete, and review tests.
- Document AI route contracts before implementation.
- Keep `NEXT-IN-HOPPER.md` focused on deterministic core work until the foundation is stable.
