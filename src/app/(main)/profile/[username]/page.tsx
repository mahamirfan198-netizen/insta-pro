"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [showAllPosts, setShowAllPosts] = useState(false);

  async function load() {
    const profileRes = await fetch("/api/profile/" + username);
    const profileJson = await profileRes.json();
    const meRes = await fetch("/api/auth/me");
    const meJson = await meRes.json();
    setData(profileJson);
    setMe(meJson.user);
    setLoading(false);
  }

  useEffect(() => { load(); }, [username]);

  async function followAction() {
    await fetch("/api/users/" + username + "/follow", { method: "POST" });
    load();
  }

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>;
  if (!data || !data.user) return <div className="p-12 text-center text-gray-400">User not found</div>;

  const { user, posts, postsCount, followersCount, followingCount, isFollowing, followStatus, isMe, canViewPosts } = data;
  const displayPosts = showAllPosts ? posts : posts.slice(0, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="relative h-40 md:h-56 bg-linear-to-br from-purple-500 via-pink-500 to-cyan-500 overflow-hidden md:rounded-b-3xl">
          {user.coverUrl && <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />}
        </div>

        <div className="px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 mb-4">
            <div className="relative">
              <div className="story-ring w-32 h-32">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-brand-gradient" />}
                </div>
              </div>
              {user.sleepMode && <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg shadow-lg">🌍</div>}
            </div>

            <div className="flex-1 md:pb-2">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                {user.displayName}
                {user.isVerified && <span className="text-cyan-500 text-lg">✓</span>}
              </h1>
              <p className="text-gray-500">@{user.username}</p>
              {user.pronouns && <p className="text-sm text-gray-400 mt-0.5">{user.pronouns}</p>}
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {isMe ? (
              <>
                <button onClick={() => setShowEdit(true)} className="flex-1 py-2.5 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 transition">Edit profile</button>
                <Link href="/settings" className="px-5 py-2.5 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 transition">♮️</Link>
              </>
            ) : (
              <>
                <button onClick={followAction} className={"flex-1 py-2.5 rounded-xl font-semibold transition " + (isFollowing ? "bg-gray-100 hover:bg-gray-200" : followStatus === "PENDING" ? "bg-gray-200 text-gray-600" : "text-white bg-brand-gradient shadow-glow hover:opacity-95")}>
                  {isFollowing ? "Following" : followStatus === "PENDING" ? "Requested" : "Follow"}
                </button>
                <Link href={"/messages/" + user.username} className="flex-1 py-2.5 rounded-xl font-semibold bg-gray-100 text-center hover:bg-gray-200 transition">Message</Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="card-hover bg-white rounded-2xl py-3 border"><p className="font-bold text-lg">{postsCount}</p><p className="text-xs text-gray-500">Posts</p></div>
            <div className="card-hover bg-white rounded-2xl py-3 border"><p className="font-bold text-lg">{followersCount}</p><p className="text-xs text-gray-500">Followers</p></div>
            <div className="card-hover bg-white rounded-2xl py-3 border"><p className="font-bold text-lg">{followingCount}</p><p className="text-xs text-gray-500">Following</p></div>
          </div>

          <div className="bg-white rounded-2xl border p-5 mb-6 space-y-3">
            {user.bio && <p className="text-sm whitespace-pre-line">{user.bio}</p>}
            {user.notes && <div className="flex items-start gap-2"><span className="text-lg">🟝</span><p className="text-sm text-gray-700">{user.notes}</p></div>}
            {user.musicUrl && <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50 border border-purple-100"><span className="text-lg">🎭</span><p className="text-sm text-purple-700 truncate flex-1">{user.musicUrl}</p></div>}
            {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-purple-600 link-underline">🔗 {user.website.replace(/^https?:\/\//, "")}</a>}
          </div>
        </div>

        <div className="px-6 md:px-8 pb-24 md:pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Posts</h2>
            {posts.length > 9 && <button onClick={() => setShowAllPosts(!showAllPosts)} className="text-sm text-purple-600 link-underline">{showAllPosts ? "Show less" : "Show all"}</button>}
          </div>
          {!canViewPosts ? (
            <div className="text-center py-16 border rounded-3xl bg-white">
              <div className="text-5xl mb-3">🔒</div>
              <h3 className="font-bold text-lg">This account is private</h3>
              <p className="text-gray-500 text-sm mt-1">Follow to see their posts</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {displayPosts.map((post: any) => (
                <div key={post.id} className="relative aspect-square bg-black overflow-hidden rounded-lg group cursor-pointer">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:opacity-80 group-hover:scale-105 transition duration-300" />
                </div>
              ))}
              {posts.length === 0 && <p className="col-span-3 text-center text-gray-400 py-16">No posts yet</p>}
            </div>
          )}
        </div>
      </div>

      {showEdit && me && <EditProfileModal me={me} onClose={() => setShowEdit(false)} onSaved={load} />}
    </div>
  );
}
