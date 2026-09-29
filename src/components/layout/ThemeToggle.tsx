"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(prefers);
      if (prefers) document.documentElement.classList.add("dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-xl">{dark ? "☀️" : "🌙"}</span>
      <span className="text-sm">{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}