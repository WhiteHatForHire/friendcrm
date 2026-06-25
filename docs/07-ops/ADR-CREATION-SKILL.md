# ADR-CREATION-SKILL.md — ADR Creation Skill

Use this skill to create or update Architecture Decision Records for Friend CRM.

ADRs capture decisions that future humans and agents need to respect.

---

# When To Run

Run this skill when changing or deciding:

- Architecture.
- Persistence.
- AI/provider behavior.
- Privacy posture.
- Data model.
- Deployment.
- Authentication.
- Product constraints.
- Monetization or business model.

---

# Files To Review

Read:

- `PROJECT.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- Relevant product or AI docs.
- `docs/06-decisions/README.md`
- Existing ADRs in `docs/06-decisions/`

---

# ADR Rules

- Use the next sequential ADR number.
- Use `YYYY-MM-DD` for the date.
- Set status to `Proposed`, `Accepted`, `Superseded`, or `Deprecated`.
- Keep the decision factual and specific.
- Explain consequences and follow-ups.
- Do not erase previous ADRs.
- If replacing a decision, mark the old ADR as superseded and link the new one.

---

# ADR Template

```md
# ADR 000X - Title

**Status:** Accepted  
**Date:** YYYY-MM-DD

---

## Context

[What made this decision necessary?]

## Decision

[What are we choosing?]

## Consequences

[What does this make easier or harder?]

## Follow-Ups

- [Concrete next action.]
```

---

# Required Updates

After creating or updating an ADR:

- Update `docs/06-decisions/README.md`.
- Update `PROJECT.md` if current truth changed.
- Update `docs/ARCHITECTURE.md` or relevant docs if needed.
- Update `docs/07-ops/NEXT-IN-HOPPER.md`, `FUTURE-TODO.md`, or `COMPLETED.md` through the Shipping Update Skill if task state changed.

---

# Final Response Format

Respond with:

```md
# ADR Update Complete

## Decision Captured

- ...

## Files Updated

- ...

## Follow-Ups

- ...
```
