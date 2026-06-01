create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  year integer,
  venue text,
  url text,
  abstract text,
  one_line_summary text,
  japanese_summary text,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.sessions
add column if not exists paper_id uuid references public.papers(id) on delete set null,
add column if not exists ai_one_liner text,
add column if not exists ai_summary text,
add column if not exists ai_tags text[],
add column if not exists ai_keywords text[];

create table if not exists public.translation_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  page_number integer,
  section_title text,
  original_text text,
  japanese_translation text,
  my_comment text,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

drop trigger if exists set_papers_updated_at on public.papers;
create trigger set_papers_updated_at
before update on public.papers
for each row execute function public.set_updated_at();

drop trigger if exists set_translation_notes_updated_at on public.translation_notes;
create trigger set_translation_notes_updated_at
before update on public.translation_notes
for each row execute function public.set_updated_at();

create index if not exists papers_tags_idx on public.papers using gin(tags);
create index if not exists sessions_ai_tags_idx on public.sessions using gin(ai_tags);
create index if not exists sessions_ai_keywords_idx on public.sessions using gin(ai_keywords);
create index if not exists sessions_paper_id_idx on public.sessions(paper_id);
create index if not exists translation_notes_session_id_idx on public.translation_notes(session_id);
create index if not exists translation_notes_tags_idx on public.translation_notes using gin(tags);

alter table public.papers enable row level security;
alter table public.translation_notes enable row level security;

drop policy if exists "Public read papers" on public.papers;
create policy "Public read papers" on public.papers for select using (true);

drop policy if exists "Public insert papers" on public.papers;
create policy "Public insert papers" on public.papers for insert with check (true);

drop policy if exists "Public update papers" on public.papers;
create policy "Public update papers" on public.papers for update using (true) with check (true);

drop policy if exists "Public delete papers" on public.papers;
create policy "Public delete papers" on public.papers for delete using (true);

drop policy if exists "Public read translation notes" on public.translation_notes;
create policy "Public read translation notes" on public.translation_notes for select using (true);

drop policy if exists "Public insert translation notes" on public.translation_notes;
create policy "Public insert translation notes" on public.translation_notes for insert with check (true);

drop policy if exists "Public update translation notes" on public.translation_notes;
create policy "Public update translation notes" on public.translation_notes for update using (true) with check (true);

drop policy if exists "Public delete translation notes" on public.translation_notes;
create policy "Public delete translation notes" on public.translation_notes for delete using (true);
