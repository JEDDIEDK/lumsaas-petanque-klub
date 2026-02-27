-- Extensions
create extension if not exists "pgcrypto";

-- Utility function for role checks in RLS policies
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = user_id
      and p.role = 'admin'
  );
$$;

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id bigint generated always as identity primary key,
  date date not null,
  start_time time not null,
  type text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('yes', 'maybe', 'no')),
  comment text,
  updated_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create table if not exists public.matches (
  id bigint generated always as identity primary key,
  date date not null,
  season text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  is_approved boolean not null default false,
  player_a text not null,
  player_b text not null,
  score_a int not null check (score_a >= 0),
  score_b int not null check (score_b >= 0),
  created_at timestamptz not null default now(),
  check (player_a <> player_b)
);

create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_events_date on public.events(date);
create index if not exists idx_attendance_event on public.attendance(event_id);
create index if not exists idx_attendance_user on public.attendance(user_id);
create index if not exists idx_matches_season on public.matches(season);
create index if not exists idx_matches_date on public.matches(date);

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Guard role updates by non-admins
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role and not public.is_admin(auth.uid()) then
    raise exception 'Only admins can change role';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger
before update on public.profiles
for each row execute function public.protect_profile_role();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.events enable row level security;
alter table public.attendance enable row level security;
alter table public.matches enable row level security;
alter table public.announcements enable row level security;

-- profiles policies
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- inquiries policies
create policy "inquiries_public_insert"
on public.inquiries
for insert
to anon, authenticated
with check (true);

create policy "inquiries_admin_read"
on public.inquiries
for select
using (public.is_admin(auth.uid()));

-- events policies
create policy "events_public_read"
on public.events
for select
to anon, authenticated
using (true);

create policy "events_admin_insert"
on public.events
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "events_admin_update"
on public.events
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "events_admin_delete"
on public.events
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- attendance policies
create policy "attendance_auth_read"
on public.attendance
for select
to authenticated
using (true);

create policy "attendance_auth_insert_own"
on public.attendance
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "attendance_auth_update_own"
on public.attendance
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- matches policies
create policy "matches_public_read"
on public.matches
for select
to anon, authenticated
using (
  is_approved = true
  or public.is_admin(auth.uid())
  or auth.uid() = created_by
);

create policy "matches_auth_insert"
on public.matches
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "matches_admin_delete"
on public.matches
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "matches_admin_update"
on public.matches
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- announcements policies
create policy "announcements_public_read"
on public.announcements
for select
to anon, authenticated
using (true);

create policy "announcements_admin_insert"
on public.announcements
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "announcements_admin_update"
on public.announcements
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "announcements_admin_delete"
on public.announcements
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Storage bucket + policies
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "gallery_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'gallery');

create policy "gallery_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery' and public.is_admin(auth.uid()));

create policy "gallery_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery' and public.is_admin(auth.uid()));

-- Seed base content
insert into public.events (date, start_time, type, note)
values
  (current_date + interval '3 day', time '14:00', 'Træning', 'Fokus på præcisionskast'),
  (current_date + interval '10 day', time '14:00', 'Træning', 'Alle niveauer velkomne'),
  (current_date + interval '17 day', time '10:00', 'Lørdagsspil', 'Kaffe og hygge bagefter'),
  (current_date + interval '24 day', time '14:00', 'Træning', 'Fri makkertrækning')
on conflict do nothing;

insert into public.announcements (title, body)
values
  ('Velkommen til ny sæson', 'Vi starter sæsonen med åbent hus og gratis prøvetræning.'),
  ('Banerne klargjort', 'Tak til alle frivillige der hjalp med forårsklargøring af banerne.'),
  ('Lørdagshygge', 'Husk social lørdagsspil hver anden uge. Gæster er velkomne.')
on conflict do nothing;
