import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatCoins } from "@/lib/utils";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import NavLink from "./nav-link";
import CoinIcon from "./coin-icon";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("username, balance, is_admin")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <nav className="bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/hackymarket_logo.svg"
              alt="HackyMarket"
              width={36}
              height={36}
              className="shrink-0"
            />
            <span className="font-bold text-base sm:text-lg font-[family-name:var(--font-gaegu)]" style={{ color: '#FFBC0A' }}>HackyMarket</span>
          </Link>
          {/* Desktop nav - hide on mobile */}
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
            <Link href="/tv" className="bg-accent/15 text-accent hover:bg-accent/25 font-medium px-2.5 py-0.5 rounded-full transition-colors">Live</Link>
            {profile?.is_admin && <NavLink href="/admin">Admin</NavLink>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && profile ? (
            <div className="text-sm">
              <Link
                href={`/profile/${encodeURIComponent(profile.username)}`}
                className="text-foreground hover:text-accent transition-colors mr-1"
              >
                {profile.username}
              </Link>
              <span className="text-accent font-medium">
                {formatCoins(profile.balance)} <CoinIcon />
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Sign in
            </Link>
          )}
          {/* Mobile nav - show only on mobile */}
          <div className="lg:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-border rounded hover:bg-card-hover">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </summary>
              <nav className="fixed right-2 top-[60px] bg-card border border-border rounded-lg shadow-lg min-w-[180px] max-w-[calc(100vw-16px)] z-50 overflow-hidden">
                <NavLink href="/portfolio" className="block px-4 py-3 hover:bg-card-hover border-b border-border">Portfolio</NavLink>
                <NavLink href="/leaderboard" className="block px-4 py-3 hover:bg-card-hover border-b border-border">Leaderboard</NavLink>
                {profile?.is_admin && <NavLink href="/admin" className="block px-4 py-3 hover:bg-card-hover border-b border-border">Admin</NavLink>}
                {user && <LogoutButton className="w-full text-left block px-4 py-3 hover:bg-card-hover text-foreground" />}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
