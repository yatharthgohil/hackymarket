"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { timeAgo, formatShares } from "@/lib/utils";
import type { CommentWithProfile } from "@/lib/types";

interface MarketCommentsProps {
  marketId: string;
  comments: CommentWithProfile[];
  isAdmin: boolean;
  currentUserId?: string;
}

export default function MarketComments({
  marketId,
  comments,
  isAdmin,
  currentUserId,
}: MarketCommentsProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketId, content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post comment");
        setLoading(false);
        return;
      }
      setContent("");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } catch {
      // silent
    }
  }

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-card-text mb-3">Comments</h3>

      {currentUserId && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            maxLength={1000}
            rows={2}
            className="w-full px-3 py-2 bg-white border border-border/60 rounded-lg text-card-text text-sm placeholder:text-card-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
          />
          {error && <p className="text-no text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="mt-2 px-4 py-2 rounded-lg text-sm font-medium btn-accent disabled:opacity-50 disabled:transform-none disabled:shadow-none"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-card-muted">
          {currentUserId ? "No comments yet." : <><a href="/login" className="text-accent hover:underline">Sign in</a> to see comments.</>}
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-card-text font-medium">
                    {comment.profiles.username}
                  </span>
                  {comment.positions &&
                    comment.positions.yes_shares > 0 && (
                      <span className="text-yes">
                        {formatShares(comment.positions.yes_shares)} YES
                      </span>
                    )}
                  {comment.positions &&
                    comment.positions.no_shares > 0 && (
                      <span className="text-no">
                        {formatShares(comment.positions.no_shares)} NO
                      </span>
                    )}
                  <span className="text-card-muted">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-card-muted hover:text-no transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-sm text-card-text">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
