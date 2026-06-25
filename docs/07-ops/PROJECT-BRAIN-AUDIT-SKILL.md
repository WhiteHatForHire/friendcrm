# PROJECT-BRAIN-AUDIT-SKILL.md — Project Brain Audit Skill

Use this skill to audit whether the repository still explains itself clearly after meaningful work.

The goal is to catch stale docs, contradictions, missing decisions, broken markdown, and unclear next steps.

---

# When To Run

Run this skill after:

- A large implementation run.
- A major product or architecture decision.
- Several shipping updates.
- A docs reorganization.
- Any moment when future agents may be confused about current truth.

---

# Files To Review

Read:

- `PROJECT.md`
- `AGENTS.md`
- `README.md`
- `docs/START_HERE.md`
- `docs/MVP_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_INTEGRATION_BOUNDARY.md`
- `docs/PROMPTS.md`
- `docs/06-decisions/README.md`
- `docs/06-decisions/*.md`
- `docs/07-ops/SKILLS.md`
- `docs/07-ops/NEXT-IN-HOPPER.md`
- `docs/07-ops/FUTURE-TODO.md`
- `docs/07-ops/COMPLETED.md`
- Relevant changed source files

---

# Audit Checklist

Check:

- `PROJECT.md` reflects current direction.
- `AGENTS.md` contains current agent rules.
- ADRs exist for major decisions.
- The hopper contains only near-term active work.
- Completed work is not still active.
- Future work is parked, not mixed into active work.
- Product language avoids sales CRM framing.
- AI/privacy rules are consistent.
- Persistence and backend direction are not contradictory.
- Markdown fences are balanced.
- Links to current ops docs and ADRs are valid.
- Validation commands are documented and current.

---

# Allowed Edits

You may:

- Fix stale links.
- Update status language.
- Move completed tasks out of the hopper.
- Add missing follow-ups to `FUTURE-TODO.md`.
- Add a short audit report under `docs/07-ops/`.

Do not:

- Rewrite product direction without explicit instruction.
- Delete ADRs.
- Mark work completed unless it exists in the repo.
- Add app features.
- Commit or push unless explicitly asked.

---

# Final Response Format

Respond with:

```md
# Project Brain Audit Complete

## Findings

- ...

## Files Updated

- ...

## Current Next Task

- ...

## Open Questions

- ...
```
