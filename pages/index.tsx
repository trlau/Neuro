'use client'

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { 
  BrainCircuit, 
  Search, 
  BookOpen, 
  Quote, 
  ArrowRight, 
  Check, 
  Clock, 
  Sparkles,
  Shield, 
  BookMarked,
  Zap,
  FileText,
  Share2,
  BarChart,
  BrainCog,
  Library,
  Microscope,
  GitBranch,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Refs for sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      // Add offset for header height
      const headerOffset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const features = [
    { icon: Search, title: "Smart Search", description: "Find relevant academic papers with AI-powered semantic search" },
    { icon: BookOpen, title: "Paper Summaries", description: "Get concise summaries of research papers with key insights" },
    { icon: Quote, title: "Citation Tools", description: "Generate and manage citations in multiple formats" },
    { icon: Clock, title: "Time Saver", description: "Streamline your research process with automated workflows" },
    { icon: Shield, title: "Source Quality", description: "Access verified academic sources and peer-reviewed papers" },
    { icon: Share2, title: "Collaboration", description: "Share and discuss research findings with your team" }
  ];

  const stats = [
    { number: "100K+", label: "Papers Indexed" },
    { number: "1K+", label: "Early Users" },
    { number: "95%", label: "Accuracy" },
    { number: "24/7", label: "AI Support" }
  ];

  const useCases = [
    { icon: Library, title: "Literature Review", description: "Quickly analyze and synthesize research papers for your review" },
    { icon: Microscope, title: "Research Analysis", description: "Extract key findings and methodologies from papers" },
    { icon: GitBranch, title: "Citation Tracking", description: "Track paper citations and research evolution" },
    { icon: BrainCog, title: "Smart Reading", description: "AI-powered understanding of complex academic texts" }
  ];

  const workflow = [
    { icon: Search, title: "Discover", description: "Find relevant papers with semantic search" },
    { icon: FileText, title: "Analyze", description: "Get AI-powered summaries and insights" },
    { icon: BarChart, title: "Organize", description: "Manage citations and build your library" },
    { icon: Share2, title: "Collaborate", description: "Share findings with your research team" }
  ];

  return (
    <div ref={container} className="min-h-screen bg-black text-white font-space-grotesk">
      {/* Header */}
      <header className="w-screen fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit size={32} className="text-white" />
            <span className="text-xl font-semibold">Neuro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection(featuresRef)} className="text-gray-300 hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection(useCasesRef)} className="text-gray-300 hover:text-white transition-colors">Use Cases</button>
            <button onClick={() => scrollToSection(workflowRef)} className="text-gray-300 hover:text-white transition-colors">How It Works</button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push("/login")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Blob Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="w-screen relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black z-0" />
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BrainCircuit size={120} className="mx-auto mb-8 text-white animate-pulse" />
            <h1 className="text-7xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Research Made Simple
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered research assistant that helps you discover, analyze, and organize academic papers efficiently.
            </p>
            {mounted && (
              <Button
                onClick={() => router.push("/login")}
                className="bg-white hover:bg-gray-100 text-black text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Start Researching <ArrowRight className="ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-black/50 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors"
            >
              <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">{stat.number}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Research Tools</h2>
            <p className="text-xl text-gray-400">Everything you need to accelerate your research workflow</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-zinc-900/50 p-8 rounded-2xl hover:bg-zinc-800/50 transition-colors border border-white/10 hover:border-white/20 backdrop-blur-sm"
              >
                <feature.icon size={48} className="text-white mb-6" />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section ref={useCasesRef} className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Research Use Cases</h2>
            <p className="text-xl text-gray-400">Discover how Neuro can transform your research process</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-black/50 p-8 rounded-2xl border border-white/10 hover:border-white/20 backdrop-blur-sm transition-colors"
              >
                <useCase.icon size={48} className="text-white mb-6" />
                <h3 className="text-2xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-gray-400 text-lg">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section ref={workflowRef} className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple steps to transform your research process</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <step.icon size={48} className="mx-auto mb-6 text-white" />
                  {index < workflow.length - 1 && (
                    <ArrowRight className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-600" />
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl font-bold mb-6">Ready to transform your research?</h2>
            <p className="text-xl mb-8 text-gray-400">Join researchers using Neuro to work smarter</p>
            {mounted && (
              <Button
                onClick={() => router.push("/login")}
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Get Started Now <ArrowRight className="ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit size={32} className="text-white" />
                <span className="text-xl font-semibold">Neuro</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering researchers with AI-powered tools to accelerate their work and make breakthrough discoveries.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/trlau/Neuro#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <BookOpen size={24} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection(featuresRef)} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection(useCasesRef)} className="text-gray-400 hover:text-white transition-colors">Use Cases</button></li>
                <li><button onClick={() => scrollToSection(workflowRef)} className="text-gray-400 hover:text-white transition-colors">How It Works</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Neuro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
