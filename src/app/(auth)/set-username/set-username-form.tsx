"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetUsernameForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/set-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/");
        router.refresh();
        return;
      }

      setError(data.error || "Failed to save username");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "#FFBC0A" }}
        >
          Choose your username
        </h1>
        <p className="text-muted text-sm">
          This is how you’ll appear on the leaderboard and in comments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. trader_alice"
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent"
            required
            minLength={2}
            maxLength={30}
            autoFocus
          />
        </div>

        {error && <p className="text-no text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-accent hover:bg-accent-hover text-background font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </>
  );
}
