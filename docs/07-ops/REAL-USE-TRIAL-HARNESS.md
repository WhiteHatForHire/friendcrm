# REAL-USE-TRIAL-HARNESS.md — Prototype Trial Harness

Use this harness to test whether Friend CRM is playable as a local prototype.

The goal is to evaluate the product with realistic relationship data and repeated capture, not to admire the interface in seed-data mode.

---

# Trial Goal

Confirm whether the prototype can support the MVP loop:

1. Add people.
2. Capture notes after interactions.
3. Review proposed memories and open loops.
4. See who needs attention.
5. Plan next moves.
6. Generate a useful pre-meeting brief.
7. Export and delete data safely.

---

# Trial Dataset

Target:

- 10 people
- 25 notes
- 10 accepted memories
- 8 open loops
- 5 next moves
- 3 sensitive/private records
- 3 pre-meeting briefs
- 1 JSON export
- 1 Markdown export
- 1 note deletion
- 1 person deletion on non-essential test data

Use fake or lightly anonymized data unless intentionally testing personal use.

---

# Setup

1. Start the app locally.
2. Reset seed data only if a clean baseline is needed.
3. Add or edit 10 realistic people.
4. Include mixed relationship types:
   - close friend
   - collaborator
   - mentor
   - family/protected relationship
   - weak tie
   - ambiguous or fragile relationship
5. Include at least 3 sensitive/private items.

---

# Trial Script

## 1. People

- Add or edit 10 people.
- Set warmth, trust, importance, sensitivity, city, and summary.
- Check whether the people list is scannable.

Record:

- Missing fields:
- Confusing labels:
- Slow actions:
- UI clutter:

## 2. Capture

- Capture 25 notes.
- Use a mix of manual, call, dinner, meeting, text summary, and memory source types.
- Include promises, preferences, boundaries, and follow-up dates.

Record:

- Capture friction:
- Missing source types:
- Notes that failed to extract useful suggestions:
- Sensitive/private labeling issues:

## 3. Review

- Edit at least 5 proposed memories or open loops before saving.
- Reject at least 5 suggestions.
- Accept at least 10 suggestions.
- Confirm basis text remains visible during review.

Record:

- Was edit-before-save clear?
- Were rejected suggestions safely ignored?
- Did any saved memory feel unsupported?
- Did sensitivity labels feel visible enough?

## 4. Radar

- Check neglected people.
- Check overdue promises.
- Check fragile/protected people.
- Check social opportunities.

Record:

- Radar false positives:
- Radar false negatives:
- Missing categories:
- Confusing prioritization:

## 5. Plot Board

- Add at least 5 next moves.
- Move items between idea, queued, done, and dismissed.
- Confirm dismissed items do not clutter the live planning surface.

Record:

- Missing move types:
- Awkward statuses:
- Copy/edit needs:

## 6. Briefs

- Generate or inspect briefs for 3 people.
- Include at least one person with boundaries.
- Include at least one person with open loops.

Record:

- Useful context:
- Missing context:
- Incorrect or unsupported statements:
- Things to avoid that were missing:

## 7. Export / Delete

- Export JSON.
- Export Markdown.
- Delete one note and confirm source-backed records are removed.
- Delete one test person and confirm related consequences are visible.

Record:

- Export gaps:
- Delete confusion:
- Privacy concerns:

---

# Readiness Score

Score each area from 1 to 5.

| Area | Score | Notes |
| --- | ---: | --- |
| People management |  |  |
| Capture speed |  |  |
| Review trust |  |  |
| Radar usefulness |  |  |
| Plot Board usefulness |  |  |
| Brief usefulness |  |  |
| Export/delete confidence |  |  |
| Overall repeat-use likelihood |  |  |

Prototype readiness:

- 35-40: playable prototype
- 28-34: playable with focused fixes
- 20-27: product shape exists, but repeated use is weak
- under 20: return to core workflow design

---

# Report Template

```md
# Prototype Trial Report

**Date:**
**Tester:**
**Dataset:** 10 people / 25 notes

## Summary

[One paragraph: is this playable?]

## Scores

| Area | Score | Notes |
| --- | ---: | --- |
| People management |  |  |
| Capture speed |  |  |
| Review trust |  |  |
| Radar usefulness |  |  |
| Plot Board usefulness |  |  |
| Brief usefulness |  |  |
| Export/delete confidence |  |  |
| Overall repeat-use likelihood |  |  |

## Top Friction

- 
- 
- 

## Missing Product Behavior

- 
- 
- 

## Trust / Privacy Concerns

- 
- 
- 

## Best Signals

- 
- 
- 

## Recommended Next Hopper Items

1.
2.
3.
```

---

# Pass Criteria

The prototype is playable if:

- Capture is fast enough to do repeatedly.
- Review feels trustworthy.
- Radar surfaces at least a few genuinely useful reminders.
- Briefs help before contact.
- Export/delete behavior feels safe.
- The tester would use it again before a real interaction.
