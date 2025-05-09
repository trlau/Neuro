'use client'

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { BrainCircuit, BrainCircuitIcon } from "lucide-react";
import { motion, MotionValue, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react"
import SplitText from "../components/motion/SplitText";

const fadeInVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
}

export default function Home() {

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    console.log("Page scroll: ", latest)
  })

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <body>
      <div ref={container} className="relative scroll-smooth w-full h-[500vh]">
        {/* Section 1: Hero */}
        <HeroSection mounted={mounted} scrollYProgress={scrollYProgress}/>

        {/* Section 2: Problem */}
        <Section2 scrollYProgress={scrollYProgress}></Section2>


        {/* Section 3: Features */}
        <Section3 scrollYProgress={scrollYProgress}></Section3>


        {/* Section 4: How It Works */}
        <Section4 scrollYProgress={scrollYProgress}></Section4>

        {/* Section 5: CTA */}
        <Section5 scrollYProgress={scrollYProgress} mounted={mounted}></Section5>
      </div>
    </body>

  );
}

function HeroSection({ mounted, scrollYProgress }: { mounted: boolean, scrollYProgress : MotionValue<number> }) {

  const scale = useTransform(scrollYProgress, [0,0.25], [1, 0.5])
  const rotate = useTransform(scrollYProgress, [0,0.25], [0,-20])
  const router = useRouter();
  return (
    <motion.section style={{scale, rotate}} className="sticky top-0 h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
      <div className="space-y-6">
        <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, ease: "easeOut" }}>
          <BrainCircuit size={64} className="text-blue-500 mb-4 mx-auto" />
        </motion.span>
        <motion.h1 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ amount: "all" }} className="text-6xl font-extrabold tracking-tight">
          Neuro
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ amount: "all" }} transition={{ duration: 1 }} className="text-2xl text-gray-400 max-w-2xl mx-auto">
          Your AI-powered research assistant. <span className="text-green-400 font-semibold">Find papers</span>, <span className="text-green-400 font-semibold">summarize faster</span>, <span className="text-green-400 font-semibold">generate citations</span>.
        </motion.p>

        {mounted && (
          <Button
            onClick={() => router.push("/login")}
            className="text-lg mt-8 px-8 py-4"
          >
            Get Started
          </Button>
        )}
      </div>
    </motion.section>
  )
}

function Section2({scrollYProgress} : {scrollYProgress : MotionValue<number>}) {
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.25,0.5], [0.5, 1, 1, 0.5])
  const rotate = useTransform(scrollYProgress, [0,0.25, 0.25,0.5], [-20, 0, 0, -20])
  return (
    <motion.section style={{scale, rotate}} className="sticky top-0 h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl font-bold tracking-tight">Research is too slow</h2>
        <p className="text-lg text-gray-400">
          Digging through endless papers, manually citing references, and summarizing dense research wastes hours of your time. Neuro changes that.
        </p>
      </div>
    </motion.section>
  )
}

function Section3({scrollYProgress} : {scrollYProgress : MotionValue<number>}) {
  const scale = useTransform(scrollYProgress, [0.25, 0.5, 0.5,0.75], [0.5, 1, 1, 0.5])
  const rotate = useTransform(scrollYProgress, [0.25,0.5, 0.5,0.75], [-20, 0, 0, -20])
  return (
    <motion.section style={{scale, rotate}} className="sticky top-0 min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
      <div className="space-y-6 max-w-3xl">
        <h2 className="text-4xl font-bold tracking-tight">What you can do with Neuro</h2>
        <ul className="text-lg text-gray-400 space-y-4 list-disc list-inside text-left mx-auto">
          <li><span className="text-white font-semibold">Search</span> for academic papers by topic, question, or keyword</li>
          <li><span className="text-white font-semibold">Summarize</span> complex papers into digestible points</li>
          <li><span className="text-white font-semibold">Generate citations</span> in proper formats instantly</li>
          <li><span className="text-white font-semibold">Source</span> reliable references directly from academic journals</li>
        </ul>
      </div>
    </motion.section>
  )
}

function Section4({scrollYProgress} : {scrollYProgress : MotionValue<number>}) {
  const scale = useTransform(scrollYProgress, [0.5, 0.75, 0.75,1], [0.5, 1, 1, 0.5])
  const rotate = useTransform(scrollYProgress, [0.5,0.75, 0.75,1], [-20, 0, 0, -20])
  return (
    <motion.section style={{scale, rotate}} className="sticky top-0 min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white px-6 text-center">
      <div className="space-y-6 max-w-2xl">
        <h2 className="text-4xl font-bold tracking-tight">How it works</h2>
        <ol className="text-lg text-gray-400 space-y-4 list-decimal list-inside text-left mx-auto">
          <li>Submit a research question or keyword</li>
          <li>Neuro fetches and summarizes the top papers</li>
          <li>Copy citations, summaries, and reference links instantly</li>
        </ol>
      </div>
    </motion.section>
  )
}

function Section5({mounted, scrollYProgress} : {mounted : boolean, scrollYProgress: MotionValue<number>}) {
  const scale = useTransform(scrollYProgress, [0.75, 1], [0.5, 1])
  const rotate = useTransform(scrollYProgress, [0.75,1], [-20, 0])
  const router = useRouter();

  return (
  <motion.section style={{scale, rotate}} className="sticky top-0 min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center">
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
  </motion.section>)
}