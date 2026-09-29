import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-gradient shadow-glow mb-8 animate-float" />

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
          <span className="title-gradient">INSTA</span>{" "}
          <span className="text-brand-gradient">PRO</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10">
          Capture. Connect. Create.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary">
            Get started
          </Link>
          <Link
            href="/login"
            className="btn-secondary"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          Welcome to your new social home ✨
        </p>
      </div>
    </main>
  );
}