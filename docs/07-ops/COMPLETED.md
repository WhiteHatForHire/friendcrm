# COMPLETED.md — Completed Work Log

This document tracks completed work for the project.

Use it as the project memory of what has already been created, decided, shipped, or moved out of the hopper.

Newest entries should go at the top.

---

# Format

Use this format for each completed item:

    ## YYYY-MM-DD — Title

    **Type:** Docs | Design | App | Backend | AI | Ops | Decision
    **Source:** Human | Codex | ChatGPT | Other
    **Related Files:**

    - `path/to/file.md`

    **Summary:**

    Briefly describe what was completed.

    **Follow-Ups:**

    - [ ] Optional follow-up task

---

# Completed Work

## 2026-06-22 — Export And Delete Privacy UX Added

**Type:** App / Privacy  
**Source:** Human + Agent  
**Related Files:**

- `src/App.tsx`
- `src/lib/crm.ts`
- `src/lib/crm.test.ts`
- `src/styles.css`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Added individual note deletion, source-backed cleanup for deleted notes, visible person delete consequence summaries, and export warnings that show private/sensitive data counts before JSON or Markdown export.

**Follow-Ups:**

- [ ] Consider optional sensitive/private export filtering after real use.
- [ ] Add UI-level interaction tests once the UI settles.

## 2026-06-22 — Local CRUD And Delete Coverage Tightened

**Type:** App / Tests  
**Source:** Human + Agent  
**Related Files:**

- `src/lib/crm.ts`
- `src/lib/crm.test.ts`
- `src/App.tsx`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Extracted core CRM state mutations into testable helpers, wired the app to use them, and added focused tests for person add/update/delete, note capture contact history, accepted suggestion persistence, shared-record delete detachment, open loop status, and next move status.

**Follow-Ups:**

- [ ] Add explicit note delete UX.
- [ ] Add clearer person delete consequences in the UI.

## 2026-06-22 — Project Brain Audit And Initial ADRs Added

**Type:** Docs / Decision  
**Source:** Human + Agent  
**Related Files:**

- `docs/07-ops/PROJECT-BRAIN-AUDIT.md`
- `docs/06-decisions/README.md`
- `docs/06-decisions/0001-vite-react-local-first-mvp.md`
- `docs/06-decisions/0002-deterministic-core-before-ai.md`
- `docs/06-decisions/0003-source-backed-user-confirmed-memory.md`
- `docs/06-decisions/0004-no-scraping-automated-sending-hidden-scoring.md`
- `PROJECT.md`
- `AGENTS.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/PROJECT-PLAN.md`

**Summary:**

Completed the Milestone 0 project brain audit and captured the foundational decisions for the current local-first MVP, deterministic core before AI, source-backed user-confirmed memory, and privacy/product constraints.

**Follow-Ups:**

- [ ] Add a reusable Project Brain Audit Skill.
- [ ] Add a reusable ADR Creation Skill.

## 2026-06-22 — Whole-Project Plan Added

**Type:** Ops / Docs  
**Source:** Human + Agent  
**Related Files:**

- `docs/07-ops/PROJECT-PLAN.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/OPERATING-MANUAL.md`
- `PROJECT.md`

**Summary:**

Added a whole-project milestone plan and expanded the parked backlog so future work can be selected from a coherent roadmap without overloading the active hopper.

**Follow-Ups:**

- [ ] Move focused slices from the project plan into `NEXT-IN-HOPPER.md` only when they are ready for near-term execution.

## 2026-06-22 — Project Operating System Added

**Type:** Ops / Docs  
**Source:** Human + Agent  
**Related Files:**

- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`
- `docs/07-ops/SKILLS.md`
- `docs/07-ops/SHIPPING-UPDATE-SKILL.md`
- `docs/07-ops/OPERATING-MANUAL.md`
- `docs/07-ops/PROMPT-TEMPLATE.md`
- `AGENTS.md`
- `PROJECT.md`

**Summary:**

Added a lightweight project operating system so future human and AI work can stay aligned, track active tasks, preserve completed work, and update project state after meaningful changes.

**Follow-Ups:**

- [ ] Run a project brain audit.
- [ ] Keep ops docs updated after meaningful work.

## 2026-06-22 — Initial Local-First MVP Scaffold Added

**Type:** App / Docs  
**Source:** Human + Agent  
**Related Files:**

- `src/App.tsx`
- `src/lib/insights.ts`
- `src/lib/storage.ts`
- `src/data/seed.ts`
- `src/types.ts`
- `src/styles.css`
- `README.md`
- `docs/START_HERE.md`
- `docs/MVP_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/BUILD_PLAN.md`

**Summary:**

Created the first runnable Friend CRM MVP scaffold with seeded people, local browser storage, People, Radar, Plot Board, Reflection Log, person dossier, deterministic extraction review, brief generation, export/reset, tests, and build scripts.

**Follow-Ups:**

- [ ] Tighten CRUD and delete coverage.
- [ ] Add ADRs for current architecture decisions.
