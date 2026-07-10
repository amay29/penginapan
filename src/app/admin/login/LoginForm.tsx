"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (res?.error) setError("Invalid email or password. Please try again.");
    else { router.push("/admin"); router.refresh(); }
  };

  const inputClass =
    "w-full border-0 border-b border-obsidian-700 bg-transparent px-0 py-3 text-sm text-parchment-100 placeholder-obsidian-600 focus:border-parchment-300 focus:outline-none transition-colors duration-300";
  const labelClass = "block text-[9px] uppercase tracking-[0.25em] text-obsidian-500 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="border border-red-900 bg-red-950 px-4 py-3 text-xs text-red-400">{error}</p>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email" required type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          className={inputClass} placeholder="admin@damarglamping.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password" required type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClass} placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full border border-parchment-300 py-4 text-[10px] uppercase tracking-[0.3em] text-parchment-100 transition-colors duration-500 hover:bg-parchment-50 hover:text-obsidian-900 disabled:opacity-40"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
