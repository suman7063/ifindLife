-- Ensure admin_sessions table exists and has required columns
create table if not exists public.admin_sessions (
  token text primary key,
  admin_id uuid not null references public.admin_accounts(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Add missing columns if table existed previously
alter table public.admin_sessions
  add column if not exists admin_id uuid,
  add column if not exists expires_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

-- Ensure admin_id has FK (skip if already present)
do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'admin_sessions'
      and c.contype = 'f'
  ) then
    alter table public.admin_sessions
      add constraint admin_sessions_admin_id_fkey
      foreign key (admin_id) references public.admin_accounts(id) on delete cascade;
  end if;
end $$;

-- Indexes
create index if not exists idx_admin_sessions_admin_id on public.admin_sessions(admin_id);
create index if not exists idx_admin_sessions_expires_at on public.admin_sessions(expires_at);
create index if not exists idx_admin_sessions_revoked_at on public.admin_sessions(revoked_at);

-- RLS policy remains service role only
alter table public.admin_sessions enable row level security;
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'admin_sessions' and policyname = 'service_role_only'
  ) then
    create policy service_role_only on public.admin_sessions
      for all
      using (false)
      with check (false);
  end if;
end $$;


