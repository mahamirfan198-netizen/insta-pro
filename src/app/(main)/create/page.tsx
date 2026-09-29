"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/upload/ImageUpload";

export default function CreatePostPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      return setError("Please upload an image");
    }

    setBusy(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption, location }),
    });

    setBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Failed" }));
      return setError(data.error || "Failed to create post");
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/feed" className="text-sm text-purple-600">
            ← Cancel
          </Link>
          <h1 className="font-bold">New post</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-4">
        <ImageUpload
          onUpload={setImageUrl}
          label="Upload photo or video"
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          rows={3}
          maxLength={2200}
          className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Add location (optional)"
          className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        {error && (
          <div className="text-sm text-red-600 bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={busy || !imageUrl}
          className="w-full py-3 rounded-xl font-semibold text-white bg-brand-gradient shadow-glow disabled:opacity-60"
        >
          {busy ? "Publishing..." : "Share post"}
        </button>
      </main>
    </div>
  );
}
