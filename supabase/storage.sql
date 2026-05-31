insert into storage.buckets (id, name, public)
values ('seminar-pdfs', 'seminar-pdfs', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read seminar PDFs" on storage.objects;
create policy "Public read seminar PDFs"
on storage.objects for select
using (bucket_id = 'seminar-pdfs');

drop policy if exists "Anon upload seminar PDFs" on storage.objects;
create policy "Anon upload seminar PDFs"
on storage.objects for insert
with check (bucket_id = 'seminar-pdfs');

drop policy if exists "Anon update seminar PDFs" on storage.objects;
create policy "Anon update seminar PDFs"
on storage.objects for update
using (bucket_id = 'seminar-pdfs')
with check (bucket_id = 'seminar-pdfs');

drop policy if exists "Anon delete seminar PDFs" on storage.objects;
create policy "Anon delete seminar PDFs"
on storage.objects for delete
using (bucket_id = 'seminar-pdfs');
