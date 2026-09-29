"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  actor: { id: string; username: string; displayName: string };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.notifications || []);
        setLoading(false);
      });
  }, []);

  function iconFor(type: string) {
    if (type === "LIKE") return "❤️";
    if (type === "COMMENT") return "💬";
    if (type === "FOLLOW") return "👤";
    if (type === "FOLLOW_REQUEST") return "🔒";
    return "🔔";
  }

  function textFor(type: string) {
    if (type === "LIKE") return "liked your post";
    if (type === "COMMENT") return "commented on your post";
    if (type === "FOLLOW") return "started following you";
    if (type === "FOLLOW_REQUEST") return "requested to follow you";
    return "sent you a notification";
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 sticky top-0 bg-white z-40">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-bold text-lg">Notifications</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {loading && <p className="text-gray-400">Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            No notifications yet
          </p>
        )}

        {notifications.map((n) => (
          <Link
            key={n.id}
            href={"/profile/" + n.actor.username}
            className={
              "flex items-center gap-3 p-4 rounded-xl mb-2 " +
              (n.read ? "bg-white" : "bg-purple-50")
            }
          >
            <div className="w-12 h-12 rounded-full bg-brand-gradient shrink-0" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{n.actor.displayName}</span>{" "}
                {textFor(n.type)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">{iconFor(n.type)}</span>
          </Link>
        ))}
      </main>
    </div>
  );
}