import { timeAgo } from "@/lib/utils";

interface RecentCommentsProps {
  comments: {
    id: string;
    content: string;
    created_at: string;
    market_id: string;
    profiles: { username: string };
    markets: { question: string };
  }[];
  isLoggedIn?: boolean;
}

export default function RecentComments({ comments, isLoggedIn }: RecentCommentsProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-card shadow-sm border border-border/60 flex-1 min-h-0">
        <h3 className="text-sm font-semibold text-card-text mb-3">Recent Chat</h3>
        <p className="text-sm text-card-muted">
          {isLoggedIn ? "No comments yet." : <><a href="/login" className="text-accent hover:underline">Sign in</a> to see comments.</>}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card shadow-sm border border-border/60 flex-1 min-h-0 flex flex-col overflow-hidden">
      <h3 className="text-sm font-semibold text-card-text px-4 pt-4 pb-2 shrink-0">Recent Chat</h3>
      <div className="overflow-y-auto flex-1 min-h-0 relative tv-trades-fade">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="px-4 py-1.5 hover:bg-background/5 transition-colors"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-card-muted truncate min-w-0 flex-1 mr-2">
                {comment.markets.question}
              </span>
              <span className="text-xs text-card-muted shrink-0">
                {timeAgo(comment.created_at)}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-sm text-card-text font-semibold shrink-0">
                {comment.profiles.username}
              </span>
              <span className="text-sm text-card-text/80 truncate min-w-0">
                {comment.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
