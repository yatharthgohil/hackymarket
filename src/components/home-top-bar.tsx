import Link from "next/link";
import Image from "next/image";
import { formatCoins } from "@/lib/utils";
import NavLink from "@/components/nav-link";
import LogoutButton from "@/components/logout-button";
import CoinIcon from "@/components/coin-icon";

interface HomeTopBarProps {
  user: { id: string } | null;
  profile: { username: string; balance: number; is_admin?: boolean } | null;
}

export default function HomeTopBar({ user, profile }: HomeTopBarProps) {
  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/15">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/hackymarket_logo.svg"
              alt="HackyMarket"
              width={36}
              height={36}
              className="shrink-0"
            />
            <span className="font-extrabold text-xl sm:text-2xl font-[family-name:var(--font-gaegu)] text-accent-on-blue">HackyMarket</span>
          </Link>
          <div className="hidden lg:flex items-center gap-5 text-base font-bold">
            <NavLink href="/portfolio">Portfolio</NavLink>
            <NavLink href="/leaderboard">Leaderboard</NavLink>
            <Link href="/tv" className="bg-accent text-card-text font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wide hover:bg-accent-hover transition-colors">Live</Link>
            {profile?.is_admin && <NavLink href="/admin">Admin</NavLink>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && profile ? (
            <div className="text-sm flex items-center gap-1.5">
              <Link
                href="/portfolio"
                className="text-white/90 hover:text-white transition-colors"
              >
                {profile.username}
              </Link>
              <span className="text-accent-on-blue font-semibold">
                {formatCoins(profile.balance)} <CoinIcon />
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-accent-on-blue transition-colors"
            >
              Sign in
            </Link>
          )}
          <div className="lg:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-white/10 text-white">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </summary>
              <nav className="fixed right-2 top-[60px] bg-card border border-border/60 rounded-xl shadow-xl min-w-[180px] max-w-[calc(100vw-16px)] z-50 overflow-hidden text-card-text">
                <NavLink href="/portfolio" className="block px-4 py-3 hover:bg-gray-50 border-b border-border/30 text-card-text!">Portfolio</NavLink>
                <NavLink href="/leaderboard" className="block px-4 py-3 hover:bg-gray-50 border-b border-border/30 text-card-text!">Leaderboard</NavLink>
                {profile?.is_admin && <NavLink href="/admin" className="block px-4 py-3 hover:bg-gray-50 border-b border-border/30 text-card-text!">Admin</NavLink>}
                {user && <LogoutButton className="w-full text-left block px-4 py-3 hover:bg-gray-50 text-card-text" />}
              </nav>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
