"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return setError("Username: 3-30 chars, lowercase, numbers, . or _ only");
    }
    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setBusy(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, displayName }),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Signup failed" }));
      setError(data.error || "Signup failed");
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-gradient shadow-glow mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">It takes a minute.</p>
        </div>

        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
        />

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="Username (lowercase)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
        />

        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          required
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow disabled:opacity-60 hover:opacity-95 transition"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}