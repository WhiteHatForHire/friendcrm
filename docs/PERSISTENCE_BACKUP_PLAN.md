# Friend CRM - Persistence And Backup Plan

This document records the next persistence direction for the prototype.

Friend CRM contains private relationship memory. Persistence should be boring, inspectable, exportable, and reversible before it becomes remote.

---

# Current State

- Runtime storage is browser `localStorage`.
- JSON export exists.
- Markdown export exists.
- JSON import/restore exists with enum, date, duplicate ID, person-reference, and source-note-reference validation.
- JSON import/restore previews counts before replacing local data.
- Seed reset exists.
- Note and person deletion exist with source-backed cleanup.
- No hosted backend exists.
- No auth exists.

---

# Near-Term Decision

Stay local-first for the next prototype phase, but move persistence planning toward **IndexedDB-backed local storage with explicit backup/restore** before any hosted database.

Do not introduce a hosted backend until the product loop is worth protecting with auth, deployment, and operational policy.

---

# Option Comparison

| Option | Fit Now | Benefits | Risks |
| --- | --- | --- | --- |
| `localStorage` | Good for prototype only | Simple, already working, easy reset | Fragile for valuable data, size limits, awkward recovery |
| IndexedDB | Best next local step | Browser-local, larger capacity, async, no server required | Needs migration and backup UX |
| SQLite / local file | Good later if desktop/local app emerges | Durable, inspectable, backup-friendly | Adds runtime/package decisions |
| Hosted database | Too early | Remote access, sync, auth path | Requires infra, auth, logging policy, breach posture |
| Supabase/Postgres | Later candidate | Strong hosted path | Too much product/infrastructure commitment now |

---

# Backup Requirements

Before meaningful private use:

- Provide JSON export. Implemented.
- Provide Markdown export. Implemented.
- Provide explicit restore/import from JSON. Implemented.
- Show private/sensitive counts before export/import/reset. Implemented for export and import preview.
- Keep deleted notes/person records out of restored state unless present in the imported file.
- Preserve source note IDs for memories and open loops.

---

# Migration Rules

When moving beyond `localStorage`:

- Keep existing export format readable.
- Add a one-time migration from current local data.
- Keep schema migrations in one explicit registry.
- Keep unversioned raw exports readable through the current migration path.
- Do not require a remote account.
- Do not introduce analytics or prompt logging.
- Add tests for migration, restore, and malformed import handling.

---

# IndexedDB Migration Trigger

Move from `localStorage` to IndexedDB when at least two of these signals are true:

- Data volume reaches roughly 50 people, 150 notes, or a JSON export larger than 1 MB.
- A real or anonymized private-use trial runs for at least two weeks and the user wants to keep using the same dataset.
- Restore/import/export is trusted enough that destructive testing can be reversed from a backup.
- Browser storage reliability becomes a real risk, such as localStorage quota warnings, sluggish saves, or anxiety about accidental browser clearing.
- The app needs larger local-only artifacts, such as richer note histories, attachment metadata, prompt traces, or local audit logs.

Do not treat IndexedDB as a reason to add hosted accounts, sync, analytics, or provider logging. The migration should preserve the current local-first privacy posture.

---

# Hosted Backend Gate

Do not add a hosted backend until these are true:

- The app is useful after a real or simulated 25-note trial.
- Persistence pain is clearer than local-first simplicity.
- Auth requirements are documented.
- Prompt/data logging policy is documented.
- Backup/export remains available.

---

# Current Recommendation

Next persistence work should be:

1. Keep the current schema migration registry tested as export formats change.
2. Add migration tests before changing storage engines.
3. Move browser persistence from `localStorage` to IndexedDB when the trigger criteria above are met.
4. Revisit SQLite/local-file if this becomes a desktop-first app.
5. Revisit hosted database only after the MVP is worth accessing across devices.
