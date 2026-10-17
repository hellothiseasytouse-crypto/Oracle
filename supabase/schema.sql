-- Run this in the Supabase SQL Editor for ORACLE account cloud backups.
create table if not exists public.oracle_workspace_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.oracle_workspace_data enable row level security;

drop policy if exists "Users can read their own ORACLE workspace backup" on public.oracle_workspace_data;
create policy "Users can read their own ORACLE workspace backup"
  on public.oracle_workspace_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own ORACLE workspace backup" on public.oracle_workspace_data;
create policy "Users can insert their own ORACLE workspace backup"
  on public.oracle_workspace_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ORACLE workspace backup" on public.oracle_workspace_data;
create policy "Users can update their own ORACLE workspace backup"
  on public.oracle_workspace_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.oracle_workspace_data to authenticated;
