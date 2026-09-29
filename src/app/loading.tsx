export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "rgb(var(--bg))" }}>
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-gradient shadow-glow animate-float mb-4" />
        <p className="text-sm font-medium opacity-60">Loading INSTA PRO...</p>
      </div>
    </div>
  );
}
