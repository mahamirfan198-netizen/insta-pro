"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

type Partner = { id: string; username: string; displayName: string };

export default function ConversationPage() {
  const params = useParams();
  const username = params.username as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [text, setText] = useState("");
  const [myId, setMyId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const res = await fetch("/api/messages?with=" + username);
    const data = await res.json();
    setMessages(data.messages || []);
    setPartner(data.partner);
  }

  useEffect(() => {
    // Get my own user ID
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMyId(d?.user?.id || null))
      .catch(() => {});

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverUsername: username, body: text }),
    });
    setText("");
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white p-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/messages" className="text-sm text-purple-600">
            ← Back
          </Link>
          <Link
            href={"/profile/" + username}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-full bg-brand-gradient" />
            <span className="font-semibold">
              {partner?.displayName || username}
            </span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">
            No messages yet. Say hi!
          </p>
        )}

        {messages.map((m) => {
          const isMine = myId && m.senderId === myId;
          return (
            <div
              key={m.id}
              className={"mb-2 flex " + (isMine ? "justify-end" : "justify-start")}
            >
              <div
                className={
                  "inline-block max-w-[70%] px-4 py-2 rounded-2xl " +
                  (isMine
                    ? "bg-brand-gradient text-white"
                    : "bg-white border")
                }
              >
                <p className="text-sm wrap-break-word">{m.body}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      <div className="border-t bg-white p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-300"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-brand-gradient"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}