# NEXT-IN-HOPPER.md — Active Build Queue

This document tracks the current active queue for the project.

It is not the full backlog. It is the near-term hopper: the work that should happen next, in order, to keep the project moving toward a shippable MVP.

Update this file whenever a task is completed, superseded, blocked, or moved into active work.

---

# Current Shipping Objective

Turn the current local-first Vite React MVP into a trustworthy private relationship desk that can support real use: complete the project brain, tighten deterministic CRUD/review behavior, preserve source-backed memory, and prepare for server-side AI only after the core flows are solid.

---

# Rules for This Hopper

- Keep this list small.
- Prefer 5-10 active tasks maximum.
- Each task should have clear acceptance criteria.
- Move completed work to `COMPLETED.md`.
- Move parked ideas to `FUTURE-TODO.md`.
- Do not let this become a giant backlog.
- If a task changes product direction, update `PROJECT.md` or add an ADR.
- Every meaningful PR should update the relevant ops docs.

---

# Active Tasks

## 1. Strengthen Source-Backed Review Workflow

**Status:** Ready  
**Priority:** P0  
**Type:** App / AI readiness

### Goal

Make the review workflow strong enough that future AI output can plug into it safely.

### Acceptance Criteria

- Proposed memories and open loops can be edited before save.
- Every proposed durable item displays its source basis.
- Accepted items retain source note IDs.
- Rejected suggestions do not persist.
- Sensitive/private suggestions remain visibly labeled before save.
- Tests cover accepted, edited, and rejected suggestions.

---

# Blocked / Waiting

None yet.

---

# Recently Moved Out

- 2026-06-22: Plan Real AI Integration Boundary completed; see `docs/AI_INTEGRATION_BOUNDARY.md` and `docs/06-decisions/0005-server-side-ai-boundary.md`.
- 2026-06-22: Add Explicit Note and Person Export/Delete UX Pass completed; see `src/App.tsx`, `src/lib/crm.ts`, and `src/styles.css`.
- 2026-06-22: Tighten Local CRUD and Delete Coverage completed; see `src/lib/crm.ts` and `src/lib/crm.test.ts`.
- 2026-06-22: Audit Project Brain completed; see `docs/07-ops/PROJECT-BRAIN-AUDIT.md`.
- 2026-06-22: Create Initial ADRs for Current Architecture completed; see `docs/06-decisions/`.
