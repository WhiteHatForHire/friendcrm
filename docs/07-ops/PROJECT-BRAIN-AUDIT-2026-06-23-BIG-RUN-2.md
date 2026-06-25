# PROJECT-BRAIN-AUDIT-2026-06-23-BIG-RUN-2.md

**Date:** 2026-06-23  
**Source:** Codex  
**Scope:** Post hardening run two

---

# Summary

The project brain remains coherent after the second large prototype-hardening run. The current direction is still local-first, privacy-centered, and explicitly not a sales CRM. AI work is staged through validated route/controller shells, HTTP-style handlers, and server-only provider boundaries without real secrets or production infrastructure.

---

# Current Truth

- Friend CRM is a local-first Vite React TypeScript prototype.
- The app has deterministic CRUD/review/export/delete behavior.
- Memory extraction uses a validated shell and fallback behavior.
- AI HTTP-style transport handlers exist but are not mounted to a deployed server.
- Brief and next-move generation route shells exist.
- The person rail can show generated/fallback briefs and generated next-move drafts.
- JSON import/restore exists with stricter validation and preview before replacement.
- Persistence direction is local-first with backup/restore before hosted backend.
- UI regression smoke is documented, but not automated with a browser test runner.
- Private real-data trial remains a human-run task.

---

# Findings

- `PROJECT.md`, `ARCHITECTURE.md`, AI docs, ADRs, and ops docs agree on local-first direction.
- ADR 0006 and ADR 0007 cover the two newest architecture decisions.
- The active hopper now points at the next true phase rather than completed work.
- The largest remaining implementation gap is mounting HTTP transport in a small server-only development route without creating production infrastructure.
- The largest product-validation gap is still a private real-data trial.

---

# Risks

- The app has growing logic coverage but still lacks automated browser-level tests.
- Import validation is stricter, but future schema migrations need explicit versioning.
- Real provider integration still needs careful secret handling and no raw prompt logging.
- Local browser storage remains fragile for valuable private data.

---

# Recommended Next Task

Add a small development-only HTTP transport mount for the AI route shells, keeping provider keys server-side and preserving fallback behavior when no key is configured.
