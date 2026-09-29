"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/feed", label: "Home", icon: "🏠" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/create", label: "Create", icon: "✨" },
  { href: "/reels", label: "Reels", icon: "🎬" },
  { href: "/messages", label: "Chats", icon: "💬" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t"
      style={{ borderColor: "rgb(var(--border))" }}
    >
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const active = pathname === item.href;
          const isCreate = item.href === "/create";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex flex-col items-center justify-center flex-1 h-full transition " +
                (active ? "text-purple-600 dark:text-purple-400" : "text-gray-500")
              }
            >
              {isCreate ? (
                <div className="w-11 h-11 rounded-2xl bg-brand-gradient shadow-glow flex items-center justify-center text-white text-xl -mt-4">
                  {item.icon}
                </div>
              ) : (
                <>
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}