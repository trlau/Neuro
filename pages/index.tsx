import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // mount component
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white px-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl font-bold tracking-tight">Welcome to Neuro</h1>
        <p className="mt-4 text-lg text-gray-400">
          Your AI-powered research assistant. Generate citations, summarize papers, and enhance your workflow—all in one place.
        </p>

        <div className="mt-8">
          {mounted && (
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-500 transition-all rounded-lg shadow-lg"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
