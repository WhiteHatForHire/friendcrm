# ADR 0005 - Server-Side AI Integration Boundary

**Status:** Accepted  
**Date:** 2026-06-22

---

## Context

Friend CRM will eventually use AI to extract memories, open loops, dates, safety flags, briefs, and next moves. This repo currently uses deterministic local suggestions and does not include a server route or real provider key.

Because the app handles private relationship context, AI integration needs clear boundaries before implementation.

## Decision

Real AI calls must be server-side only and must follow the contract in `docs/AI_INTEGRATION_BOUNDARY.md`.

The first AI integration should be limited to Memory Extractor behavior:

- One note in.
- Minimal person context in.
- Structured suggestions out.
- Schema validation before UI review.
- Explicit user acceptance before durable records are saved.

The app must not:

- Send whole-database context for extraction.
- Expose API keys to the browser.
- Log raw personal notes or full prompts in production.
- Save AI suggestions automatically.
- Add automated sending, scraping, hidden scoring, or surveillance behavior.

## Consequences

This keeps AI useful without making it the authority over relationship memory.

It also means:

- Backend/persistence shape must be decided before implementation.
- AI route work should include validation and failure behavior, not just provider calls.
- Deterministic suggestions can remain as local/demo fallback.
- Future brief and next-move routes should follow the same privacy and validation posture.

## Follow-Ups

- Choose backend route shape before implementation.
- Add validation schema tests before calling a real provider.
- Update `.env.example` with placeholder AI variables only when implementation begins.
- Keep `docs/PROMPTS.md` aligned with the route contract.
