"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm border-2 border-[#3F3F46] p-8"
      >
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#A1A1AA]">
          Admin Access
        </span>
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-[#FAFAFA]">
          Enter Password
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="bg-transparent border-2 border-[#3F3F46] px-4 py-3 text-[#FAFAFA] placeholder-[#52525B] font-mono text-sm focus:outline-none focus:border-[#DFE104] transition-colors duration-200"
        />
        {error && (
          <span className="text-sm font-mono text-red-400">{error}</span>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="h-12 bg-[#DFE104] text-black text-sm font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform duration-200 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
