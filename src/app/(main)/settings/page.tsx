"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Me = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
};

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setMe(data.user);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!me) return;
    setSaving(true);
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: me.displayName,
        bio: me.bio,
        isPrivate: me.isPrivate,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!me) {
    return <div className="p-12 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/feed" className="text-sm text-purple-600">
            ← Back
          </Link>
          <h1 className="font-bold">Settings</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-brand-gradient" />
          <div>
            <p className="font-semibold">@{me.username}</p>
            <p className="text-sm text-gray-500">{me.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Display name</label>
          <input
            type="text"
            value={me.displayName}
            onChange={(e) => setMe({ ...me, displayName: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={me.bio || ""}
            onChange={(e) => setMe({ ...me, bio: e.target.value })}
            rows={3}
            maxLength={200}
            placeholder="Tell people about yourself"
            className="w-full px-4 py-2 rounded-xl border resize-none"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={me.isPrivate}
            onChange={(e) => setMe({ ...me, isPrivate: e.target.checked })}
            className="w-5 h-5 accent-purple-600"
          />
          <div>
            <p className="font-medium text-sm">Private account</p>
            <p className="text-xs text-gray-500">
              Only approved followers can see your posts
            </p>
          </div>
        </label>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow disabled:opacity-60"
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save changes"}
        </button>

        <button
          onClick={logout}
          className="w-full py-3 rounded-xl font-semibold text-red-600 bg-red-50 border border-red-200"
        >
          Logout
        </button>
      </main>
    </div>
  );
}