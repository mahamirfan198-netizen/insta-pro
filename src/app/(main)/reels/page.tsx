"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  imageUrl: string;
  caption: string | null;
  author: { id: string; username: string; displayName: string };
  _count: { likes: number; comments: number };
};

export default function ReelsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, []);

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No reels yet</h2>
          <Link href="/create" className="text-purple-400 underline">
            Create your first reel
          </Link>
        </div>
      </div>
    );
  }

  const post = posts[current];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gradient" />
          <span className="font-bold">INSTA PRO</span>
        </Link>
        <Link href="/feed" className="text-sm text-purple-400">
          Back to feed
        </Link>
      </header>

      <div className="relative h-screen flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-9/16 bg-gray-900 rounded-2xl overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.caption || "Reel"}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-gradient" />
              <div>
                <Link
                  href={"/profile/" + post.author.username}
                  className="font-semibold"
                >
                  {post.author.displayName}
                </Link>
                <p className="text-xs text-white/70">@{post.author.username}</p>
              </div>
            </div>
            {post.caption && <p className="text-sm mb-3">{post.caption}</p>}
            <div className="flex items-center gap-4 text-sm">
              <span>❤️ {post._count.likes}</span>
              <span>💬 {post._count.comments}</span>
            </div>
          </div>

          <div className="absolute right-4 bottom-32 flex flex-col gap-4">
            <button className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-2xl">
              ❤️
            </button>
            <button className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-2xl">
              💬
            </button>
            <Link
              href={"/messages/" + post.author.username}
              className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-2xl"
            >
              📤
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-6 py-2 rounded-full bg-white/20 disabled:opacity-30"
        >
          ↑ Prev
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(posts.length - 1, c + 1))}
          disabled={current === posts.length - 1}
          className="px-6 py-2 rounded-full bg-white/20 disabled:opacity-30"
        >
          ↓ Next
        </button>
      </div>
    </div>
  );
}