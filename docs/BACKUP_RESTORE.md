# Friend CRM - Backup And Restore

Friend CRM is currently local-first. Data lives in the browser unless exported.

Use backup/restore before meaningful private use.

---

# Export

Settings / Evidence Locker provides:

- JSON export for machine-readable backup and restore.
- Markdown export for human-readable review.

Exports include private relationship data. The app shows counts for private people, sensitive/private notes, sensitive/private memories, and sensitive/private open loops before export.

JSON exports use a schema-versioned envelope:

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-06-23T00:00:00.000Z",
  "app": "friend-crm",
  "data": {}
}
```

---

# Restore Saved Export

Settings / Evidence Locker provides a saved-export restore path for JSON exports. This is the path for restoring a previous Friend CRM backup file, not for resetting to demo data.

Restore behavior:

- The file must be valid JSON.
- The data must match the expected Friend CRM shape.
- Enums, dates, duplicate IDs, person references, and source-note references are validated.
- Both schema-versioned exports and older raw-data exports are accepted.
- Schema-versioned exports are normalized through the migration registry in `src/lib/dataValidation.ts`.
- A preview appears before replacing local data.
- The preview includes counts, sample people names, note date range, and sensitive/private totals.
- The preview includes **Make Panic Copy Of Current File**, a one-click JSON export of the current browser dataset before replacement.
- **Restore This Saved Export** stays gated until the user makes the panic copy or explicitly acknowledges they are restoring over disposable local data.
- Replacement is local-only.

Use the current UI path:

1. Open **Evidence Locker**.
2. Use **Export Current File** if the current local browser data matters.
3. Under **Restore Saved Export**, choose **Choose Saved Export JSON**.
4. Review **Check the Saved Export Before Restore**.
5. Use **Make Panic Copy Of Current File** or deliberately acknowledge that the current data is disposable.
6. Use **Restore This Saved Export** only if the preview matches expectations.

---

# Restore Built-In Fake Friends

Settings / Evidence Locker also provides **Restore Built-In Fake Friends**.

This is a demo reset path, not a backup restore path:

- It replaces the current local browser dataset with the built-in fake sample dataset.
- It does not merge with current data.
- It shows the sample dataset counts before replacement.
- It asks for browser confirmation through **Restore Sample Friends**.
- It is local-only and does not delete a server copy because there is no server in this demo.

Export first if the current local data matters.

---

# Safe Restore Checklist

Before importing:

1. Export the current dataset as JSON.
2. Export the current dataset as Markdown if you want a readable backup.
3. Choose the saved Friend CRM JSON export.
4. Review preview counts.
5. Use **Make Panic Copy Of Current File** from the preview if the current browser data matters.
6. Check the acknowledgement only if the panic copy was made or the current data is intentionally disposable.
7. Use **Restore This Saved Export** only if the preview matches expectations.

---

# Current Limits

- The migration registry currently has only version 1 because no breaking schema changes have happened yet.
- Browser storage can still be cleared by browser/device settings.
- There is no cloud sync.
- There is no account recovery.

The next persistence step is documented in `docs/PERSISTENCE_BACKUP_PLAN.md`.
