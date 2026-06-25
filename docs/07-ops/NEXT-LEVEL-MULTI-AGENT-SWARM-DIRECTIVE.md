# Next-Level Multi-Agent Swarm Directive

Use this directive when running a large, goal-based, self-checking swarm to move Friend CRM from a playable local MVP toward a launch-quality demo product.

This is an execution directive, not a product spec. Agents must still read `PROJECT.md`, `AGENTS.md`, `docs/07-ops/NEXT-IN-HOPPER.md`, and relevant docs before editing.

---

# North Star

Make Friend CRM feel like a finished, trustworthy, funny private relationship desk:

- Playable in desktop and mobile browsers.
- Clear enough for private data safety.
- Weird/funny enough to feel branded.
- Source-backed and user-confirmed.
- Local-first until a persistence/deployment decision changes.
- Demo-ready without real secrets, private data, scraping, automated outreach, or hidden scoring.

---

# Non-Negotiables

- Do not add real private data, credentials, secrets, or API keys.
- Do not scrape messages or social accounts.
- Do not build automated sending or automated outreach.
- Do not use sales CRM language.
- Do not save AI-generated durable memories or open loops without explicit user confirmation.
- Preserve local-first behavior unless an ADR changes it.
- Every meaningful change must update `NEXT-IN-HOPPER.md`, `COMPLETED.md`, or `FUTURE-TODO.md`.
- Every implementation lane must run relevant validation before claiming done.

---

# Swarm Shape

## Manager Agent

Owns coordination, sequencing, conflict checks, final validation, and docs updates.

Responsibilities:

- Read all agent summaries.
- Inspect changed files directly.
- Resolve overlap and merge conflicts.
- Run final validation.
- Update ops docs.
- Produce the final handoff.

## Agent 1 — Demo Flow And Playability

Goal:

Make the app feel like a coherent demo from first load through adding people, capturing notes, reviewing suggestions, planning moves, and backing up data.

Scope:

- People flow
- Reflection Log
- Review Panel
- Plot Board
- Settings path ordering
- Demo checklist

Deliverables:

- Identify demo dead spots.
- Improve labels, empty states, and transitions where the user gets lost.
- Keep changes small and reviewable.

Acceptance:

- A new user can complete a fake-data demo path without guessing.
- No trust-critical copy becomes vague.
- Browser regression covers any changed flow.

## Agent 2 — Mobile And Responsive QA

Goal:

Make mobile good enough for real casual use, not merely "not broken."

Scope:

- Mobile People
- Mobile drawer
- Mobile Review Panel
- Mobile Settings
- Tablet breakpoints

Deliverables:

- Add or update mobile/tablet screenshots.
- Fix horizontal overflow, clipped text, awkward drawer states, and unreachable controls.
- Add tablet regression coverage if feasible.

Acceptance:

- No horizontal overflow at `390x844`.
- Tablet breakpoint does not feel like accidental desktop or cramped mobile.
- Drawer/backdrop/body-scroll behavior remains covered.

## Agent 3 — Data Safety, Backup, Restore

Goal:

Make local backup/restore behavior boringly trustworthy.

Scope:

- Settings / Evidence Locker
- JSON export
- Markdown export
- Saved-export restore
- Sample restore
- Import validation
- Backup/restore docs

Deliverables:

- Clarify copy and visual hierarchy.
- Deepen browser coverage for restore-from-export.
- Ensure destructive local replacement remains deliberate.

Acceptance:

- User can distinguish export, saved-export restore, and sample restore.
- Restore preview is understandable.
- Current local data backup is prompted before replacement.
- Import/restore regression passes.

## Agent 4 — AI Trust And Source-Backed Quality

Goal:

Improve AI/deterministic assistance without weakening trust.

Scope:

- Extractor fallback quality
- Brief quality
- Next-move quality
- Provider-disabled behavior
- Prompt docs
- Review confirmation workflow

Deliverables:

- Tune generated content quality with fake data only.
- Add tests for any changed extraction/generation behavior.
- Keep AI suggestions source-backed and explicitly confirmed.

Acceptance:

- Sparse/private context is handled honestly.
- Generated moves remain editable and are never auto-sent.
- Durable records still require user confirmation.

## Agent 5 — Brand, Delight, And Polish

Goal:

Push the retro private-intel identity while preserving readability and trust.

Scope:

- Visual polish
- Copy polish
- Poster Lab
- Easter eggs
- Hover/animation states
- Accessibility of playful UI

Deliverables:

- Improve fun, not noise.
- Catch low-contrast or clipped text.
- Keep safety-critical surfaces clearer than joke surfaces.

Acceptance:

- UI feels more branded and less sterile.
- Buttons remain readable.
- Reduced-motion behavior remains acceptable.
- No critical action becomes unclear.

---

# Recommended Massive Run Sequence

## Phase 1 — Parallel Audit And Proposal

Run Agents 1-5 in parallel as read-first agents.

Each agent returns:

- Top 5 issues found.
- Proposed file changes.
- Risks.
- Validation needed.
- Whether they recommend implementation now or later.

Manager synthesizes into one implementation plan and rejects duplicate or conflicting work.

## Phase 2 — Parallel Implementation

Run implementation agents only on non-overlapping file areas.

Suggested split:

- Agent 1: demo flow / app UI copy.
- Agent 2: mobile/tablet CSS and browser scripts.
- Agent 3: Settings/data safety and backup docs.
- Agent 4: AI/test logic.
- Agent 5: zany polish, Poster Lab, low-risk delight.

Manager must pause any lane that touches the same file in incompatible ways.

## Phase 3 — Self-Check Gate

Each agent must run relevant checks and report:

- Files changed.
- Acceptance criteria met.
- Validation commands and results.
- Known risks.
- Follow-ups.

No agent may claim done without validation or a clear reason validation could not run.

## Phase 4 — Manager Integration

Manager performs:

- `git status --short`
- Review changed files.
- Search for banned sales CRM language.
- Search for secrets/API keys.
- Run full validation.
- Run browser audit.
- Update ops docs.

## Phase 5 — Final Handoff

Manager returns:

- What changed.
- What validation passed.
- What remains.
- Current next hopper task.
- Risks/blockers.

---

# Required Validation Matrix

Run at minimum:

```bash
npm test
npm run build
FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser
FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile
FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser
FRIEND_CRM_BASE_URL=http://127.0.0.1:5184 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser
npm run demo:check
```

Also run targeted tests for touched logic files.

---

# Manager Prompt

```txt
You are the manager agent for a Friend CRM next-level completion swarm.

Read first:

- PROJECT.md
- AGENTS.md
- docs/07-ops/NEXT-IN-HOPPER.md
- docs/07-ops/PROJECT-PLAN.md
- docs/07-ops/FULL-BROWSER-UI-AUDIT-2026-06-25.md
- docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md

Goal:

Coordinate a multi-agent run that moves Friend CRM closer to launch-demo quality while preserving privacy, local-first behavior, source-backed AI, and the funny private-intel brand.

Do not commit or push unless explicitly asked.

Start by assigning the five agent lanes from the directive. After they report, synthesize one implementation plan, execute or delegate non-overlapping work, run validation, update ops docs, and return a concise manager handoff.
```

---

# Agent Prompt Template

```txt
You are Agent [number/name] in the Friend CRM next-level completion swarm.

Read first:

- PROJECT.md
- AGENTS.md
- docs/07-ops/NEXT-IN-HOPPER.md
- docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md
- Relevant source/docs for your lane

Lane:

[Paste lane from directive.]

Rules:

- Stay inside your lane.
- Use fake/local data only.
- Do not add secrets, scraping, automated outreach, hidden scoring, or sales CRM language.
- Do not commit or push.
- Validate your work.

Return:

- Findings.
- Files changed.
- Validation run.
- Risks.
- Recommended next step.
```

---

# Current Best First Massive Run

Recommended first swarm goal:

**Launch-Demo Confidence Run**

Objectives:

1. Finish backup/restore confidence.
2. Add tablet regression/screenshots.
3. Shorten mobile People/profile editing.
4. Polish Poster Lab into a preview-first reward moment.
5. Tighten demo checklist and final browser audit.

Success means:

- The prototype can be demoed end to end on desktop and mobile.
- A user can back up and restore safely.
- Mobile no longer feels like a compromised layout.
- The brand feels intentional and funny.
- The repo state clearly says what is done and what remains.
