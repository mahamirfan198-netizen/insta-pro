"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ProfileData = {
  user: {
    id: string;
    username: string;
    displayName: string;
    bio: string | null;
    isPrivate: boolean;
  };
  posts: any[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  followStatus: string | null;
  isMe: boolean;
  canViewPosts: boolean;
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch(`/api/profile/${username}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [username]);

  async function followAction() {
    await fetch(`/api/users/${username}/follow`, { method: "POST" });
    load();
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-400">Loading...</div>;
  }

  if (!data || !data.user) {
    return <div className="p-12 text-center text-gray-400">User not found</div>;
  }

  const { user, posts, postsCount, followersCount, followingCount, isFollowing, followStatus, isMe, canViewPosts } = data;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4">
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
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-brand-gradient shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-xl font-bold">
                @{user.username}
                {user.isPrivate && <span className="text-xs text-gray-500 ml-2">🔒</span>}
              </h1>

              {isMe ? (
                <Link
                  href="/settings"
                  className="px-4 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold"
                >
                  Edit profile
                </Link>
              ) : (
                <button
                  onClick={followAction}
                  className={
                    isFollowing
                      ? "px-4 py-1.5 rounded-lg text-sm font-semibold bg-gray-100"
                      : followStatus === "PENDING"
                      ? "px-4 py-1.5 rounded-lg text-sm font-semibold bg-gray-200 text-gray-600"
                      : "px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-brand-gradient"
                  }
                >
                  {isFollowing ? "Following" : followStatus === "PENDING" ? "Requested" : "Follow"}
                </button>
              )}

              {!isMe && (
                <Link
                  href={`/messages/${user.username}`}
                  className="px-4 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold"
                >
                  Message
                </Link>
              )}
            </div>

            <div className="flex gap-6 text-sm">
              <span><strong>{postsCount}</strong> posts</span>
              <span><strong>{followersCount}</strong> followers</span>
              <span><strong>{followingCount}</strong> following</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold">{user.displayName}</p>
          {user.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}
        </div>

        {!canViewPosts ? (
          <div className="text-center py-12 border rounded-2xl bg-gray-50">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-bold text-lg">This account is private</h3>
            <p className="text-gray-500 text-sm mt-1">Follow to see their posts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square bg-black overflow-hidden">
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {posts.length === 0 && (
              <p className="col-span-3 text-center text-gray-400 py-12">No posts yet</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}