"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Conversation = {
  partner: { id: string; username: string; displayName: string };
  lastMessage: string;
  lastMessageAt: string;
};

type User = {
  id: string;
  username: string;
  displayName: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        setConversations(d.conversations || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      const res = await fetch("/api/search?q=" + encodeURIComponent(query));
      const data = await res.json();
      setResults(data.users || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient" />
            <span className="font-bold text-lg">INSTA PRO</span>
          </Link>
          <Link href="/feed" className="text-sm text-purple-600">
            Back to feed
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users to message..."
          className="w-full px-4 py-3 rounded-xl border mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        {searching && <p className="text-sm text-gray-400 mb-4">Searching...</p>}

        {results.length > 0 && (
          <div className="mb-6 bg-white rounded-xl border overflow-hidden">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
              USERS
            </p>
            {results.map((u) => (
              <Link
                key={u.id}
                href={"/messages/" + u.username}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 border-t"
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

        {!query && (
          <>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">
              RECENT CONVERSATIONS
            </h2>

            {loading && <p className="text-gray-400">Loading...</p>}

            {!loading && conversations.length === 0 && (
              <p className="text-center text-gray-400 py-12">
                No conversations yet. Search above to start one!
              </p>
            )}

            {conversations.map((c) => (
              <Link
                key={c.partner.id}
                href={"/messages/" + c.partner.username}
                className="block p-4 mb-2 rounded-xl bg-white border hover:border-purple-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-gradient" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{c.partner.displayName}</p>
                    <p className="text-sm text-gray-500 truncate">{c.lastMessage}</p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </main>
    </div>
  );
}