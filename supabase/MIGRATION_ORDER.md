# Migration order (fresh project)

Run these **in this exact order** in the Supabase SQL Editor (or via CLI). Each file depends on the previous ones.

| Order | File |
|-------|------|
| 1 | `001_create_tables.sql` |
| 2 | `002_create_rls_policies.sql` |
| 3 | `003_create_functions.sql` |
| 4 | `004_add_notes_to_approved_codes.sql` |
| 5 | `005_allow_profile_reads.sql` |
| 6 | `006_fix_sell_rounding.sql` |
| 7 | `007_create_comments.sql` |
| 8 | `008_enable_realtime.sql` |
| 9 | `009_phone_verification.sql` |
| 10 | `010_allow_public_read_access.sql` |
| 11 | `011_get_market_trade_counts.sql` |
| 12 | `012_add_is_featured_to_markets.sql` |
| 13 | `013_auto_redeem_positions.sql` |
| 14 | `014_fix_sell_total_invested.sql` |
| 15 | `015_fix_total_invested_tracking.sql` |
| 16 | `016_enable_comments_realtime.sql` |
| 17 | `017_create_market_ideas.sql` |
| 18 | `018_restrict_phone_number_access.sql` |
| 19 | `019_secure_rpc_functions.sql` |
| 20 | `020_trade_rollback.sql` |
| 21 | `021_fix_rollback_total_invested.sql` |
| 22 | `022_fix_profile_update_and_admin_rpc.sql` |
| 23 | `023_lock_trade_functions_to_service_role.sql` |
| 24 | `024_oauth_profile_handling.sql` |
| 25 | `025_single_signin_onboarding.sql` |

## Option A: Supabase CLI (easiest if linked)

From project root:

```bash
supabase db push
```

This applies all migrations in order. If the project isn’t linked, run `supabase link` first.

## Option B: SQL Editor (Dashboard)

1. Open **Supabase Dashboard** → your project → **SQL Editor**.
2. For each file above, in order:
   - **+ New query**
   - Paste the full contents of `supabase/migrations/001_create_tables.sql`, run.
   - New query, paste `002_create_rls_policies.sql`, run.
   - Repeat for 003 … 025.

## Option C: Run all via psql

With `DATABASE_URL` set to your project’s connection string (Settings → Database):

```bash
cd /Users/jinash/Desktop/repos/side_proj/hackymarket

for f in supabase/migrations/001_create_tables.sql \
         supabase/migrations/002_create_rls_policies.sql \
         supabase/migrations/003_create_functions.sql \
         supabase/migrations/004_add_notes_to_approved_codes.sql \
         supabase/migrations/005_allow_profile_reads.sql \
         supabase/migrations/006_fix_sell_rounding.sql \
         supabase/migrations/007_create_comments.sql \
         supabase/migrations/008_enable_realtime.sql \
         supabase/migrations/009_phone_verification.sql \
         supabase/migrations/010_allow_public_read_access.sql \
         supabase/migrations/011_get_market_trade_counts.sql \
         supabase/migrations/012_add_is_featured_to_markets.sql \
         supabase/migrations/013_auto_redeem_positions.sql \
         supabase/migrations/014_fix_sell_total_invested.sql \
         supabase/migrations/015_fix_total_invested_tracking.sql \
         supabase/migrations/016_enable_comments_realtime.sql \
         supabase/migrations/017_create_market_ideas.sql \
         supabase/migrations/018_restrict_phone_number_access.sql \
         supabase/migrations/019_secure_rpc_functions.sql \
         supabase/migrations/020_trade_rollback.sql \
         supabase/migrations/021_fix_rollback_total_invested.sql \
         supabase/migrations/022_fix_profile_update_and_admin_rpc.sql \
         supabase/migrations/023_lock_trade_functions_to_service_role.sql \
         supabase/migrations/024_oauth_profile_handling.sql \
         supabase/migrations/025_single_signin_onboarding.sql; do
  echo "Running $f"
  psql "$DATABASE_URL" -f "$f" || exit 1
done
echo "All migrations done."
```

Use the **Session mode** connection string (includes `?sslmode=require`) from Supabase → Settings → Database.
