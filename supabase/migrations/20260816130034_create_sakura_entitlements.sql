create table public.sakura_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_tier text not null default 'free' check (access_tier in ('free','premium','lifetime')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '3 days'),
  subscription_status text not null default 'none' check (subscription_status in ('none','active','past_due','canceled','paused')),
  subscription_provider text,
  provider_customer_id text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sakura_entitlements enable row level security;

create policy "Users can read their own Sakura entitlement"
on public.sakura_entitlements
for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_sakura_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.sakura_entitlements (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_create_sakura_entitlement
after insert on auth.users
for each row execute function public.handle_new_sakura_user();

create or replace function public.set_sakura_entitlement_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_sakura_entitlement_updated_at
before update on public.sakura_entitlements
for each row execute function public.set_sakura_entitlement_updated_at();

create or replace function public.get_my_sakura_access()
returns table(
  access_tier text,
  effective_tier text,
  has_premium_access boolean,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  trial_seconds_remaining bigint,
  subscription_status text,
  current_period_end timestamptz
)
language sql
stable
set search_path = ''
as $$
  select
    e.access_tier,
    case
      when e.access_tier = 'lifetime' then 'lifetime'
      when e.access_tier = 'premium'
        and e.subscription_status in ('active','canceled')
        and (e.current_period_end is null or e.current_period_end > now()) then 'premium'
      when e.trial_ends_at > now() then 'trial'
      else 'free'
    end as effective_tier,
    case
      when e.access_tier = 'lifetime' then true
      when e.access_tier = 'premium'
        and e.subscription_status in ('active','canceled')
        and (e.current_period_end is null or e.current_period_end > now()) then true
      when e.trial_ends_at > now() then true
      else false
    end as has_premium_access,
    e.trial_started_at,
    e.trial_ends_at,
    greatest(0, floor(extract(epoch from (e.trial_ends_at - now())))::bigint) as trial_seconds_remaining,
    e.subscription_status,
    e.current_period_end
  from public.sakura_entitlements e
  where e.user_id = auth.uid();
$$;
