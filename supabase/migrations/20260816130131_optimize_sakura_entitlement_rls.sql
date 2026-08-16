drop policy if exists "Users can read their own Sakura entitlement" on public.sakura_entitlements;

create policy "Users can read their own Sakura entitlement"
on public.sakura_entitlements
for select
to authenticated
using ((select auth.uid()) = user_id);
