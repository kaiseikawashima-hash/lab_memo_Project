insert into public.seminars (name, description, color)
values
  ('研究ゼミ', '研究テーマの議論、進捗、関連論文の理解メモを蓄積します。', '#22d3ee'),
  ('輪読ゼミA', '理論・数理最適化・基礎寄りの輪読メモをまとめます。', '#a78bfa'),
  ('輪読ゼミB', '機械学習モデル、システム、応用寄りの輪読メモをまとめます。', '#38bdf8')
on conflict (name) do update set
  description = excluded.description,
  color = excluded.color;
