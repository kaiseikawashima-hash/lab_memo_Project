do $$
declare
  math_id uuid;
  python_id uuid;
begin
  select id into math_id
  from public.seminars
  where name in ('数理最適化ゼミ', '輪読ゼミA')
  order by case when name = '数理最適化ゼミ' then 0 else 1 end, created_at asc
  limit 1;

  if math_id is null then
    insert into public.seminars (name, description, color)
    values ('数理最適化ゼミ', '最適化理論、凸解析、数理モデルの輪読メモをまとめます。', '#a78bfa')
    returning id into math_id;
  end if;

  update public.sessions
  set seminar_id = math_id
  where seminar_id in (
    select id from public.seminars where name in ('輪読ゼミA', '数理最適化ゼミ') and id <> math_id
  );

  delete from public.seminars
  where name in ('輪読ゼミA', '数理最適化ゼミ')
    and id <> math_id;

  update public.seminars
  set
    name = '数理最適化ゼミ',
    description = '最適化理論、凸解析、数理モデルの輪読メモをまとめます。',
    color = '#a78bfa'
  where id = math_id;

  select id into python_id
  from public.seminars
  where name in ('Python 機械学習ゼミ', '輪読ゼミB')
  order by case when name = 'Python 機械学習ゼミ' then 0 else 1 end, created_at asc
  limit 1;

  if python_id is null then
    insert into public.seminars (name, description, color)
    values ('Python 機械学習ゼミ', 'Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。', '#38bdf8')
    returning id into python_id;
  end if;

  update public.sessions
  set seminar_id = python_id
  where seminar_id in (
    select id from public.seminars where name in ('輪読ゼミB', 'Python 機械学習ゼミ') and id <> python_id
  );

  delete from public.seminars
  where name in ('輪読ゼミB', 'Python 機械学習ゼミ')
    and id <> python_id;

  update public.seminars
  set
    name = 'Python 機械学習ゼミ',
    description = 'Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。',
    color = '#38bdf8'
  where id = python_id;
end $$;
