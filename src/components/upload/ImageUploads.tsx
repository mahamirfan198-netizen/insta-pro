"use client";

import { useState, useRef } from "react";

type Props = {
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
};

export default function ImageUpload({
  onUpload,
  label = "Upload image",
  accept = "image/*,video/*",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }

      onUpload(data.url);
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border">
          {preview.startsWith("data:video") ? (
            <video src={preview} className="w-full max-h-96" controls />
          ) : (
            <img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
          )}
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-black/70 text-white text-sm"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-12 rounded-2xl border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 transition"
        >
          {uploading ? "Uploading..." : "📷 " + label}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}