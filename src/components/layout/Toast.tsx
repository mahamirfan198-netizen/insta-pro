"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type ToastContextType = {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-200 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "px-5 py-3 rounded-2xl shadow-2xl font-medium text-sm animate-popIn pointer-events-auto " +
              (t.type === "success"
                ? "bg-linear-to-r from-green-500 to-emerald-500 text-white"
                : t.type === "error"
                ? "bg-linear-to-r from-red-500 to-pink-500 text-white"
                : "bg-gray-900 text-white dark:bg-white dark:text-gray-900")
            }
          >
            {t.type === "success" && "✓ "}
            {t.type === "error" && "✗ "}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}