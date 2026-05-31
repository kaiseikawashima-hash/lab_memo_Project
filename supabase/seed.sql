insert into public.seminars (name, description, color)
values
  ('研究ゼミ', '研究テーマの議論、進捗、関連論文の理解メモを蓄積します。', '#22d3ee'),
  ('数理最適化ゼミ', '最適化理論、凸解析、数理モデルの輪読メモをまとめます。', '#a78bfa'),
  ('Python 機械学習ゼミ', 'Python 実装、機械学習モデル、実験まわりの輪読メモをまとめます。', '#38bdf8')
on conflict (name) do update set
  description = excluded.description,
  color = excluded.color;
