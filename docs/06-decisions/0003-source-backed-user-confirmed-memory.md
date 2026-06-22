# ADR 0003 - Source-Backed User-Confirmed Memory

**Status:** Accepted  
**Date:** 2026-06-22

---

## Context

Friend CRM handles sensitive relationship context. If the app stores durable memories or open loops that were guessed, hallucinated, or silently inferred, it can become creepy, wrong, or harmful.

The product principle is:

> The database owns facts. The AI proposes structure and language. The user confirms anything that becomes durable memory.

## Decision

Every durable memory or open loop created from a note must be source-backed and user-confirmed.

This means:

- Proposed memories must show or retain their source note basis.
- Proposed open loops must show or retain their source note basis.
- AI-generated or deterministic suggestions are not durable records until accepted.
- Rejected suggestions must not become saved memories or open loops.
- Sensitive/private suggestions must be visibly labeled before save.

## Consequences

This makes the product more trustworthy and less magical in the best possible way.

It also means:

- Review UI is a core product surface, not a nice-to-have.
- Data schemas should retain source note IDs for memories and open loops.
- Future AI routes must validate and return source-backed suggestions.
- Briefs and next moves should prefer confirmed context over raw guesses.

## Follow-Ups

- Add edit-before-save for suggestions.
- Add tests for accepted and rejected suggestions.
- Ensure export includes source-backed records clearly.
- Document AI extractor schema before wiring real AI.
