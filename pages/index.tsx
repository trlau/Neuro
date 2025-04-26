import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="scroll-smooth">
      {/* Section 1: Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">
            Neuro
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Your AI-powered research assistant. <span className="text-green-400 font-semibold">Find papers</span>, <span className="text-green-400 font-semibold">summarize faster</span>, <span className="text-green-400 font-semibold">generate citations</span>.
          </p>

          {mounted && (
            <Button
              onClick={() => router.push("/login")}
              className="text-lg mt-8 px-8 py-4"
            >
              Get Started
            </Button>
          )}
        </div>
      </section>

      {/* Section 2: Problem */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight">Research is too slow</h2>
          <p className="text-lg text-gray-400">
            Digging through endless papers, manually citing references, and summarizing dense research wastes hours of your time. Neuro changes that.
          </p>
        </div>
      </section>

      {/* Section 3: Features */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
        <div className="space-y-6 max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight">What you can do with Neuro</h2>
          <ul className="text-lg text-gray-400 space-y-4 list-disc list-inside text-left mx-auto">
            <li><span className="text-white font-semibold">Search</span> for academic papers by topic, question, or keyword</li>
            <li><span className="text-white font-semibold">Summarize</span> complex papers into digestible points</li>
            <li><span className="text-white font-semibold">Generate citations</span> in proper formats instantly</li>
            <li><span className="text-white font-semibold">Source</span> reliable references directly from academic journals</li>
          </ul>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight">How it works</h2>
          <ol className="text-lg text-gray-400 space-y-4 list-decimal list-inside text-left mx-auto">
            <li>Submit a research question or keyword</li>
            <li>Neuro fetches and summarizes the top papers</li>
            <li>Copy citations, summaries, and reference links instantly</li>
          </ol>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">Ready to speed up your research?</h2>
          {mounted && (
            <Button
              onClick={() => router.push("/login")}
              className="text-lg mt-6 px-8 py-4"
            >
              Get Started
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
