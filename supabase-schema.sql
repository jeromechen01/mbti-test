-- ============================================================================
-- 饭搭子 App —— Supabase 建表脚本
-- 用法：Supabase 后台 → SQL Editor → New query → 全选本文件内容粘贴 → Run
-- 跑完应显示 "Success. No rows returned"
-- ============================================================================

-- ============ profiles：用户档案 ============
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  nickname    text,
  mbti_code   text,
  buddy_tag   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- 新用户注册后自动建档
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ============ reports：每次测试报告 ============
create table if not exists public.reports (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  set_code       text default 'campus40',
  mbti_code      text,
  base_code      text,
  buddy_main_tag text,
  scene_tags     jsonb default '[]'::jsonb,
  dimensions     jsonb,
  answers        jsonb,
  share_code     text unique,
  created_at     timestamptz default now()
);
alter table public.reports enable row level security;
create policy "own reports select" on public.reports for select using (auth.uid() = user_id);
create policy "own reports insert" on public.reports for insert with check (auth.uid() = user_id);
create policy "own reports delete" on public.reports for delete using (auth.uid() = user_id);
create index if not exists reports_user_idx on public.reports(user_id, created_at desc);

-- ============ 分享码查询：凭码读单份报告（不开放全表给匿名） ============
create or replace function public.get_shared_report(code text)
returns setof public.reports language sql security definer set search_path = public as $$
  select * from public.reports where share_code = code limit 1;
$$;
grant execute on function public.get_shared_report(text) to anon, authenticated;
