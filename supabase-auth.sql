-- ============================================================================
-- 找搭子 · 注册改"手机号 + 密码"：profiles 增加 姓名 + 出生日期 两列
-- （nickname / province / city 已存在；本脚本只补 name 和 birth_date）
-- 用法：Supabase 后台 → SQL Editor → 粘贴运行
-- ============================================================================
alter table public.profiles
  add column if not exists name       text,   -- 注册时填的姓名（默认也写入 nickname 供排行榜显示）
  add column if not exists birth_date  text;   -- 出生日期 'YYYY-MM-DD'，选填
