# DEMO-CHECKLIST.md — Local Demo Readiness

Use this checklist before showing the prototype or starting a private trial.

This checklist uses synthetic or local browser data only. Do not add private data, API keys, exports, or screenshots to the repo.

---

# 1. Baseline Validation

Run:

```bash
npm run demo:check
```

This command runs:

- `npm test`
- `npm run build`
- a temporary local Vite server with provider calls disabled
- `npm run smoke:ui`
- `npm run regression:browser`
- `npm run regression:mobile`
- `npm run regression:tablet`

The baseline command is intentionally non-secret. It sets `FRIEND_CRM_DISABLE_PROVIDER=1` for the temporary server so safe mock providers are used even if `.env.local` contains `OPENAI_API_KEY`.

---

# 2. Provider Validation

Run provider validation only when you explicitly want to test the local server-side key with synthetic data:

```bash
npm run dev -- --host 127.0.0.1 --port 5175
FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 npm run trial:provider
```

Rules:

- Use synthetic data only.
- Do not print or commit `.env.local`.
- Do not paste private relationship notes into the provider trial.
- Stop the local server after the trial.

---

# 3. Reset And Seed State

For a clean demo:

1. Open **Evidence Locker** from the app navigation.
2. Export JSON if you need to preserve the current local browser data.
3. Use **Restore Built-In Fake Friends** / **Restore Sample Friends** only after confirming the current local data can be discarded or restored from an export.
4. Reload the app to verify seed data appears.

The browser regression starts from seed data automatically by clearing the app's local storage key.

---

# 4. Export / Import Safety

Before testing destructive flows:

- Export JSON.
- Export Markdown if you want a human-readable snapshot.
- When importing JSON, use the preview before replacing local browser data.
- Use **Make Panic Copy Of Current File** from the saved-export restore preview before replacing existing local data.
- Use **Restore This Saved Export** only after checking the preview counts and sample names.
- Use **Restore Sample Friends** only when you intentionally want to replace the current browser data with the built-in fake dataset.
- Never commit exported private data.

---

# 5. Browser Demo Flow

Recommended repeatable flow:

1. First load: confirm the local fake sample dataset appears and the sidebar navigation is reachable.
2. People: search/select **Ada Nkrumah**, scan the person rail, and confirm notes, memories, open loops, next moves, and contact details are readable.
3. People setup: add a synthetic person, edit relationship labels/contact details, verify the row updates, then return to Ada for the core demo path.
4. Note Capture: open **Debrief Booth**, select Ada, capture a synthetic note with one preference and one promise.
5. Review Panel: confirm the saved note is source-backed, edit or accept a memory, reject one suggestion if useful, then click **Make It Canon**.
6. People verification: return to People and verify the confirmed memory appears while rejected material does not become durable record.
7. Brief: click **Brief Me**, generate a pre-meeting brief, and point out the source/fallback label.
8. Next Moves: enter an aim, click **Cook Something Up**, edit one draft, and add it to the Plot Board.
9. Radar: scan neglected, overdue, protected, and opportunity sections.
10. Plot Board: move a card between statuses and reload once if you want to show local persistence.
11. Poster Lab: click **Fake Dossier Art**, show **Poster Lab**, open **Context Receipt**, shuffle/copy harmless poster copy, then close it.
12. Evidence Locker / Settings export: export **Backup JSON** and **Readable Markdown**.
13. Saved-export restore: import a known synthetic JSON export, inspect **Check the Saved Export Before Restore**, click **Make Panic Copy Of Current File**, then **Restore This Saved Export**.
14. Sample restore: use **Restore Built-In Fake Friends** / **Restore Sample Friends** to return to the built-in fake dataset and confirm Ada/Jules reappear.

---

# 6. Pass Criteria

- Demo command passes.
- Provider trial passes if real-key behavior is being demonstrated.
- No secrets or private data are committed.
- Source-backed AI suggestions still require review before durable records are saved.
- Generated next moves remain drafts only; nothing is sent automatically.
