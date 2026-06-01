create extension if not exists pgcrypto;

create table if not exists public.seminars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text,
  created_at timestamp with time zone default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  seminar_id uuid references public.seminars(id) on delete cascade,
  title text not null,
  session_number integer,
  date date,
  speaker text,
  paper_title text,
  paper_authors text,
  paper_url text,
  summary text,
  pdf_url text,
  pdf_path text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  page_number integer,
  question text not null,
  answer text,
  my_note text,
  tags text[],
  is_important boolean default false,
  is_before_talk boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_sessions_updated_at on public.sessions;
create trigger set_sessions_updated_at
before update on public.sessions
for each row execute function public.set_updated_at();

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

create index if not exists sessions_seminar_id_idx on public.sessions(seminar_id);
create index if not exists notes_session_id_idx on public.notes(session_id);
create index if not exists notes_tags_idx on public.notes using gin(tags);
create index if not exists notes_flags_idx on public.notes(is_important, is_before_talk);
create unique index if not exists seminars_name_unique_idx on public.seminars(name);
