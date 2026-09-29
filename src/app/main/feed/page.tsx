"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/upload/ImageUpload";

type Comment = {
  id: string;
  body: string;
  author: { id: string; username: string; displayName: string };
};

type Post = {
  id: string;
  imageUrl: string;
  caption: string | null;
  location: string | null;
  createdAt: string;
  author: { id: string; username: string; displayName: string };
  _count: { likes: number; comments: number };
};

type Story = {
  id: string;
  imageUrl: string;
  author: { id: string; username: string; displayName: string };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [heartAnim, setHeartAnim] = useState<string | null>(null);

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

  async function toggleLike(postId: string) {
    setHeartAnim(postId);
    setTimeout(() => setHeartAnim(null), 400);
    await fetch("/api/posts/" + postId + "/like", { method: "POST" });
    loadPosts();
  }

  async function loadComments(postId: string) {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    const res = await fetch("/api/posts/" + postId + "/comments");
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
  }

  async function submitComment(postId: string) {
    if (!newComment.trim()) return;
    await fetch("/api/posts/" + postId + "/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newComment }),
    });
    setNewComment("");
    const res = await fetch("/api/posts/" + postId + "/comments");
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments || [] }));
    loadPosts();
  }

  return (
    <div className="min-h-screen">
      {/* Mobile-only header */}
      <header className="md:hidden sticky top-0 z-30 glass border-b border-white/40" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient shadow-glow" />
            <span className="font-bold text-lg title-gradient">INSTA PRO</span>
          </Link>
          <Link href="/notifications" className="text-2xl hover:scale-110 transition">
            🔔
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Stories Bar */}
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

            {stories.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setViewingStory(s)}
                className="flex flex-col items-center gap-1 shrink-0 animate-slideUp"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="story-ring w-16 h-16 hover:scale-105 transition">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src={s.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs font-medium truncate max-w-16">
                  {s.author.username}
                </span>
              </button>
            ))}
          </div>

          {showStoryForm && (
            <div className="mt-3 p-3 rounded-2xl bg-white/60 backdrop-blur-sm animate-popIn">
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

        {/* Skeleton Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="soft-card overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full skeleton" />
                  <div className="flex-1">
                    <div className="h-4 w-32 rounded skeleton mb-2" />
                    <div className="h-3 w-24 rounded skeleton" />
                  </div>
                </div>
                <div className="w-full aspect-square skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-20 rounded skeleton" />
                  <div className="h-4 w-48 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div className="soft-card p-12 text-center animate-scaleIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-gradient shadow-glow mb-5 animate-float" />
            <h2 className="text-2xl font-bold mb-2 title-gradient">
              Welcome to INSTA PRO
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No posts yet — be the first to share!
            </p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white btn-primary"
            >
              ✨ Create your first post
            </Link>
          </div>
        )}

        {/* Posts */}
        {posts.map((post, idx) => (
          <article
            key={post.id}
            className="mb-6 soft-card overflow-hidden animate-slideUp"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <header className="flex items-center gap-3 p-4">
              <Link
                href={"/profile/" + post.author.username}
                className="avatar-gradient shrink-0 hover:scale-105 transition"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#141420]" />
              </Link>
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
                  onClick={() => toggleLike(post.id)}
                  className={
                    "text-2xl hover:scale-125 transition " +
                    (heartAnim === post.id ? "heart-pop" : "")
                  }
                >
                  ❤️
                </button>
                <button
                  onClick={() => loadComments(post.id)}
                  className="text-2xl hover:scale-125 transition"
                >
                  💬
                </button>
                <Link
                  href={"/messages/" + post.author.username}
                  className="text-2xl hover:scale-125 transition"
                >
                  📤
                </Link>
              </div>

              <p className="text-sm font-semibold">
                {post._count.likes} {post._count.likes === 1 ? "like" : "likes"}
              </p>

              {post.caption && (
                <p className="text-sm leading-relaxed">
                  <Link
                    href={"/profile/" + post.author.username}
                    className="font-semibold mr-2 hover:underline"
                  >
                    {post.author.username}
                  </Link>
                  {post.caption}
                </p>
              )}

              <button
                onClick={() => loadComments(post.id)}
                className="text-sm text-gray-500 hover:text-purple-600 transition"
              >
                View all {post._count.comments} comments
              </button>

              {openComments === post.id && (
                <div className="border-t pt-3 space-y-2 animate-fadeIn" style={{ borderColor: "rgb(var(--border))" }}>
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="text-sm flex gap-2">
                      <Link
                        href={"/profile/" + c.author.username}
                        className="font-semibold hover:underline shrink-0"
                      >
                        {c.author.username}
                      </Link>
                      <span className="wrap-break-word">{c.body}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 transition bg-white/80 dark:bg-white/5"
                      style={{ borderColor: "rgb(var(--border))" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white btn-primary"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </main>

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div
          className="fixed inset-0 z-100 bg-black/90 backdrop-blur-lg flex items-center justify-center animate-fadeIn"
          onClick={() => setViewingStory(null)}
        >
          <div className="relative max-w-md w-full px-4">
            <div className="absolute top-4 left-6 right-6 flex items-center gap-2 text-white z-10 pointer-events-none">
              <div className="w-10 h-10 rounded-full avatar-gradient p-0.5">
                <div className="w-full h-full rounded-full bg-brand-gradient" />
              </div>
              <span className="font-semibold drop-shadow-lg">
                {viewingStory.author.username}
              </span>
            </div>
            <img
              src={viewingStory.imageUrl}
              alt=""
              className="w-full max-h-[90vh] object-contain rounded-3xl animate-popIn shadow-2xl"
            />
            <button
              onClick={() => setViewingStory(null)}
              className="absolute top-4 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white text-2xl flex items-center justify-center hover:bg-white/30 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}