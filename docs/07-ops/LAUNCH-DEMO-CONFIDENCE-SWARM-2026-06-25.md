# Launch-Demo Confidence Swarm — 2026-06-25

This report records the manager-led run of `docs/07-ops/NEXT-LEVEL-MULTI-AGENT-SWARM-DIRECTIVE.md`.

---

# Goal

Move Friend CRM closer to launch-demo quality while preserving the project's privacy, local-first, source-backed AI, and funny private-intel constraints.

---

# Agents / Lanes

## Agent 1 — Demo Flow And Playability

Updated the demo checklist and demo readiness output so the protected path is explicit:

- first load
- People
- note capture
- Review Panel
- Plot Board
- Poster Lab
- Evidence Locker export
- saved-export restore
- sample restore

## Agent 2 — Mobile And Responsive QA

Added tablet regression coverage and screenshots for:

- `768x1024`
- `834x1112`

Covered:

- People
- selected-person drawer
- compact profile editor
- Plot Board
- Review Panel
- Settings / Evidence Locker

## Agent 3 — Data Safety, Backup, Restore

Tightened backup/restore documentation:

- distinguished saved-export restore from built-in sample restore
- documented the panic-copy acknowledgement gate
- clarified private-trial destructive restore cautions

## Agent 4 — AI Trust And Source-Backed Quality

Added coverage that unconfirmed memories stay out of provider-bound generation context.

Also cleaned one generated-move rationale phrase so project language scans stay focused on intentional policy references.

## Agent 5 — Brand, Delight, And Polish

Improved Poster Lab staging:

- collapsed secondary panels by default
- added preview-first status copy
- kept safety copy visible
- added sensitivity-aware privacy boundary copy
- clarified context receipt scope

---

# Manager Integration

Implemented and integrated:

- mobile compact profile editor sections
- tablet browser regression command
- tablet screenshot/report artifacts
- demo readiness tablet coverage
- desktop profile editor layout fix after native `details` caused overlap
- compact editor runtime fix by capturing `event.currentTarget.open` before state updates
- tablet script hardening for placeholder and hidden-select text assertions
- generated-move rationale wording cleanup

---

# Files Changed In This Run

- `src/App.tsx`
- `src/styles.css`
- `src/components/DossierPosterLab.tsx`
- `src/lib/aiGenerationRoute.ts`
- `src/lib/aiGenerationRoute.test.ts`
- `scripts/demo-readiness-check.mjs`
- `scripts/tablet-browser-regression.mjs`
- `package.json`
- `docs/BACKUP_RESTORE.md`
- `docs/07-ops/DEMO-CHECKLIST.md`
- `docs/07-ops/PRIVATE-REAL-DATA-TRIAL-KIT.md`
- `docs/07-ops/tablet-breakpoint-regression-2026-06-25/`
- `docs/07-ops/LAUNCH-DEMO-CONFIDENCE-SWARM-2026-06-25.md`

---

# Validation

Passed:

```bash
npm test
npm run build
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:tablet
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run audit:browser
npm run demo:check
```

Notes:

- `npm run audit:browser` still reports medium clipped-content warnings for generic visible `input` controls in a few desktop rail states. No high-severity audit findings remained after this run.
- The tablet regression initially found a real compact-editor runtime bug; it was fixed and the tablet regression now passes.

---

# Current Result

Friend CRM now has a stronger launch-demo baseline:

- desktop regression
- mobile regression
- tablet regression
- synthetic browser trial
- full browser audit
- demo readiness command

The app is more demoable across device sizes, the mobile People editor is shorter, Poster Lab opens in a more preview-first state, and backup/restore docs are clearer.

---

# Recommended Next Work

1. Package a local demo release candidate with a short operator README.
2. Add a tablet screenshot/contact sheet if visual review needs faster scanning.
3. Reduce remaining audit noise around generic input clipping.
4. Do one final project brain audit after the large uncommitted worktree is stabilized.
5. Decide whether to commit/push or cut a PR branch for the current demo-ready state.
