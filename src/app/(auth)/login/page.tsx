"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Login failed" }));
      setError(data.error || "Login failed");
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: 3D + Branding */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <HeroScene />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-gradient shadow-glow" />
          <span className="font-bold text-2xl title-gradient">
            INSTA PRO
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-bold leading-tight">
            <span className="block">Capture.</span>
            <span className="block">Connect.</span>
            <span className="block title-gradient">Create.</span>
          </h1>
          <p className="mt-6 text-gray-600 max-w-sm text-lg">
            A premium social experience with real-time connection.
          </p>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-brand-gradient shadow-glow" />
            <span className="font-bold text-xl title-gradient">
              INSTA PRO
            </span>
          </div>

          <form onSubmit={handleSubmit} className="soft-card p-8 space-y-5 animate-scaleIn">
            <div>
              <h2 className="text-3xl font-bold mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500">
                Sign in to continue.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Username or email</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                style={{ borderColor: "rgb(var(--border))" }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                style={{ borderColor: "rgb(var(--border))" }}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-500/10 px-3 py-2 rounded-xl animate-popIn">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl font-semibold text-white btn-primary disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-sm text-center text-gray-500">
              New here?{" "}
              <Link
                href="/register"
                className="text-purple-600 font-semibold link-underline"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}