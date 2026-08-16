revoke all privileges on table public.sakura_entitlements from anon, authenticated;
grant select on table public.sakura_entitlements to authenticated;

revoke execute on function public.get_my_sakura_access() from public, anon;
grant execute on function public.get_my_sakura_access() to authenticated, service_role;
