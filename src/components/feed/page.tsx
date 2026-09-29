"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  const [storyUrl, setStoryUrl] = useState("");

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

  async function createStory() {
    if (!storyUrl) return;
    await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: storyUrl }),
    });
    setStoryUrl("");
    setShowStoryForm(false);
    loadStories();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gradient shadow-glow" />
            <span className="font-bold text-lg">INSTA PRO</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="text-sm font-semibold text-white bg-brand-gradient px-4 py-2 rounded-lg shadow-glow"
            >
              + Create
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-sm text-purple-600 hover:underline">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
                <div style={{ background: "red", color: "white", padding: "20px", fontSize: "24px" }}>
          🚨 TEST MARKER — CODE IS RUNNING 🚨
        </div>
        <div className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setShowStoryForm(!showStoryForm)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center text-2xl text-purple-500">
                +
              </div>
              <span className="text-xs">Your story</span>
            </button>

            {stories.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-16 h-16 rounded-full p-0.5 bg-linear-to-tr from-purple-500 via-cyan-400 to-pink-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-xs truncate max-w-16">{s.author.username}</span>
              </div>
            ))}
          </div>

          {showStoryForm && (
            <div className="mt-3 p-3 border rounded-xl bg-white">
              <input
                type="url"
                value={storyUrl}
                onChange={(e) => setStoryUrl(e.target.value)}
                placeholder="Story image URL"
                className="w-full px-3 py-2 rounded-lg border text-sm"
              />
              <button
                onClick={createStory}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-gradient"
              >
                Post story
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
            <Link
              href="/create"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow mt-4"
            >
              Create your first post
            </Link>
          </div>
        )}

        {posts.map((post) => (
          <article
            key={post.id}
            className="mb-6 rounded-2xl border border-gray-200 bg-white overflow-hidden"
          >
            <header className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-brand-gradient" />
              <div className="flex-1">
                <Link
                  href={"/profile/" + post.author.username}
                  className="font-semibold text-sm hover:underline"
                >
                  {post.author.displayName}
                </Link>
                <p className="text-xs text-gray-500">
                  @{post.author.username}
                  {post.location ? " · " + post.location : ""}
                </p>
              </div>
            </header>

            <div className="bg-black">
              <img
                src={post.imageUrl}
                alt={post.caption || "Post"}
                className="w-full max-h-150 object-contain"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className="text-2xl hover:scale-110 transition"
                >
                  ❤️
                </button>
                <button
                  onClick={() => loadComments(post.id)}
                  className="text-2xl hover:scale-110 transition"
                >
                  💬
                </button>
              </div>

              <p className="text-sm font-semibold">{post._count.likes} likes</p>

              {post.caption && (
                <p className="text-sm">
                  <span className="font-semibold mr-2">{post.author.username}</span>
                  {post.caption}
                </p>
              )}

              <button
                onClick={() => loadComments(post.id)}
                className="text-sm text-gray-500"
              >
                View all {post._count.comments} comments
              </button>

              {openComments === post.id && (
                <div className="border-t pt-3 space-y-2">
                  {(comments[post.id] || []).map((c) => (
                    <div key={c.id} className="text-sm">
                      <span className="font-semibold mr-2">{c.author.username}</span>
                      {c.body}
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitComment(post.id);
                      }}
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-gradient"
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
    </div>
  );
}