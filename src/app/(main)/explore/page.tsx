"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: string;
  imageUrl: string;
  author: { username: string; displayName: string };
  _count: { likes: number; comments: number };
};

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 sticky top-0 bg-white z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient" />
            <span className="font-bold text-lg">INSTA PRO</span>
          </Link>
          <Link href="/feed" className="text-sm text-purple-600">
            Back to feed
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>

        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={"/feed"}
              className="relative aspect-square bg-gray-100 overflow-hidden"
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-full object-cover hover:opacity-90 transition"
              />
              <div className="absolute bottom-1 left-1 text-white text-xs">
                ❤️ {post._count.likes}
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-400 py-12">No posts to explore yet</p>
        )}
      </main>
    </div>
  );
}