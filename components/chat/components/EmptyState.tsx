import {
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Search,
  FileText,
  Clock,
  ArrowDown,
} from "lucide-react";

interface EmptyStateProps {
  greeting: string;
  onStartResearch: (topic: string) => void;
}

export const EmptyState = ({ greeting, onStartResearch }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10">
      <div className="mb-8">
        <BrainCircuit size={64} className="text-blue-500 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold text-white mb-2">{greeting}, Researcher</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Your AI research assistant is ready to help with academic queries, paper searches, and literature reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => onStartResearch(
            "Find recent papers on neuroplasticity and memory formation"
          )}
        >
          <GraduationCap className="text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
          <h3 className="font-semibold text-lg mb-1">Research Literature</h3>
          <p className="text-gray-400 text-sm">Find recent papers on neuroplasticity</p>
        </div>
        <div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => onStartResearch(
            "Summarize current understanding of long COVID neurological symptoms"
          )}
        >
          <BookOpen className="text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
          <h3 className="font-semibold text-lg mb-1">Topic Summary</h3>
          <p className="text-gray-400 text-sm">Get an overview of long COVID neurological impacts</p>
        </div>
        <div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => onStartResearch(
            "Compare methods for fMRI data analysis in emotion studies"
          )}
        >
          <Search className="text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
          <h3 className="font-semibold text-lg mb-1">Method Comparison</h3>
          <p className="text-gray-400 text-sm">Compare fMRI analysis methods for emotion studies</p>
        </div>
        <div
          className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
          onClick={() => onStartResearch(
            "Help me design an experiment on working memory in children"
          )}
        >
          <FileText className="text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
          <h3 className="font-semibold text-lg mb-1">Experiment Design</h3>
          <p className="text-gray-400 text-sm">Get help designing an experiment on working memory</p>
        </div>
      </div>

      <div className="mt-8 w-full max-w-2xl">
        <div className="w-full bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="font-medium text-white mb-3 flex items-center">
            <Clock size={16} className="mr-2" /> Recent Updates
          </h3>
          <ul className="text-sm text-gray-400">
            <li className="mb-2 flex items-start">
              <ArrowDown size={14} className="mr-2 mt-1 text-green-400" />
              Added direct PDF viewing for open access papers
            </li>
            <li className="mb-2 flex items-start">
              <ArrowDown size={14} className="mr-2 mt-1 text-green-400" />
              New citation generator for APA, MLA, and Chicago styles
            </li>
            <li className="flex items-start">
              <ArrowDown size={14} className="mr-2 mt-1 text-green-400" />
              Export your research sessions as PDF or markdown
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 