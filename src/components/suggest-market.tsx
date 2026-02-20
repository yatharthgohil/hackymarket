"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SuggestMarketProps {
  isLoggedIn: boolean;
}

export default function SuggestMarket({ isLoggedIn }: SuggestMarketProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/market-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to submit idea");
        setIsError(true);
        return;
      }

      setMessage("Idea submitted! Admins will review it.");
      setIsError(false);
      setQuestion("");
    } catch {
      setMessage("Something went wrong");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl p-4 bg-card shadow-sm border border-border/60">
      <h3 className="text-sm font-semibold text-card-text mb-3">
        Suggest a Market
      </h3>

      {message && (
        <p className={`text-sm mb-3 ${isError ? "text-no" : "text-yes"}`}>
          {message}
        </p>
      )}

      {!isLoggedIn ? (
        <p className="text-sm text-card-muted">
          <a href="/login" className="text-accent hover:underline">Sign in</a> to suggest a market idea.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Will X happen by Y date?"
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-border/60 rounded-lg
                         text-card-text text-sm placeholder:text-card-muted/60
                         focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
            />
            <span className="text-xs text-card-muted mt-1 block text-right">
              {question.length}/500
            </span>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 rounded-lg text-sm btn-accent disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
