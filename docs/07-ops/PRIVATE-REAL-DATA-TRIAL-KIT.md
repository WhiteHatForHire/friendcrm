# PRIVATE-REAL-DATA-TRIAL-KIT.md — Private Trial Kit

Use this kit when testing Friend CRM with real, local-only, or carefully anonymized relationship data.

The goal is to learn whether the product is useful without leaking private context into repo files, logs, screenshots, commits, or prompts.

---

# Non-Negotiables

- Do not commit real names, contact details, private notes, or exports.
- Do not paste private raw notes into agent prompts.
- Do not use screenshots containing private data in committed docs.
- Use initials, aliases, or synthetic composites when reporting findings.
- Export before destructive tests.
- Delete trial data from local storage after the trial if it should not persist.
- Use `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md` for any repo-safe findings.
- Keep raw exports outside the repo.

---

# Preflight

Before adding private trial data:

1. Run `npm run demo:check`.
2. If testing provider behavior, run `npm run trial:provider` with synthetic data only.
3. Decide provider mode before entering private notes:
   - Recommended first private trial: `FRIEND_CRM_DISABLE_PROVIDER=1 npm run dev -- --host 127.0.0.1 --port 5175`.
   - Real-provider private use should be a deliberate consent decision, not the default.
4. Decide whether the trial will use real local-only data, anonymized data, or synthetic composites.
5. Use a fresh browser profile, private/incognito window, or dedicated local origin so trial data does not mix with unrelated local data.
6. Confirm `.env.local`, exports, screenshots, and local notes are not staged for commit.
7. Open Settings and export current JSON if any local data should be preserved.
8. Start from seed data or reset local data only after exporting anything worth keeping.
9. Treat **Restore Saved Export** and **Restore Built-In Fake Friends** as separate destructive replacement paths.

---

# Trial Dataset

Use:

- 10 people.
- 25 notes.
- At least 10 accepted memories/open loops.
- At least 5 generated or manual next moves.
- At least 3 sensitive/private records.
- At least 3 briefs.
- 1 JSON export.
- 1 Markdown export.
- 1 JSON import/restore preview.
- 1 note deletion.
- 1 disposable person deletion.

---

# Safe Trial Flow

## 1. Setup

- Keep the app local.
- Start with `FRIEND_CRM_DISABLE_PROVIDER=1` unless this is explicitly a real-provider private trial.
- Do not paste raw trial notes into AI agent prompts.
- Do not save exports, screenshots, or private notes under the repo directory.
- Store raw exports in a private, non-repo location and secure or delete them after the trial.
- Prefer initials, roles, or synthetic composites if the findings will be shared back into repo docs.

## 2. Capture And Review

- Add or edit 10 people.
- Capture 25 notes.
- Accept, reject, and edit suggested memories/open loops.
- Confirm every durable AI-generated memory or open loop is source-backed before saving.
- Mark sensitive/private context where appropriate.

## 3. Briefs And Next Moves

- Generate at least 3 briefs.
- Generate or manually add at least 5 next moves.
- Check whether briefs surface sensitive/private context too prominently.
- Check whether generated next moves feel editable, human, and safe.
- Confirm generated moves remain drafts only.

## 4. Export Before Destructive Testing

Before deleting anything:

1. Export JSON.
2. Export Markdown.
3. Store both exports outside the repo.
4. If testing import, import the JSON and review the preview before replacement.
5. Confirm the preview is for the expected saved export, not the built-in fake sample dataset.
6. Use **Make Panic Copy Of Current File** from the saved-export restore preview before replacing local browser data.
7. Only check the acknowledgement if the panic copy was made or the current browser dataset is intentionally disposable.
8. Use **Restore Sample Friends** only for disposable demo reset testing after exports are safely stored outside the repo.

## 5. Destructive Tests

Only after exporting:

- Delete one trial note and confirm related source-backed records are removed.
- Delete one disposable test person and confirm consequences are visible first.
- If testing restore, distinguish saved-export restore from built-in sample restore in the notes.
- Do not delete valuable local data unless a restore path has been tested.

## 6. Cleanup

- Export again if the trial dataset should be preserved locally.
- Reset or delete browser data if private trial data should not persist.
- Confirm no private exports, screenshots, or notes are inside the repo.

---

# Anonymization Guide

When recording findings:

- Replace names with roles: `close friend`, `mentor`, `weak tie`, `family`.
- Replace exact places, companies, channels, and contact details with broad categories.
- Replace dates with relative timing: `last week`, `two months ago`.
- Replace exact promises with categories: `intro`, `check-in`, `follow-up`.
- Replace emotionally specific details with product-level behavior.
- Do not include direct quotes from private notes.
- Do not include screenshots of private data.
- Keep product friction concrete without preserving private content.

Example:

```md
Bad:
Alex's divorce note made the brief feel too exposed.

Better:
A private family/legal note appeared too prominently in a brief.
```

---

# Trial Log Template

Use:

- `docs/07-ops/PRIVATE-TRIAL-FINDINGS-TEMPLATE.md`

Only commit a completed findings report if it has been redacted and contains no private names, raw notes, contact details, screenshots, exports, or secrets.

---

# Pass Criteria

The prototype is ready for the next technical phase if:

- Capture is fast enough to use repeatedly.
- Review feels trustworthy.
- Briefs help before contact.
- Generated next moves feel editable and human.
- Export/import/delete behavior feels safe.
- The tester would use the app again before a real interaction.
