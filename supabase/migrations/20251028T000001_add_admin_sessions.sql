-- Create admin_sessions table to persist admin auth sessions across restarts
create table if not exists public.admin_sessions (
  token text primary key,
  admin_id uuid not null references public.admin_accounts(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_admin_sessions_admin_id on public.admin_sessions(admin_id);
create index if not exists idx_admin_sessions_expires_at on public.admin_sessions(expires_at);
create index if not exists idx_admin_sessions_revoked_at on public.admin_sessions(revoked_at);

-- RLS: allow only service role to access; block anon/auth by default
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


