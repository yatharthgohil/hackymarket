-- ============================================
-- OAuth (e.g. Google) profile handling
-- ============================================
-- When a user signs up via OAuth (email not @hackymarket.lol):
-- - Username: unique, URL-safe (email prefix + short id) to avoid collisions
-- - Auto-approve (is_approved = true, balance = 1000) so they can trade immediately
-- Username/password signups (@hackymarket.lol) keep existing behavior (unapproved, 0 balance).
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username text;
  v_is_approved boolean;
  v_balance numeric;
BEGIN
  IF NEW.email LIKE '%@hackymarket.lol' THEN
    -- Username/password signup: use metadata or email prefix, not approved yet
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
    v_is_approved := false;
    v_balance := 0;
  ELSE
    -- OAuth signup: unique URL-safe username (prefix + first 8 chars of id), auto-approve
    v_username := lower(split_part(NEW.email, '@', 1)) || '_' || left(replace(NEW.id::text, '-', ''), 8);
    v_is_approved := true;
    v_balance := 1000;
  END IF;

  INSERT INTO public.profiles (id, username, balance, is_approved, is_admin)
  VALUES (
    NEW.id,
    v_username,
    v_balance,
    v_is_approved,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
