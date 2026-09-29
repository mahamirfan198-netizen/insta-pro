"use client";

import { useState } from "react";
import ImageUpload from "@/components/upload/ImageUpload";

type Me = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  website: string | null;
  gender: string | null;
  pronouns: string | null;
  musicUrl: string | null;
  notes: string | null;
  sleepMode: boolean;
  isPrivate: boolean;
};

type Props = {
  me: Me;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditProfileModal({ me, onClose, onSaved }: Props) {
  const [form, setForm] = useState(me);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b z-10">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">Cancel</button>
          <h2 className="font-bold text-lg">Edit profile</h2>
          <button onClick={save} disabled={saving} className="text-purple-600 font-semibold hover:text-purple-800 transition disabled:opacity-50">
            {saving ? "Saving..." : "Done"}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Cover photo</label>
            {form.coverUrl ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={form.coverUrl} alt="Cover" className="w-full h-40 object-cover" />
                <button
                  onClick={() => setForm({ ...form, coverUrl: null })}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <ImageUpload
                onUpload={(url) => setForm({ ...form, coverUrl: url })}
                label="Upload cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Profile photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-gradient shrink-0">
                {form.avatarUrl && (
                  <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <ImageUpload
                  onUpload={(url) => setForm({ ...form, avatarUrl: url })}
                  label="Change photo"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Display name</label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              maxLength={60}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            <input
              type="text"
              value={form.username}
              disabled
              className="w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              value={form.bio || ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              maxLength={200}
              placeholder="Tell people about yourself..."
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none transition"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {(form.bio || "").length}/200
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Pronouns</label>
              <select
                value={form.pronouns || ""}
                onChange={(e) => setForm({ ...form, pronouns: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Prefer not to say</option>
                <option value="she/her">She/Her</option>
                <option value="he/him">He/Him</option>
                <option value="they/them">They/Them</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Gender</label>
              <select
                value={form.gender || ""}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Website</label>
            <input
              type="url"
              value={form.website || ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yoursite.com"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">🎵 Profile music (link)</label>
            <input
              type="text"
              value={form.musicUrl || ""}
              onChange={(e) => setForm({ ...form, musicUrl: e.target.value })}
              placeholder="Song name or Spotify link"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">📝 Notes</label>
            <input
              type="text"
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              maxLength={60}
              placeholder="Short note (60 chars)"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-sm">🔔 Private account</p>
                <p className="text-xs text-gray-500">Only approved followers can see your content</p>
              </div>
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                className="w-6 h-6 accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-sm">🌍 Sleep mode</p>
                <p className="text-xs text-gray-500">Hide your activity and mute notifications</p>
              </div>
              <input
                type="checkbox"
                checked={form.sleepMode}
                onChange={(e) => setForm({ ...form, sleepMode: e.target.checked })}
                className="w-6 h-6 accent-purple-600"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
