"use client";

import { useState } from "react";
import Link from "next/link";
import {
  formatProbability,
  formatShares,
  formatCoins,
  timeAgo,
} from "@/lib/utils";
import type { PositionWithMarket, TradeWithMarket } from "@/lib/types";
import CoinIcon from "@/components/coin-icon";

interface PortfolioTabsProps {
  positions: PositionWithMarket[];
  trades: TradeWithMarket[];
  netInvestmentByMarket?: Map<string, number>;
}

export default function PortfolioTabs({
  positions,
  trades,
  netInvestmentByMarket = new Map(),
}: PortfolioTabsProps) {
  const [tab, setTab] = useState<"positions" | "trades">("positions");

  const activePositions = positions.filter(
    (p) => p.yes_shares > 0 || p.no_shares > 0
  );

  return (
    <div>
      {/* Tab toggle */}
      <div className="flex gap-4 mb-4 border-b border-white/20">
        <button
          onClick={() => setTab("positions")}
          className={`pb-2 text-sm font-medium transition-colors ${
            tab === "positions"
              ? "text-white border-b-2 border-accent"
              : "text-white/60 hover:text-white"
          }`}
        >
          Positions ({activePositions.length})
        </button>
        <button
          onClick={() => setTab("trades")}
          className={`pb-2 text-sm font-medium transition-colors ${
            tab === "trades"
              ? "text-white border-b-2 border-accent"
              : "text-white/60 hover:text-white"
          }`}
        >
          Trades ({trades.length})
        </button>
      </div>

      {/* Positions tab */}
      {tab === "positions" && (
        <div>
          {activePositions.length === 0 && (
            <p className="text-white/60 text-sm py-4">
              No positions yet. Start trading on a market!
            </p>
          )}
          {activePositions.map((pos) => {
            const currentValue =
              pos.markets.status === "active"
                ? pos.yes_shares * pos.markets.probability +
                  pos.no_shares * (1 - pos.markets.probability)
                : 0;
            const netInvested = netInvestmentByMarket.get(pos.market_id) ?? pos.total_invested;
            const pnl = currentValue - netInvested;

            return (
              <Link key={pos.id} href={`/markets/${pos.market_id}`} className="block">
                <div className="border-b border-white/15 py-4 px-2 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <p className="text-sm font-medium text-white mb-1">
                        {pos.markets.question}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        {pos.yes_shares > 0 && (
                          <span className="text-yes-on-blue">
                            {formatShares(pos.yes_shares)} YES
                          </span>
                        )}
                        {pos.no_shares > 0 && (
                          <span className="text-no-on-blue">
                            {formatShares(pos.no_shares)} NO
                          </span>
                        )}
                        <span>
                          Invested: {formatCoins(netInvested)} <CoinIcon />
                        </span>
                        {pos.markets.status === "resolved" && (
                          <span className="px-1.5 py-0.5 bg-white/10 text-white/80">
                            Resolved {pos.markets.resolution}
                          </span>
                        )}
                      </div>
                    </div>
                    {pos.markets.status === "active" && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {formatCoins(currentValue)} <CoinIcon />
                        </p>
                        <p
                          className={`text-xs ${
                            pnl >= 0 ? "text-yes-on-blue" : "text-no-on-blue"
                          }`}
                        >
                          {pnl >= 0 ? "+" : ""}
                          {formatCoins(pnl)} <CoinIcon />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Trades tab */}
      {tab === "trades" && (
        <div>
          {trades.length === 0 && (
            <p className="text-white/60 text-sm py-4">No trades yet.</p>
          )}
          {trades.map((trade) => (
            <Link key={trade.id} href={`/markets/${trade.market_id}`} className="block">
              <div className="flex items-center justify-between py-3 px-2 border-b border-white/15 hover:bg-white/5 transition-colors text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      trade.type === "BUY"
                        ? "bg-yes/20 text-yes-on-blue"
                        : trade.type === "REDEEM"
                        ? "bg-accent/20 text-accent-on-blue"
                        : "bg-no/20 text-no-on-blue"
                    }`}
                  >
                    {trade.type}
                  </span>
                  {trade.type === "REDEEM" ? (
                    <span className="text-accent-on-blue">pairs</span>
                  ) : (
                    <span
                      className={
                        trade.outcome === "YES" ? "text-yes-on-blue" : "text-no-on-blue"
                      }
                    >
                      {trade.outcome}
                    </span>
                  )}
                  <span className="text-white/70 truncate max-w-xs">
                    {trade.markets.question}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60 shrink-0">
                  <span>{formatCoins(trade.amount)} <CoinIcon /></span>
                  <span>{formatShares(trade.shares)} shares</span>
                  <span>
                    {formatProbability(trade.prob_before)} →{" "}
                    {formatProbability(trade.prob_after)}
                  </span>
                  <span>{timeAgo(trade.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
