# Friend CRM - Build Plan

## Phase 0 - Repo setup

- Create app scaffold.
- Add database schema.
- Add seed data for 10 fake people.
- Add README and environment docs.

## Phase 1 - Deterministic core

- Person CRUD.
- Note CRUD.
- Open loop CRUD.
- Next move CRUD.
- People list filters.
- Person detail page.
- Radar page with deterministic overdue/drift logic.

Exit criteria:

- User can manage people and notes without AI.
- Radar surfaces overdue people and open loops.

## Phase 2 - AI extraction

- Add server route for Memory Extractor.
- Validate AI output with schema.
- Build extraction review UI.
- Save accepted memories/open loops only after user confirmation.

Exit criteria:

- User can paste a messy note and convert it into reviewed structured memory.

## Phase 3 - Briefs and next moves

- Add pre-meeting brief route.
- Add next move generator route.
- Add copy/edit flow.
- Add sensitive context warnings.

Exit criteria:

- User can open a person and generate a useful brief in under 10 seconds.

## Phase 4 - Export/delete

- JSON export.
- Markdown export by person.
- Delete note.
- Delete person.
- Sensitive/private filtering in export.

Exit criteria:

- User can leave the app with their data intact.

## Phase 5 - Demo polish

- Add sample dataset.
- Add clean dashboard.
- Add empty states.
- Add basic keyboard shortcuts.
- Add deployment notes.

## First implementation order

1. Schema.
2. Seed data.
3. People list.
4. Person detail.
5. Notes.
6. Radar.
7. AI extraction.
8. Briefs.
9. Export/delete.

