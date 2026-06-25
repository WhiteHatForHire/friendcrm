# ADR 0006 - AI Backend Shape

**Status:** Accepted  
**Date:** 2026-06-23

---

## Context

Friend CRM is currently a Vite React local-first prototype. Real AI calls must be server-side, but the app is not ready for a full backend or framework migration yet.

The immediate need is to make AI behavior testable and safe before adding production provider calls, hosted infrastructure, or persistence changes.

Options considered:

- Keep Vite and add a framework-neutral route/controller core.
- Add a small standalone Node API immediately.
- Migrate to Next.js for server routes.
- Use hosted functions immediately.

## Decision

Keep the current Vite app and implement AI behavior as framework-neutral route/controller modules first.

Route cores should:

- Accept the documented Memory Extractor request shape.
- Call an injected provider function.
- Validate provider output before UI use.
- Return structured success or failure results.
- Avoid committed secrets and production infrastructure until deployment is chosen.

Local Vite development middleware may mount these route cores for testing. When production HTTP transport becomes necessary, prefer a small standalone Node API before considering a full Next.js migration.

## Consequences

This keeps the prototype moving without binding the product to infrastructure too early.

It also means:

- Current implementation can be tested in-process and through local development HTTP routes.
- The browser can use a mock/local extractor shell for now.
- A future server can reuse the route core.
- Production provider integration remains blocked until secret handling and deployment transport are explicit.

## Follow-Ups

- Browser UI now uses local development HTTP routes for extraction, briefs, and next moves.
- Add production HTTP transport only when a deployment target is ready.
- Revisit this ADR if persistence or hosting decisions change.
