# Google OAuth (one-click sign-in) setup

The app uses **Sign in with Google** only. To enable it:

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Open **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
3. If prompted, configure the OAuth consent screen (external user type is fine for testing).
4. Application type: **Web application**.
5. Add **Authorized redirect URIs**:
   - Use the URL from Supabase (see step 2): `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret**.

## 2. Supabase Dashboard

1. Open your project at [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **Providers**.
2. Enable **Google** and paste the **Client ID** and **Client Secret** from Google.
3. Under **Redirect URL**, Supabase shows the URL to use. Add it in Google Cloud Console as an **Authorized redirect URI** if needed.
4. Save.

## 3. Allowed redirect URLs in Supabase

The app sends users to your site’s `/auth/callback` after Google sign-in. Add:

1. In Supabase: **Authentication** → **URL Configuration** → **Redirect URLs**.
2. Add:
   - `http://localhost:3000/auth/callback` (local)
   - `https://your-production-domain.com/auth/callback` (production)

Save. Without these, Supabase will block the redirect after sign-in.

## 4. Database migration

Run the single sign-in onboarding migration so new users get a profile and the set-username step works:

- **Supabase Dashboard**: SQL Editor → run the contents of `supabase/migrations/025_single_signin_onboarding.sql`
- **CLI**: `supabase db push` (or `supabase migration up`)

## Behavior

- **Sign in**: User clicks “Sign in with Google” on `/login` → Google → `/auth/callback` → session set.
- **Existing user**: Redirect to `/`.
- **New user**: Redirect to `/set-username` → user chooses a username and clicks Save → redirect to `/`.
- No signup page, no phone verification. One sign-in flow only.
