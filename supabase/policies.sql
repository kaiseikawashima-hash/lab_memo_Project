alter table public.seminars enable row level security;
alter table public.sessions enable row level security;
alter table public.notes enable row level security;

drop policy if exists "Public read seminars" on public.seminars;
create policy "Public read seminars"
on public.seminars for select
using (true);

drop policy if exists "Public insert seminars" on public.seminars;
create policy "Public insert seminars"
on public.seminars for insert
with check (true);

drop policy if exists "Public read sessions" on public.sessions;
create policy "Public read sessions"
on public.sessions for select
using (true);

drop policy if exists "Public insert sessions" on public.sessions;
create policy "Public insert sessions"
on public.sessions for insert
with check (true);

drop policy if exists "Public update sessions" on public.sessions;
create policy "Public update sessions"
on public.sessions for update
using (true)
with check (true);

drop policy if exists "Public delete sessions" on public.sessions;
create policy "Public delete sessions"
on public.sessions for delete
using (true);

drop policy if exists "Public read notes" on public.notes;
create policy "Public read notes"
on public.notes for select
using (true);

drop policy if exists "Public insert notes" on public.notes;
create policy "Public insert notes"
on public.notes for insert
with check (true);

drop policy if exists "Public update notes" on public.notes;
create policy "Public update notes"
on public.notes for update
using (true)
with check (true);

drop policy if exists "Public delete notes" on public.notes;
create policy "Public delete notes"
on public.notes for delete
using (true);
