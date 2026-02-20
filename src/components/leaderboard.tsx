import Link from "next/link";
import { formatCoins } from "@/lib/utils";
import CoinIcon from "@/components/coin-icon";

interface LeaderboardProps {
  leaders: { username: string; portfolio_value: number }[];
}

export default function Leaderboard({ leaders }: LeaderboardProps) {
  if (!leaders || leaders.length === 0) {
    return (
      <div>
        <Link href="/leaderboard" className="text-xl font-extrabold text-white hover:text-accent-on-blue transition-colors mb-3 inline-block">
          Leaderboard
        </Link>
        <p className="text-sm text-white/70">No users yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 bg-card shadow-sm border border-border/60" style={{ maxHeight: '500px' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-card-text">Leaderboard</h3>
        <Link href="/leaderboard" className="text-xs text-card-muted hover:text-accent transition-colors">
          View All →
        </Link>
      </div>

      <div className="flex items-center justify-between text-xs text-card-muted px-2 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className="w-5 shrink-0">#</span>
          <span>User</span>
        </div>
        <span>Total Value</span>
      </div>

      <div className="space-y-0.5 mt-1.5">
        {leaders.map((user, i) => (
          <Link
            key={user.username}
            href={`/profile/${user.username}`}
            className="flex items-center justify-between text-sm py-1.5 px-2 hover:bg-background/10 transition-colors rounded"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-card-muted text-xs w-5 shrink-0">{i + 1}</span>
              <span className="text-card-text hover:text-accent transition-colors truncate min-w-0" title={user.username}>
                {user.username}
              </span>
            </div>
            <span className="text-accent font-semibold shrink-0 ml-2">
              {formatCoins(user.portfolio_value)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
