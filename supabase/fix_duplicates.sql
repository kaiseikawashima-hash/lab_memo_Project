with canonical as (
  select distinct on (name)
    id,
    name
  from public.seminars
  order by name, created_at asc
),
duplicates as (
  select
    s.id as duplicate_id,
    c.id as canonical_id
  from public.seminars s
  join canonical c on c.name = s.name
  where s.id <> c.id
)
update public.sessions
set seminar_id = duplicates.canonical_id
from duplicates
where public.sessions.seminar_id = duplicates.duplicate_id;

with canonical as (
  select distinct on (name)
    id,
    name
  from public.seminars
  order by name, created_at asc
)
delete from public.seminars s
using canonical c
where s.name = c.name
  and s.id <> c.id;

create unique index if not exists seminars_name_unique_idx
on public.seminars(name);
