import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatCoins } from "@/lib/utils";
import PortfolioTabs from "@/components/portfolio-tabs";
import type { PositionWithMarket, TradeWithMarket } from "@/lib/types";
import CoinIcon from "@/components/coin-icon";

export default async function PortfolioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, positionsResult, tradesResult, allTradesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single(),
    supabase
      .from("positions")
      .select("*, markets(question, probability, status, resolution)")
      .eq("user_id", user.id),
    supabase
      .from("trades")
      .select("*, markets(question, probability, status)")
      .eq("user_id", user.id)
      .eq("is_rolled_back", false)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("trades")
      .select("market_id, type, amount")
      .eq("user_id", user.id)
      .eq("is_rolled_back", false),
  ]);

  const balance = (profileResult.data as { balance: number } | null)?.balance ?? 0;
  const positions = (positionsResult.data ?? []) as PositionWithMarket[];
  const trades = (tradesResult.data ?? []) as TradeWithMarket[];
  const allTrades = (allTradesResult.data ?? []) as { market_id: string; type: "BUY" | "SELL"; amount: number }[];

  // Calculate portfolio value and P/L
  const positionsValue = positions.reduce((sum, pos) => {
    if (pos.markets.status === "active") {
      return (
        sum +
        pos.yes_shares * pos.markets.probability +
        pos.no_shares * (1 - pos.markets.probability)
      );
    }
    return sum;
  }, 0);

  // Calculate net investment per market from trade history (BUY = spent, SELL = received)
  const netInvestmentByMarket = new Map<string, number>();
  for (const trade of allTrades) {
    const current = netInvestmentByMarket.get(trade.market_id) ?? 0;
    if (trade.type === "BUY") {
      netInvestmentByMarket.set(trade.market_id, current + trade.amount);
    } else {
      netInvestmentByMarket.set(trade.market_id, current - trade.amount);
    }
  }

  // Calculate total invested only for active positions
  const totalInvested = positions.reduce((sum, pos) => {
    if (pos.markets.status === "active") {
      return sum + (netInvestmentByMarket.get(pos.market_id) ?? 0);
    }
    return sum;
  }, 0);

  const totalPnL = positionsValue - totalInvested;
  const totalValue = balance + positionsValue;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Portfolio</h1>
        <p className="text-sm text-white/70">
          Your positions, trade history, and balance overview.
        </p>
      </div>

      {/* Portfolio summary */}
      <div className="border-t border-white/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          <div className="py-4 px-2">
            <p className="text-xs text-white/60 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-accent-on-blue">
              {formatCoins(totalValue)} <span className="text-sm font-normal text-white/60"><CoinIcon /></span>
            </p>
          </div>
          <div className="py-4 px-4">
            <p className="text-xs text-white/60 mb-1">Bal</p>
            <p className="text-2xl font-bold text-white">
              {formatCoins(balance)} <span className="text-sm font-normal text-white/60"><CoinIcon /></span>
            </p>
          </div>
          <div className="py-4 px-4">
            <p className="text-xs text-white/60 mb-1">Pos</p>
            <p className="text-2xl font-bold text-white">
              {formatCoins(positionsValue)} <span className="text-sm font-normal text-white/60"><CoinIcon /></span>
            </p>
          </div>
          <div className="py-4 px-4">
            <p className="text-xs text-white/60 mb-1">Total P/L</p>
            <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-yes-on-blue' : 'text-no-on-blue'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCoins(totalPnL)} <span className="text-sm font-normal text-white/60"><CoinIcon /></span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-white/20 pt-6">
        <PortfolioTabs
          positions={positions}
          trades={trades}
          netInvestmentByMarket={netInvestmentByMarket}
        />
      </div>
    </div>
  );
}
