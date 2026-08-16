revoke execute on function public.handle_new_sakura_user() from public, anon, authenticated;
revoke execute on function public.set_sakura_entitlement_updated_at() from public, anon, authenticated;

grant execute on function public.handle_new_sakura_user() to service_role;
grant execute on function public.set_sakura_entitlement_updated_at() to service_role;
