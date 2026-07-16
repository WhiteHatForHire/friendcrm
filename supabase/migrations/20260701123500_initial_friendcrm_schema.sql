-- Friend CRM hosted persistence foundation.
-- This schema is optional and user-owned; the app can continue to run local-first.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.people (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  name text not null check (length(trim(name)) > 0),
  aliases text[] not null default '{}',
  relationship_types text[] not null default '{}',
  city text,
  timezone text,
  contact_methods jsonb not null default '[]'::jsonb,
  profile_photo_url text,
  importance smallint not null default 3 check (importance between 1 and 5),
  warmth text not null default 'neutral' check (warmth in ('cold', 'cool', 'neutral', 'warm', 'hot')),
  trust smallint not null default 3 check (trust between 1 and 5),
  strategic_relevance smallint not null default 3 check (strategic_relevance between 1 and 5),
  sensitivity text not null default 'normal' check (sensitivity in ('normal', 'sensitive', 'private')),
  last_contact_at date,
  next_contact_at date,
  summary text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table public.relationship_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  person_ids uuid[] not null default '{}',
  local_person_ids text[] not null default '{}',
  occurred_at date not null default current_date,
  source_type text not null default 'manual' check (source_type in ('manual', 'call', 'dinner', 'meeting', 'text_summary', 'memory')),
  raw_text text not null check (length(trim(raw_text)) > 0),
  sensitivity text not null default 'normal' check (sensitivity in ('normal', 'sensitive', 'private')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  local_id text,
  local_person_id text,
  source_note_id uuid references public.relationship_notes(id) on delete set null,
  local_source_note_id text,
  text text not null check (length(trim(text)) > 0),
  category text not null default 'other' check (category in ('preference', 'life_context', 'boundary', 'history', 'interest', 'risk', 'other')),
  confidence text not null default 'medium' check (confidence in ('low', 'medium', 'high')),
  sensitivity text not null default 'normal' check (sensitivity in ('normal', 'sensitive', 'private')),
  confirmed boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id),
  check (confirmed = false or source_note_id is not null or local_source_note_id is not null)
);

create table public.open_loops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  local_id text,
  local_person_id text,
  source_note_id uuid references public.relationship_notes(id) on delete set null,
  local_source_note_id text,
  title text not null check (length(trim(title)) > 0),
  description text,
  due_at date,
  sensitivity text not null default 'normal' check (sensitivity in ('normal', 'sensitive', 'private')),
  status text not null default 'open' check (status in ('open', 'planned', 'done', 'dropped')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table public.next_moves (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid references public.people(id) on delete cascade,
  local_id text,
  local_person_id text,
  type text not null check (type in ('message', 'invite', 'intro', 'apology', 'ask', 'support', 'check_in', 'collaboration')),
  draft text not null check (length(trim(draft)) > 0),
  rationale text not null default '',
  risk text not null default 'medium' check (risk in ('low', 'medium', 'high')),
  status text not null default 'idea' check (status in ('idea', 'queued', 'done', 'dismissed')),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table public.interactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  local_id text,
  person_ids uuid[] not null default '{}',
  local_person_ids text[] not null default '{}',
  date date not null default current_date,
  channel text not null default 'manual',
  summary text not null default '',
  emotional_read text not null default '',
  follow_ups text not null default '',
  reflection text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, local_id)
);

create table public.sync_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  local_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index people_owner_updated_idx on public.people(owner_id, updated_at desc);
create index notes_owner_occurred_idx on public.relationship_notes(owner_id, occurred_at desc);
create index memories_owner_person_idx on public.memories(owner_id, person_id) where deleted_at is null;
create index open_loops_owner_person_status_idx on public.open_loops(owner_id, person_id, status) where deleted_at is null;
create index next_moves_owner_person_status_idx on public.next_moves(owner_id, person_id, status) where deleted_at is null;
create index interactions_owner_date_idx on public.interactions(owner_id, date desc);
create index sync_events_owner_created_idx on public.sync_events(owner_id, created_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger people_set_updated_at
before update on public.people
for each row execute function public.set_updated_at();

create trigger notes_set_updated_at
before update on public.relationship_notes
for each row execute function public.set_updated_at();

create trigger memories_set_updated_at
before update on public.memories
for each row execute function public.set_updated_at();

create trigger open_loops_set_updated_at
before update on public.open_loops
for each row execute function public.set_updated_at();

create trigger next_moves_set_updated_at
before update on public.next_moves
for each row execute function public.set_updated_at();

create trigger interactions_set_updated_at
before update on public.interactions
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.people enable row level security;
alter table public.relationship_notes enable row level security;
alter table public.memories enable row level security;
alter table public.open_loops enable row level security;
alter table public.next_moves enable row level security;
alter table public.interactions enable row level security;
alter table public.sync_events enable row level security;

create policy "profiles are user-owned"
on public.profiles
for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "people are user-owned"
on public.people
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "notes are user-owned"
on public.relationship_notes
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "memories are user-owned"
on public.memories
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "open loops are user-owned"
on public.open_loops
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "next moves are user-owned"
on public.next_moves
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "interactions are user-owned"
on public.interactions
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "sync events are user-owned"
on public.sync_events
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.people,
  public.relationship_notes,
  public.memories,
  public.open_loops,
  public.next_moves,
  public.interactions,
  public.sync_events
to authenticated;
