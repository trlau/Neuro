'use client'

import {
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Search,
  FileText,
  Clock,
  ArrowDown,
} from "lucide-react";
import SplitText from "../../motion/SplitText";
import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface EmptyStateProps {
  greeting: string;
  onStartResearch: (topic: string) => void;
}

const researchOptions = [
  {
    icon: GraduationCap,
    title: "Research Literature",
    description: "Find recent papers on neuroplasticity",
    query: "Find recent papers on neuroplasticity and memory formation"
  },
  {
    icon: BookOpen,
    title: "Topic Summary",
    description: "Get an overview of long COVID neurological impacts",
    query: "Summarize current understanding of long COVID neurological symptoms"
  },
  {
    icon: Search,
    title: "Method Comparison",
    description: "Compare fMRI analysis methods for emotion studies",
    query: "Compare methods for fMRI data analysis in emotion studies"
  },
  {
    icon: FileText,
    title: "Experiment Design",
    description: "Get help designing an experiment on working memory",
    query: "Help me design an experiment on working memory in children"
  }
];

// Animation variants for parent and children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const EmptyState = ({ greeting, onStartResearch }: EmptyStateProps) => {
  const [gridCols, setGridCols] = useState(2);
  const [maxRows, setMaxRows] = useState(2);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animatedOnce = useRef(false);

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth;
      const zoom = window.devicePixelRatio;
      if (width < 640 || zoom > 1.5) {
        setGridCols(1);
        setMaxRows(2);
      } else if (width < 1024 || zoom > 1.2) {
        setGridCols(2);
        setMaxRows(2);
      } else {
        setGridCols(2);
        setMaxRows(2);
      }
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  // Only show as many options as fit in the grid
  const visibleOptions = researchOptions.slice(0, gridCols * maxRows);

  // Only animate on first mount
  useEffect(() => {
    if (!animatedOnce.current) {
      setTimeout(() => {
        setHasAnimated(true);
        animatedOnce.current = true;
      }, 900); // slightly longer than the total animation duration
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
      <div className="mb-8">
        <motion.span 
          initial={{opacity:0, y: 30}} 
          animate={{opacity:1, y: 0}} 
          transition={{duration:2, ease: "easeOut"}}
        >
          <BrainCircuit size={64} className="text-indigo-500 mb-4 mx-auto" />
        </motion.span>
        <h1 className="text-2xl font-bold text-white mb-2">
          <SplitText>Hello, Researcher</SplitText>
        </h1>
        <h3 className="text-gray-400 max-w-md mx-auto">
          <SplitText>Your AI research assistant is ready to help with academic queries, paper searches, and literature reviews.</SplitText>
        </h3>
      </div>
      {hasAnimated ? (
        <div
          className={`grid gap-6 w-full max-w-2xl`}
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {visibleOptions.map((option) => (
            <div
              key={option.title}
              className="bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-center items-center h-full"
              onClick={() => onStartResearch(option.query)}
            >
              <option.icon className="text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors" size={40} />
              <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-indigo-100 transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors">
                {option.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className={`grid gap-6 w-full max-w-2xl`}
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {visibleOptions.map((option) => (
            <motion.div
              key={option.title}
              variants={itemVariants}
              className="bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-center items-center h-full"
              onClick={() => onStartResearch(option.query)}
            >
              <option.icon className="text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors" size={40} />
              <h3 className="font-semibold text-xl mb-2 text-white group-hover:text-indigo-100 transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-400 text-base group-hover:text-gray-300 transition-colors">
                {option.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}; 