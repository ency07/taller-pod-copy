-- Security hardening for the existing auth.users trigger function.
-- Review and apply manually in Supabase SQL Editor after confirming the trigger exists.
-- This does not change the function body or remove the trigger.
--
-- Why: Supabase Security Advisor reported that public.handle_new_user() is
-- SECURITY DEFINER, has a mutable search_path, and is executable by anon/authenticated.
-- Trigger functions normally do not need to be exposed as RPC endpoints.

ALTER FUNCTION public.handle_new_user()
  SET search_path = pg_catalog, public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

-- Intentionally do not grant EXECUTE to client roles.
-- Do not run this if the function is also intentionally called as an RPC.
-- Validate signup/profile creation after applying, because this is a live auth path.
