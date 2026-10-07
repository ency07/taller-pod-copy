-- Taller POD — Sync Supabase
-- Ejecutar UNA sola vez en Supabase > SQL Editor > Run

create table if not exists public.pod_project_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pod_project_sync enable row level security;

revoke all on table public.pod_project_sync from anon;
revoke all on table public.pod_project_sync from authenticated;
grant select, insert, update on table public.pod_project_sync to authenticated;

drop policy if exists "POD users read own sync" on public.pod_project_sync;
create policy "POD users read own sync"
  on public.pod_project_sync for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "POD users create own sync" on public.pod_project_sync;
create policy "POD users create own sync"
  on public.pod_project_sync for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "POD users update own sync" on public.pod_project_sync;
create policy "POD users update own sync"
  on public.pod_project_sync for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
