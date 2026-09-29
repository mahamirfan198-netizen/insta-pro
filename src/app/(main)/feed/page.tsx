"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/upload/ImageUpload";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [viewingStory, setViewingStory] = useState<any>(null);

  async function loadPosts() {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadStories() {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data.stories || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPosts();
    loadStories();
  }, []);

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="mb-6 soft-card p-4 animate-slideUp">
          <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center text-2xl text-purple-500 group-hover:border-purple-600 group-hover:scale-105 transition">
                +
              </div>
              <span className="text-xs font-medium">Your story</span>
            </button>

            {stories.map((s) => (
              <button
                key={s.id}
                onClick={() => setViewingStory(s)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="story-ring w-16 h-16 hover:scale-105 transition">
                <div className="min-h-screen">
                    <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-xs font-medium truncate max-w-16">
                  {s.author.username}
                </span>
              </button>
            ))}
          </div>

          {showStoryForm && (
          <div className="animate-popIn">
              <ImageUpload
                onUpload={(url) => {
                  if (url) {
                    fetch("/api/stories", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ imageUrl: url }),
                    }).then(() => {
                      setShowStoryForm(false);
                      loadStories();
                    });
                  }
                }}
                label="Upload story"
              />
            </div>
          )}
        </div>

        {loading && (
          <div className="soft-card p-12 text-center animate-fadeIn">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="soft-card p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-gradient shadow-glow mb-5 animate-float" />
            <h2 className="text-2xl font-bold mb-2">Welcome to INSTA PRO</h2>
            <p className="text-gray-500 mb-6">No posts yet — be the first to share!</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow"
            >
              Create your first post
            </Link>
          </div>
        )}

        {posts.map((post) => (
          <article
            key={post.id}
            className="mb-6 soft-card overflow-hidden animate-slideUp"
          >
            <header className="flex items-center gap-3 p-4">
              <Link
                href={"/profile/" + post.author.username}
                className="w-10 h-10 rounded-full bg-brand-gradient shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={"/profile/" + post.author.username}
                  className="font-semibold text-sm hover:underline block truncate"
                >
                  {post.author.displayName}
                </Link>
                <p className="text-xs text-gray-500 truncate">
                  @{post.author.username}
                  {post.location ? " · " + post.location : ""}
                </p>
              </div>
            </header>

            <div className="bg-black overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.caption || "Post"}
                className="w-full max-h-150 object-contain post-image"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    await fetch("/api/posts/" + post.id + "/like", { method: "POST" });
                    loadPosts();
                  }}
                  className="text-2xl hover:scale-125 transition"
                >
                  ❤️
                </button>
                <Link
                  href={"/messages/" + post.author.username}
                  className="text-2xl hover:scale-125 transition"
                >
                  📤
                </Link>
              </div>

              <p className="text-sm font-semibold">
                {post._count?.likes || 0} likes
              </p>

              {post.caption && (
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold mr-2">
                    {post.author.username}
                  </span>
                  {post.caption}
                </p>
              )}
            </div>
          </article>
        ))}
      </main>

      {viewingStory && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center animate-fadeIn"
          onClick={() => setViewingStory(null)}
        >
          <div className="relative max-w-md w-full px-4">
            <img
              src={viewingStory.imageUrl}
              alt=""
              className="w-full max-h-[90vh] object-contain rounded-3xl animate-popIn"
            />
            <div className="absolute top-4 left-6 flex items-center gap-2 text-white">
              <div className="w-10 h-10 rounded-full bg-brand-gradient" />
              <span className="font-semibold">{viewingStory.author.username}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
