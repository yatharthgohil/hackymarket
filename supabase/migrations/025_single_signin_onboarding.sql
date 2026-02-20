-- ============================================
-- Single sign-in: onboarding for new users
-- ============================================
-- Add onboarding_complete. New users (Google OAuth only) get placeholder username,
-- balance 1000, is_approved true, onboarding_complete false until they set a username.
-- ============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete boolean NOT NULL DEFAULT true;

-- Backfill: existing rows keep onboarding_complete = true (default above)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username text;
BEGIN
  -- All new users (Google OAuth): placeholder username until they choose one
  v_username := 'user_' || left(replace(NEW.id::text, '-', ''), 8);

  INSERT INTO public.profiles (id, username, balance, is_approved, is_admin, onboarding_complete)
  VALUES (
    NEW.id,
    v_username,
    1000,
    true,
    false,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
