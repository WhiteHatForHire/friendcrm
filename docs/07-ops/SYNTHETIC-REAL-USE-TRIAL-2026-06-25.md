# SYNTHETIC-REAL-USE-TRIAL-2026-06-25.md

**Tester:** Codex synthetic trial  
**Mode:** Repo-safe fake relationship data  
**Dataset:** 10 seeded people plus 25 synthetic trial notes  
**Private data:** None  

---

# Summary

Friend CRM can now run a repeatable synthetic MVP trial that approximates a real private-use session without using real relationship data.

The trial exercises the core loop:

1. Start from the built-in fake sample people.
2. Capture 25 additional synthetic relationship notes across 10 people.
3. Extract source-backed memory and open-loop suggestions.
4. Accept durable records through the review path.
5. Check Radar signals.
6. Generate briefs and next moves.
7. Export Markdown and schema-versioned JSON.
8. Parse exported JSON back through the import validator.
9. Delete a note and confirm source-backed records are removed.
10. Delete a person and confirm related data impact is handled.

Result: **pass for prototype/demo readiness with fake data.**

This is still not a human private-data trial.

---

# What Was Simulated

## People Coverage

The trial uses all 10 seeded fake people:

- Friend
- Collaborator
- Mentor
- Client/collaborator
- Community contact
- Weak tie
- Family/friend
- Romantic
- Private/sensitive contacts
- Warm, cool, neutral, and high-warmth relationships

## Note Coverage

The 25 synthetic notes include:

- Calls
- Dinners
- Meetings
- Manual notes
- Text summaries
- Memory notes
- Multi-person notes
- Promises and owed follow-ups
- Boundaries
- Preferences
- Private/sensitive context
- Sparse planning context
- Explicit due-date language
- Vague human language such as "circle back," "book," "invite," and "owed"

## Product Flows Covered

- Note capture state mutation
- Deterministic extraction fallback
- Validated mock extractor path
- Review save path
- Confirmed memories
- Open loops
- Radar neglected/upcoming/overdue/opportunity signals
- Deterministic briefs
- Generated brief route shell
- Generated next-move route shell
- Markdown export
- JSON export envelope
- JSON import parsing/validation
- Note deletion cleanup
- Person deletion impact

---

# Fixes Applied During Trial

## Broadened deterministic extraction language

The trial exposed that normal relationship notes often use softer language than the old parser expected.

Updated `src/lib/insights.ts` to catch more real-use phrases:

- "circle back"
- "book"
- "schedule"
- "invite"
- "introduce"
- "owed"
- "share"
- "draft"
- "appreciates"
- "needs"
- "works better"
- "responds better"

Also broadened sensitive-context detection for:

- medical
- budget
- grief
- sobriety
- divorce
- visa
- immigration

This keeps the local fallback useful even when provider AI is disabled.

## Expanded automated trial coverage

Updated `src/lib/prototypeTrial.test.ts` so the synthetic trial now verifies:

- Exactly 25 synthetic trial notes are used.
- The final dataset reaches at least 30 notes including seed notes.
- Extraction returns enough accepted source-backed records.
- Sensitive/private totals are represented in the dataset summary.
- Generated briefs show sensitivity warnings when needed.
- Generated next moves return multiple editable suggestions.
- Schema-versioned JSON export parses back successfully.

## Added repeatable command

Added:

```bash
npm run trial:synthetic
```

This runs the synthetic real-use trial directly.

---

# Trial Result

## Pass

- Core local-first data loop works with fake data.
- Source-backed durable records remain traceable to notes.
- The app can produce memories, open loops, Radar signals, briefs, next moves, and exports from a realistic fake dataset.
- Sensitive/private context is visible in summaries and generation warnings.
- Export/import validation remains intact.
- Delete cleanup behavior remains covered.

## Watch

- The deterministic parser is still keyword-based. It is useful as a fallback, but it will never understand all human note styles.
- Brief quality is structurally correct but could be more opinionated and funny/useful.
- Next moves are editable and safe, but they need a stronger "warm/direct/weirdly-useful" product voice.
- The synthetic trial is logic-level. Browser regression already covers UI flows separately, but there is not yet a browser-level synthetic trial that loads the whole 25-note dataset into the UI.

## Not Covered

- Real private human data.
- Real provider-backed extraction with private data.
- Hosted deployment.
- Long-term persistence beyond local browser storage.
- Multi-day retention across an actual human routine.

---

# Readiness Assessment

## Prototype Readiness

Estimated prototype readiness after this pass: **78-82%**.

The app is playable as a local fake-data demo and can support a careful synthetic trial. The remaining work is less about "does it exist?" and more about "does it feel indispensable after repeated use?"

## MVP / Private Alpha Readiness

Estimated private-alpha readiness: **62-68%**.

The main blockers are:

- Human-trial evidence is still missing by user direction.
- Briefs and next moves need a quality pass.
- Local persistence is workable but not yet durable enough for serious long-term use.
- Mobile is much better, but a real mobile detail drawer would make repeated use smoother.

---

# Recommended Next Queue

## 1. Briefs And Next Moves Quality Pass

Make the generated and deterministic brief/next-move experience more useful, fun, and relationship-aware.

Focus on:

- Warmer alternative.
- More direct alternative.
- Risk reason.
- "Do not fumble this" boundary.
- Cheeky but clear copy.
- Sparse-context behavior.
- Tests for sensitive/private context.

## 2. Browser-Level Synthetic Trial Harness

Load or create the synthetic trial dataset through the UI and verify the demo paths in the browser.

Focus on:

- Capture/review/save loop.
- Brief generation.
- Next move generation.
- Plot Board status changes.
- Export/import preview.
- Mobile smoke.

## 3. Mobile Person Detail Drawer

Turn the right rail into a proper mobile drawer or bottom sheet for repeated mobile use.

Focus on:

- Easier People list scanning.
- Less vertical crowding.
- Clear "open/close detail" behavior.
- Touch-friendly edit/review controls.

## 4. Backup / Restore Confidence Pass

Make local data safety feel even more trustworthy before private use.

Focus on:

- Better restore-from-export messaging.
- Optional "last exported" indicator.
- Clearer warning before destructive replacement.
- Browser regression for restore-from-export if not already covered deeply enough.

---

# Bottom Line

Friend CRM is ready for more fake-data demo iteration and a serious briefs/next-moves quality pass.

It should still avoid a real private-data trial until the user explicitly wants that again.
