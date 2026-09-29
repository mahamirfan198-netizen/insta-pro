"use client";

import { useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  displayName: string;
};

type Post = {
  id: string;
  imageUrl: string;
  caption: string | null;
  author: { username: string; displayName: string };
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searched, setSearched] = useState(false);

  async function search() {
    if (!q.trim()) return;
    const res = await fetch("/api/search?q=" + encodeURIComponent(q));
    const data = await res.json();
    setUsers(data.users || []);
    setPosts(data.posts || []);
    setSearched(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient" />
            <span className="font-bold">INSTA PRO</span>
          </Link>
          <Link href="/feed" className="text-sm text-purple-600">
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search users or posts..."
            className="flex-1 px-4 py-3 rounded-xl border"
          />
          <button
            onClick={search}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-brand-gradient"
          >
            Search
          </button>
        </div>

        {searched && users.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Users</h2>
            {users.map((u) => (
              <Link
                key={u.id}
                href={"/profile/" + u.username}
                className="flex items-center gap-3 p-3 bg-white rounded-xl mb-2 border"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gradient" />
                <div>
                  <p className="font-semibold text-sm">{u.displayName}</p>
                  <p className="text-xs text-gray-500">@{u.username}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {searched && posts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3">Posts</h2>
            <div className="grid grid-cols-3 gap-1">
              {posts.map((p) => (
                <div key={p.id} className="aspect-square bg-black rounded overflow-hidden">
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {searched && users.length === 0 && posts.length === 0 && (
          <p className="text-center text-gray-400 py-12">No results for "{q}"</p>
        )}
      </main>
    </div>
  );
}