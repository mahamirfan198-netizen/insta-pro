"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Request = {
  id: string;
  follower: { id: string; username: string; displayName: string };
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/follow-requests");
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(username: string, action: "accept" | "reject") {
    await fetch(`/api/users/${username}/follow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white p-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
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
        <h1 className="text-2xl font-bold mb-4">Follow requests</h1>

        {loading && <p className="text-gray-400">Loading...</p>}
        {!loading && requests.length === 0 && (
          <p className="text-gray-400 text-center py-12">No pending requests</p>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border mb-2"
          >
            <div className="w-12 h-12 rounded-full bg-brand-gradient" />
            <div className="flex-1">
              <Link
                href={`/profile/${req.follower.username}`}
                className="font-semibold hover:underline"
              >
                {req.follower.displayName}
              </Link>
              <p className="text-xs text-gray-500">@{req.follower.username}</p>
            </div>
            <button
              onClick={() => handleAction(req.follower.username, "accept")}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-gradient"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(req.follower.username, "reject")}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100"
            >
              Reject
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}