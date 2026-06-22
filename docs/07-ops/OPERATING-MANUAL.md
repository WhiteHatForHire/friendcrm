# OPERATING-MANUAL.md — How To Use The Project Brain

This document explains how to use this repo as an agentic project brain and shipping system.

The goal is simple:

**Know what we are building, know what is next, keep agents aligned, and ship without losing context.**

---

# 1. The Big Idea

This repo has three jobs:

1. Preserve the product brain.
2. Guide agentic coding.
3. Track shipping progress.

The repo should answer:

- What are we building?
- Why are we building it this way?
- What decisions are already made?
- What should happen next?
- What is parked for later?
- What has already been completed?
- What reusable skills can agents run?

---

# 2. The Core Files

## `PROJECT.md`

Current source of truth.

Use this when asking:

> What is true right now?

## `AGENTS.md`

Rulebook for AI agents.

Use this when asking:

> How should an agent work in this repo?

## `docs/06-decisions/`

Architecture Decision Records.

Use this when asking:

> Why did we choose this direction?

## `docs/07-ops/NEXT-IN-HOPPER.md`

Active near-term work queue.

Use this when asking:

> What should we do next?

## `docs/07-ops/PROJECT-PLAN.md`

Whole-project roadmap and milestone plan.

Use this when asking:

> Where is the whole project going?

## `docs/07-ops/FUTURE-TODO.md`

Parked backlog.

Use this when asking:

> What should we not do yet, but do not want to lose?

## `docs/07-ops/COMPLETED.md`

Completed work log.

Use this when asking:

> What has already happened?

## `docs/07-ops/SKILLS.md`

Reusable workflow index.

Use this when asking:

> What repeatable workflows can I invoke?

## `docs/07-ops/SHIPPING-UPDATE-SKILL.md`

Post-work project-state updater.

Use this when asking:

> We did work. How do we update the repo brain?

---

# 3. Session Workflow

## Step 1: Orient

Read:

1. `PROJECT.md`
2. `AGENTS.md`
3. `docs/07-ops/SKILLS.md`
4. `docs/07-ops/NEXT-IN-HOPPER.md`
5. Relevant product/design/architecture docs

Prompt:

    Read PROJECT.md, AGENTS.md, docs/07-ops/SKILLS.md, and docs/07-ops/NEXT-IN-HOPPER.md. Then tell me the next best task. Do not code yet.

## Step 2: Choose One Task

Pick one focused task from `NEXT-IN-HOPPER.md`.

Avoid asking agents to do too much at once.

## Step 3: Give The Agent The Task

Use a focused prompt with:

- Files to read.
- Exact task.
- Scope.
- Prohibited changes.
- Validation commands.
- Expected return format.

## Step 4: Review The Work

Check:

- Files changed.
- Acceptance criteria.
- Product direction.
- Tests/validation.
- Whether docs need updating.

## Step 5: Run The Shipping Update Skill

Prompt:

    Run the Shipping Update Skill from docs/07-ops/SHIPPING-UPDATE-SKILL.md based on the work just completed.

## Step 6: Repeat

Ask:

    What is now the next task in NEXT-IN-HOPPER.md?

---

# 4. Current Non-Negotiables

- Preserve Friend CRM as a private relationship intelligence desk, not a sales CRM.
- Do not use sales CRM language such as "lead", "pipeline", "deal", "conversion", or "campaign".
- Do not scrape private messages.
- Do not build automated outreach or automated sending.
- Do not add hidden scoring.
- Do not commit secrets, credentials, private data, or real user data.
- Keep user-owned data exportable and deletable.
- Keep sensitive/private note handling visible.
- Any AI-generated durable memory must be source-backed and explicitly user-confirmed.
- Build deterministic CRUD and review flows before real AI features.
- Check ADRs before changing architecture or major product direction.
- Keep MVP scope focused.

---

# 5. The Build Loop

The project build loop is:

1. Think through strategy.
2. Distill into docs.
3. Choose one task from the hopper.
4. Send the agent a focused prompt.
5. Review the work.
6. Run the Shipping Update Skill.
7. Repeat.

In short:

**Think -> document -> build -> update state -> choose next.**
