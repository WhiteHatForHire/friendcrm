# BROWSER-SYNTHETIC-TRIAL-2026-06-25.md

**Tester:** Codex browser automation  
**Mode:** Playwright against local Vite dev server  
**Dataset:** Fake 10-person / 25-note synthetic dataset injected into browser local storage  
**Private data:** None  

---

# Summary

Added a browser-level synthetic trial harness for Friend CRM.

This complements the logic-level `npm run trial:synthetic` test by proving the playable UI can load and operate against a richer fake trial dataset.

Command:

```bash
npm run trial:synthetic:browser
```

The command expects a running local app and uses:

```bash
FRIEND_CRM_BASE_URL=http://127.0.0.1:<port>
```

For private/demo-safe validation, start the dev server with provider calls disabled:

```bash
FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --port 5182
FRIEND_CRM_BASE_URL=http://127.0.0.1:5182 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser
```

---

# What It Covers

- Loads a synthetic 10-person / 25-note dataset into local browser storage.
- Verifies People view can read the trial dataset.
- Verifies Person Rail brief generation renders from the trial context.
- Verifies next-move generation creates editable drafts without auto-adding them.
- Verifies adding one generated move updates local data exactly once.
- Verifies Radar sees:
  - going-cold people,
  - overdue social debts,
  - protected/private files,
  - openings.
- Verifies Plot Board status reclassification persists after reload.
- Verifies Settings export works after the synthetic dataset exists.
- Verifies Settings import preview accepts the synthetic export envelope.
- Verifies a mobile viewport renders People and Plot Board without horizontal overflow.

---

# Result

Pass.

Validation run:

```bash
FRIEND_CRM_BASE_URL=http://127.0.0.1:5182 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser
```

Output:

```text
- PASS loads synthetic 10-person 25-note trial dataset
- PASS person rail generates editable brief and next moves without auto-adding
- PASS radar sees cold people, protected files, overdue loops, and openings
- PASS plot board can reclassify synthetic trial moves
- PASS settings exports and previews import after synthetic data exists
- PASS mobile viewport renders synthetic trial data without horizontal overflow
```

---

# Notes

- The harness uses fake data only.
- It does not scrape, send messages, call production infrastructure, or require real provider AI.
- It intentionally complements, rather than replaces, `npm run demo:check`.
- Keep this harness focused on broad playable-path confidence. Use focused component/unit tests for exact copy and generation tone.
