import Link from "next/link";
import { formatCoins, formatShares, formatProbability, timeAgo } from "@/lib/utils";
import type { Trade } from "@/lib/types";
import CoinIcon from "@/components/coin-icon";

interface RecentTradesProps {
  trades: (Trade & {
    profiles?: { username: string };
    markets?: { question: string } | null;
  })[];
  compact?: boolean;
}

export default function RecentTrades({ trades, compact = false }: RecentTradesProps) {
  if (!trades || trades.length === 0) {
    if (compact) {
      return (
        <div className="py-4">
          <span className="text-xl font-extrabold text-white mb-3 inline-block">Recent Trades</span>
          <p className="text-sm text-white/70 font-medium">No trades yet.</p>
        </div>
      );
    }
    return (
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border/60">
        <h3 className="text-sm font-semibold text-card-text mb-3">Recent Trades</h3>
        <p className="text-sm text-card-muted">No trades yet.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="py-4">
        <span className="text-xl font-extrabold text-white mb-3 inline-block">Recent Trades</span>
        <div className="space-y-2">
          {trades.slice(0, 12).map((trade) => {
            const user = trade.profiles?.username ?? "Someone";
            const question = trade.markets?.question ?? "a market";
            const action = trade.type === "BUY" ? "bought" : trade.type === "REDEEM" ? "redeemed" : "sold";
            return (
              <div
                key={trade.id}
                className="text-sm py-1.5 border-b border-white/15 last:border-0 min-w-0"
              >
                <Link
                  href={`/profile/${user}`}
                  className="text-white hover:text-accent transition-colors font-medium"
                >
                  {user}
                </Link>
                <span className="text-white/80"> {action} </span>
                {trade.type === "REDEEM" ? (
                  <span className="text-accent-on-blue font-semibold">pairs</span>
                ) : (
                  <span className={trade.outcome === "YES" ? "text-yes-on-blue font-semibold" : "text-no-on-blue font-semibold"}>
                    {trade.outcome}
                  </span>
                )}
                <span className="text-white/80"> on </span>
                <Link
                  href={`/markets/${trade.market_id}`}
                  className="text-white font-medium hover:text-accent-on-blue transition-colors"
                >
                  {question}
                </Link>
                <span className="text-white/50"> · {formatCoins(trade.amount)} <CoinIcon /></span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border/60">
      <h3 className="text-sm font-semibold text-card-text mb-3">Recent Trades</h3>
      <div className="space-y-2">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between text-xs py-2 border-b border-border/30 last:border-0 gap-1 min-w-0"
          >
            <div className="flex items-center gap-1.5 min-w-0 shrink">
              <Link
                href={`/profile/${trade.profiles?.username ?? "User"}`}
                className="text-card-muted hover:text-accent transition-colors truncate"
              >
                {trade.profiles?.username ?? "User"}
              </Link>
              <span
                className={`font-medium whitespace-nowrap ${
                  trade.type === "BUY" ? "text-card-text" : trade.type === "REDEEM" ? "text-accent" : "text-card-muted"
                }`}
              >
                {trade.type === "BUY" ? "bought" : trade.type === "REDEEM" ? "redeemed" : "sold"}
              </span>
              {trade.type === "REDEEM" ? (
                <span className="text-accent whitespace-nowrap">pairs</span>
              ) : (
                <span
                  className={`whitespace-nowrap ${
                    trade.outcome === "YES" ? "text-yes" : "text-no"
                  }`}
                >
                  {trade.outcome}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-card-muted shrink-0">
              <span className="whitespace-nowrap inline-flex items-center gap-0.5">{formatCoins(trade.amount)} <CoinIcon /></span>
              <span className="whitespace-nowrap hidden sm:inline">{formatShares(trade.shares)} shares</span>
              <span className="whitespace-nowrap hidden md:inline">
                {formatProbability(trade.prob_before)} →{" "}
                {formatProbability(trade.prob_after)}
              </span>
              <span className="whitespace-nowrap hidden lg:inline">{timeAgo(trade.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
