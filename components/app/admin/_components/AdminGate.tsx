"use client";

import React, { useEffect, useState } from "react";

const PASSWORD = "coneiz@012";
const SESSION_KEY = "coneiz_admin_unlocked_v1";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored === "true") setUnlocked(true);
    } catch {
      // ignore
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password === PASSWORD) {
      setUnlocked(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore
      }
      return;
    }

    setError("Wrong password.");
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-2xl font-display font-medium text-brand-navy mb-8">Admin Access</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full bg-brand-navy text-white px-6 py-4 text-sm font-medium rounded-none"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
