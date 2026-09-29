"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { href: "/feed", label: "Home", icon: "🏠" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/explore", label: "Explore", icon: "🧭" },
  { href: "/reels", label: "Reels", icon: "🎬" },
  { href: "/messages", label: "Messages", icon: "💬" },
  { href: "/requests", label: "Requests", icon: "👥" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

export default function Sidebar({ username }: { username: string }) {
  const pathname = usePathname();

  return (
       <aside
      className="hidden md:flex flex-col w-60 fixed left-0 top-0 h-screen p-4 border-r"
            style={{
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(24px) saturate(1.8)",
        WebkitBackdropFilter: "blur(24px) saturate(1.8)",
        borderColor: "rgba(255, 255, 255, 0.3)",
      }}
    >
      {/* Logo */}
      <Link href="/feed" className="flex items-center gap-2 mb-8 px-2 group">
        <div className="w-9 h-9 rounded-xl bg-brand-gradient shadow-glow group-hover:scale-110 transition-transform" />
        <span className="font-bold text-lg title-gradient">
          INSTA PRO
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition transform hover:translate-x-1 " +
                (active
                  ? "bg-brand-gradient-soft text-purple-600 dark:text-purple-300 font-semibold"
                  : "hover:bg-black/3 dark:hover:bg-white/3")
              }
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-gradient" />
              )}
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <Link
          href={"/profile/" + username}
          className={
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition transform hover:translate-x-1 " +
            (pathname === "/profile/" + username
              ? "bg-brand-gradient-soft text-purple-600 dark:text-purple-300 font-semibold"
              : "hover:bg-black/3 dark:hover:bg-white/3")
          }
        >
          <span className="text-xl">👤</span>
          <span className="text-sm">Profile</span>
        </Link>

        <Link
          href="/settings"
          className={
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition transform hover:translate-x-1 " +
            (pathname === "/settings"
              ? "bg-brand-gradient-soft text-purple-600 dark:text-purple-300 font-semibold"
              : "hover:bg-black/3 dark:hover:bg-white/3")
          }
        >
          <span className="text-xl">⚙️</span>
          <span className="text-sm">Settings</span>
        </Link>

        <div className="pt-2 border-t mt-2" style={{ borderColor: "rgb(var(--border))" }}>
          <ThemeToggle />
        </div>
      </nav>

      <Link
        href={"/create"}
        className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white btn-primary"
      >
        ✨ Create
      </Link>
    </aside>
  );
}