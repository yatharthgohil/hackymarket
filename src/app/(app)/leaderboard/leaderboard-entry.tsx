'use client';

import { formatCoins } from '@/lib/utils';
import CoinIcon from '@/components/coin-icon';
import Link from 'next/link';
import { useState } from 'react';

interface Position {
  market_id: string;
  market_question: string;
  yes_shares: number;
  no_shares: number;
  market_probability: number;
}

interface LeaderboardEntryProps {
  rank: number;
  username: string;
  balance: number;
  portfolioValue: number;
  positions: Position[];
  isCurrentUser: boolean;
}

export function LeaderboardEntry({
  rank,
  username,
  balance,
  portfolioValue,
  positions,
  isCurrentUser,
}: LeaderboardEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankDisplay = () => {
    if (rank <= 3) {
      return (
        <span className="text-sm font-bold text-accent-on-blue">#{rank}</span>
      );
    }
    return <span className="text-sm text-white/60">#{rank}</span>;
  };

  const positionsValue = portfolioValue - balance;

  return (
    <div className={isCurrentUser ? 'bg-accent/5' : ''}>
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 py-4 px-2 text-left hover:bg-white/10 transition-colors border-b border-white/15"
      >
        {/* Rank */}
        <div className="w-8 shrink-0 text-center tabular-nums">{getRankDisplay()}</div>

        {/* Username */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${username}`}
              onClick={(e) => e.stopPropagation()}
              className="text-white font-medium truncate hover:text-accent-on-blue transition-colors"
            >
              {username}
            </Link>
            {isCurrentUser && (
              <span className="text-xs px-1.5 py-0.5 bg-accent/20 text-accent-on-blue rounded">
                You
              </span>
            )}
          </div>
        </div>

        {/* Portfolio breakdown */}
        <div className="shrink-0 text-right">
          <div className="font-bold text-accent-on-blue">{formatCoins(portfolioValue)} <CoinIcon /></div>
          <div className="text-xs text-white/60">
            <span>Bal: {formatCoins(balance)}</span>
            {' · '}
            <span>Pos: {formatCoins(positionsValue)}</span>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="shrink-0 w-5 text-white/60">
          <svg
            className={`w-4 h-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded positions */}
      {isExpanded && positions.length > 0 && (
        <div className="border-b border-white/15 px-2 py-3">
          <div className="text-xs text-white/60 mb-2">
            Positions ({positions.length} markets)
          </div>
          {positions.map((position) => {
            const yesValue = position.yes_shares * position.market_probability;
            const noValue =
              position.no_shares * (1 - position.market_probability);
            const totalValue = yesValue + noValue;

            return (
              <Link
                key={position.market_id}
                href={`/markets/${position.market_id}`}
                className="block py-2 px-2 hover:bg-white/10 transition-colors rounded"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {position.market_question}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {position.yes_shares > 0 && (
                        <span className="text-yes mr-3">
                          YES: {position.yes_shares.toFixed(2)} shares (
                          {formatCoins(yesValue)} <CoinIcon />)
                        </span>
                      )}
                      {position.no_shares > 0 && (
                        <span className="text-no-on-blue">
                          NO: {position.no_shares.toFixed(2)} shares (
                          {formatCoins(noValue)} <CoinIcon />)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-medium text-white">
                      {formatCoins(totalValue)} <CoinIcon />
                    </div>
                    <div className="text-xs text-white/60">
                      @{(position.market_probability * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isExpanded && positions.length === 0 && (
        <div className="border-b border-white/15 px-2 py-3 text-sm text-white/60">
          No active positions
        </div>
      )}
    </div>
  );
}
