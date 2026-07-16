# SUPABASE_BACKEND.md - Optional Hosted Persistence

Friend CRM remains local-first by default.

This document describes the optional Supabase hosted persistence foundation added for future authenticated trials.

---

# Current Status

Implemented in repo:

- Supabase CLI config.
- Initial SQL migration with tables, indexes, triggers, and RLS.
- Hosted Supabase project `friendcrm` linked at project ref `mjrqxmcicoreeovitscy`.
- Initial migration pushed to the hosted database on 2026-07-02.
- Optional web Supabase client.
- Optional web sync mapper.
- Web Evidence Locker hosted sync panel with sign-in/sign-up/sign-out controls.
- Local/synced mode gate and explicit hosted write arming switch.
- Hosted push guard that excludes unconfirmed durable memories.
- Optional Expo mobile Supabase client.
- Environment variable examples.

Not completed yet:

- Confirmed fake-user RLS write smoke.
- Mobile sync controls.
- Production deployment.

The hosted schema is available for authenticated fake-data sync trials, but the app still defaults to local fake-data mode. A public-client signup smoke on 2026-07-02 succeeded but returned no session because Supabase email confirmation is currently required, so a confirmed test account or auth-setting decision is needed before completing browser-hosted write verification.

2026-07-09 next-stage directive note: Supabase/RLS smoke was not run during the mobile device-smoke pass. No confirmed fake test account credentials or service-role credential were available in the directive context, and no secrets were printed or committed. Keep this as a separate gated fake-data-only task.

---

# Product Boundary

Supabase is optional hosted persistence. It must not replace the fake-data local demo by default.

Rules:

- Keep fake-data demo mode working without Supabase.
- Do not commit service-role keys, database passwords, private data, or real user data.
- Do not call AI providers from browser/mobile clients.
- Do not save AI-generated durable memories without explicit user confirmation.
- Keep sensitive/private labels visible near user content.

---

# Schema

Migration:

`supabase/migrations/20260701123500_initial_friendcrm_schema.sql`

Tables:

- `profiles`
- `people`
- `relationship_notes`
- `memories`
- `open_loops`
- `next_moves`
- `interactions`
- `sync_events`

All user-owned tables use:

- `owner_id uuid references auth.users(id)`
- RLS enabled.
- Policies constrained by `owner_id = auth.uid()`.

`profiles` uses:

- `id = auth.uid()`.

Hosted rows include `local_id` fields so local browser/mobile IDs can sync into Supabase without immediately changing the existing app data model.

---

# Environment Variables

Web:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Expo mobile:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Never expose:

- Supabase service-role key.
- Database password.
- Provider API keys.

---

# Web Adapter

Files:

- `src/lib/supabaseClient.ts`
- `src/lib/supabaseSync.ts`

The adapter can:

- Create a Supabase client when env vars exist.
- Fetch user-owned CRM rows from Supabase.
- Push local `CrmData` into Supabase using `owner_id` and `local_id` upserts.
- Exclude unconfirmed durable memories from hosted sync.

The current web UI includes an opt-in hosted sync panel in Evidence Locker. Local mode remains default; hosted writes require sign-in, synced mode, and a separate acknowledgement checkbox.

---

# Mobile Adapter

File:

- `apps/mobile/src/core/supabaseClient.ts`

The Expo app still uses AsyncStorage by default. The Supabase client is present for future optional sign-in/sync work.

---

# Cloud Project Setup

Supabase account state on 2026-07-02:

- CLI installed: `2.108.0`
- Logged in.
- Organization: `Eagle Rocket LLC`
- Project: `friendcrm`
- Project ref: `mjrqxmcicoreeovitscy`
- Region: `us-west-2`
- Status: `ACTIVE_HEALTHY`

Completed commands:

```bash
supabase projects create friendcrm --org-id cdhoaoqohhzykmhdtimu --region us-west-2 --size nano --db-password "<generated>"
supabase link --project-ref mjrqxmcicoreeovitscy --password "<generated>"
supabase db push --linked --password "<generated>"
```

The database password was generated outside the repo and must not be committed. Move it to a password manager or reset it from Supabase if needed.

# Remote Migration Push

Current migration state:

```text
Local          | Remote
20260701123500 | 20260701123500
```

Local env files were created for web and mobile with the project URL and public client key:

```bash
VITE_SUPABASE_URL=https://mjrqxmcicoreeovitscy.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
EXPO_PUBLIC_SUPABASE_URL=https://mjrqxmcicoreeovitscy.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

The anon or publishable key is public-client safe when RLS is correct. The service-role or secret key is not.

---

# Recommended Next Work

1. Decide whether to disable email confirmations for fake-data trial accounts or create a confirmed test account.
2. Complete authenticated fake-user RLS write/read smoke.
3. Add mobile sync controls if the Expo app continues toward a hosted trial.
4. Add integration tests or a scripted Supabase sync trial with fake data only.
5. Verify RLS with authenticated fake users before any real-data trial.
