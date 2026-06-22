# Friend CRM - Start Here

## Product

Friend CRM is a private relationship intelligence desk. It helps one person remember people, promises, context, social opportunities, boundaries, and next moves.

The product should feel slightly uncomfortable in the right way: useful, strategic, and a little funny. It should not become a generic sales CRM with friendlier labels.

## MVP goal

Build a local-first single-user app where Marcus can:

- Add people.
- Capture notes after interactions.
- Extract durable memories and open loops.
- See who needs attention.
- Plan social moves.
- Generate a pre-meeting brief before seeing someone.

No automated outreach in MVP.

## Design rule

The aesthetic hook is "private intelligence desk for a real social life." The engineering rule is source-backed memory. Any AI-generated memory or suggestion should be traceable to notes the user entered.

## First build

Use a simple stack:

- Next.js or Vite React.
- Local SQLite, IndexedDB, or a small Postgres/Supabase backend.
- Server-side AI calls only.
- Export/delete data from day one.

Build the deterministic app before adding AI. The core product is the relationship data model and the review surfaces.

## Non-negotiables

- No scraping private messages.
- No automated sending.
- No hidden scoring.
- No "lead", "pipeline", "deal", or "conversion" language.
- User owns all data.
- Sensitive notes are easy to flag, export, and delete.

## MVP success test

The product is working when it can answer:

- Who have I neglected?
- Who am I seeing soon?
- What should I remember before I see them?
- What did I promise?
- What is the next thoughtful move?
- Which relationships are active, fragile, strategic, or protected?

