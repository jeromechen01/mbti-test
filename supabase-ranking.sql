-- ============================================================================
-- 找搭子 · 匹配排行榜 —— profiles 扩字段 + 安全的跨用户读取 + 实时
-- 用法：Supabase 后台 → SQL Editor → 全选粘贴 → Run
-- ============================================================================

-- 1) profiles 新增字段（nickname / mbti_code / buddy_tag 已存在）
alter table public.profiles
  add column if not exists nickname    text,
  add column if not exists base_code   text,                       -- 4 字母（ENFP），匹配算法用
  add column if not exists scene_tags  jsonb default '[]'::jsonb,  -- 场景副标签 key 数组
  add column if not exists province    text,                       -- 选填，地缘加分用
  add column if not exists city        text;                       -- 选填

-- 2) 🔒 彻底删掉 email 列：会话里已有 email，profiles 不需要存。
--    删掉后 profiles 表无任何敏感字段，排行榜读取/实时推送都不可能泄露邮箱。
alter table public.profiles drop column if exists email;

-- 3) 建档触发器去掉 email 写入（配合上一步）
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end; $$;

-- 4) RLS：允许登录用户读取所有人的资料（用于匹配排行榜 + 实时）。
--    profiles 已无敏感列，全列可读是安全的。写入仍受"本人 only"策略限制（不动）。
drop policy if exists "leaderboard read others" on public.profiles;
create policy "leaderboard read others" on public.profiles
  for select to authenticated using (true);

-- 5) 开启 profiles 表实时（新用户完成测试 → 自动推送，前端刷新排行榜）。
--    若提示 "already member of publication" 属正常，已开启即可。
do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when others then
  null;
end $$;
