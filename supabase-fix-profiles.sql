-- ============================================================================
-- 修复 profiles 写入：确保字段齐全 + RLS 允许本人 upsert（insert + update）
-- 用法：Supabase → SQL Editor → 粘贴运行（幂等，可重复跑）
-- 跑完后注册 / 测试完成都会正确写入 profiles，排行榜/查询即有数据。
-- ============================================================================

-- 1) 确保所有字段存在（缺哪个补哪个）
alter table public.profiles
  add column if not exists name       text,
  add column if not exists nickname   text,
  add column if not exists birth_date text,
  add column if not exists base_code  text,
  add column if not exists scene_tags jsonb default '[]'::jsonb,
  add column if not exists province   text,
  add column if not exists city       text,
  add column if not exists mbti_code  text,
  add column if not exists buddy_tag  text;

-- 2) RLS：本人可 insert + update（upsert 需要两者都放行）
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- 3) 跨用户只读（匹配排行榜用）—— 重申一遍，确保存在
drop policy if exists "leaderboard read others" on public.profiles;
create policy "leaderboard read others" on public.profiles
  for select to authenticated using (true);
