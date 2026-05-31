update public.seminars
set
  name = '数理最適化ゼミ',
  description = '最適化理論、凸解析、数理モデルの輪読メモをまとめます。',
  color = '#a78bfa'
where name = '輪読ゼミA';

update public.seminars
set
  name = 'Python 機械学習ゼミ',
  description = 'Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。',
  color = '#38bdf8'
where name = '輪読ゼミB';

insert into public.seminars (name, description, color)
values
  ('数理最適化ゼミ', '最適化理論、凸解析、数理モデルの輪読メモをまとめます。', '#a78bfa'),
  ('Python 機械学習ゼミ', 'Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。', '#38bdf8')
on conflict (name) do update set
  description = excluded.description,
  color = excluded.color;
