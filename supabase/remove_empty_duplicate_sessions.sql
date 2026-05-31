with note_counts as (
  select
    s.id,
    s.seminar_id,
    s.title,
    s.date,
    coalesce(s.paper_title, '') as paper_title,
    s.created_at,
    count(n.id) as note_count
  from public.sessions s
  left join public.notes n on n.session_id = s.id
  group by s.id
),
ranked as (
  select
    *,
    row_number() over (
      partition by seminar_id, title, date, paper_title
      order by note_count desc, created_at asc
    ) as duplicate_rank
  from note_counts
)
delete from public.sessions s
using ranked r
where s.id = r.id
  and r.duplicate_rank > 1
  and r.note_count = 0
returning s.id, s.title, s.date;
