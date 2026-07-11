# ADR 0008 - Optional Supabase Hosted Persistence

## Status

Accepted

## Date

2026-07-01

## Context

Friend CRM is currently local-first. The web app uses browser storage, and the Expo prototype uses AsyncStorage. This remains the safest default for a private relationship-memory product and for the public fake-data portfolio demo.

The project also needs a path toward hosted persistence for future authenticated trials across devices. Supabase is a good fit because it provides Postgres, authentication, migrations, and row-level security without forcing a large custom backend.

## Decision

Add Supabase as an optional hosted persistence foundation.

The app should continue to support local-first fake-data demo mode. Supabase sync must be opt-in and require explicit configuration.

Initial hosted persistence uses:

- Supabase Auth for user identity.
- Postgres tables for profiles, people, notes, memories, open loops, next moves, interactions, and sync events.
- Row-level security on every user-owned table.
- `owner_id = auth.uid()` policies for authenticated users.
- Local IDs in hosted rows so browser/mobile local records can sync without immediate shared-package refactors.

Supabase must not be used to:

- Scrape private messages.
- Automate outreach.
- Add hidden scoring.
- Save AI-generated durable memories without confirmation.
- Store real secrets in the repo or browser/mobile clients.

## Consequences

Benefits:

- Creates a real hosted data path for future authenticated trials.
- Keeps data ownership scoped per user through RLS.
- Preserves local-first demo behavior.
- Gives web and mobile a common future backend.

Costs:

- Adds another persistence path to test.
- Requires careful sync semantics if local and hosted modes both evolve.
- Requires project/operator decisions around auth, deployment, billing, and key management.

## Current Implementation

Added:

- `supabase/config.toml`
- `supabase/migrations/20260701123500_initial_friendcrm_schema.sql`
- `src/lib/supabaseClient.ts`
- `src/lib/supabaseSync.ts`
- `apps/mobile/src/core/supabaseClient.ts`
- `docs/SUPABASE_BACKEND.md`

Supabase project `friendcrm` was created and linked on 2026-07-02 at project ref `mjrqxmcicoreeovitscy`. The initial migration was pushed to the hosted database, and local gitignored env files were configured with public client values for web and Expo mobile.

Remaining follow-up work:

- Add auth UI.
- Add a visible local/synced mode switch.
- Run authenticated fake-data sync and RLS verification before any real-data trial.
