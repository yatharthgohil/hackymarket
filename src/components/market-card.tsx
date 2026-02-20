"use client";

import Link from "next/link";
import { formatProbability, timeAgo, formatCoins } from "@/lib/utils";
import type { Market } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function MarketCard({
  market,
  traderCount,
  commentCount = 0,
}: {
  market: Market;
  traderCount?: number;
  commentCount?: number;
}) {
  const prob = market.probability;
  const probPercent = Math.round(prob * 100);
  const router = useRouter();

  const isResolved = market.status === "resolved";

  const handleYesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isResolved) router.push(`/markets/${market.id}?outcome=YES`);
  };

  const handleNoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isResolved) router.push(`/markets/${market.id}?outcome=NO`);
  };

  return (
    <Link href={`/markets/${market.id}`}>
      <div className={`bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border ${isResolved ? "border-border/40 opacity-75" : "border-border/60 hover:border-accent/40"}`}>
        <div className={`flex items-start justify-between gap-4 mb-5 ${isResolved ? "opacity-50" : ""}`}>
          <h3 className={`font-semibold text-base leading-snug flex-1 line-clamp-2 ${isResolved ? "text-card-muted" : "text-card-text"}`}>
            {market.question}
          </h3>

          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-border/30"></div>
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={isResolved ? "rgb(107, 114, 128)" : prob >= 0.5 ? "#8077C8" : "rgb(239, 68, 68)"}
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - prob)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className={`relative z-10 text-xl font-bold ${isResolved ? "text-card-muted" : "text-card-text"}`}>
                {probPercent}%
              </div>
            </div>
            <span className="text-xs text-card-muted mt-1">chance</span>
          </div>
        </div>

        <div className="flex gap-2.5 mb-3">
          {isResolved ? (
            <div className={`flex-1 rounded-lg py-3 text-center border ${
              market.resolution === "YES"
                ? "bg-yes/10 border-yes/30"
                : market.resolution === "NO"
                  ? "bg-no/10 border-no/30"
                  : "bg-gray-100 border-border/40"
            }`}>
              <span className="text-sm font-semibold uppercase tracking-wider text-card-muted">Resolved </span>
              <span className={`text-lg font-bold ${
                market.resolution === "YES"
                  ? "text-yes"
                  : market.resolution === "NO"
                    ? "text-no"
                    : "text-card-text"
              }`}>
                {market.resolution ?? "—"}
              </span>
            </div>
          ) : (
            <>
              <button
                onClick={handleYesClick}
                className="flex-1 bg-yes/10 hover:bg-yes/20 border border-yes/30 rounded-lg py-3 text-center transition-colors"
              >
                <span className="text-yes font-semibold">Buy Yes</span>
              </button>
              <button
                onClick={handleNoClick}
                className="flex-1 bg-no/10 hover:bg-no/20 border border-no/30 rounded-lg py-3 text-center transition-colors"
              >
                <span className="text-no font-semibold">Buy No</span>
              </button>
            </>
          )}
        </div>

        <div className={`flex items-center gap-2.5 text-xs text-card-muted truncate ${isResolved ? "opacity-50" : ""}`}>
          <span className="font-medium shrink-0">{formatCoins(market.volume)} Vol.</span>
          {traderCount != null && (
            <>
              <span className="shrink-0">·</span>
              <span className="shrink-0">{traderCount} {traderCount === 1 ? "trader" : "traders"}</span>
            </>
          )}
          <span className="shrink-0">·</span>
          <span className="shrink-0">{timeAgo(market.created_at)}</span>
          <span className="shrink-0">·</span>
          <span className="truncate">{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  );
}
