import React from "react";
import ReactMarkdown from "react-markdown";
import SplitText from "../motion/SplitText";
import RadixAccordion, { PaperType } from "../motion/Accordion";
import { MessageActions } from "./components/MessageActions";
import { AlertCircle, FileText, ExternalLink } from "lucide-react";

interface MessageProps {
  role: string;
  content: string;
  onPdfView?: (url: string) => void;
  papers?: PaperType[];
}

const Message: React.FC<MessageProps> = ({ role, content, onPdfView, papers }) => {
  // Handle loading state specially
  if (role === "assistant" && content === "...") {
    return (
      <div className="w-full flex justify-start mb-6">
        <div className="w-full">
          <div className="bg-zinc-900/50 p-4 rounded-lg border-l-4 border-white/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
              <span className="text-gray-400">Researching...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error messages should be styled differently
  const isErrorMessage = role === "assistant" && 
    (content.includes("Connection error") || 
     content.includes("CORS error") || 
     content.includes("Rate limit") ||
     content.includes("I'm sorry, I encountered an error") ||
     content.includes("offline") ||
     content.toLowerCase().includes("error"));

  // Check for PDF links in content
  const pdfLinks = content.match(/\[([^\]]+)\]\(([^)]+\.pdf)\)/g) || [];

  return (
    <div className={`w-full flex ${role === "user" ? "justify-end mb-8" : "justify-center mb-8"}`}>
      {role === "user" ? (
        // User message bubble
        <div className="relative max-w-[70%] bg-zinc-800 text-white p-4 rounded-xl border border-black shadow-md hover:shadow-lg hover:shadow-black/20 transition-all duration-300">
          <span className="absolute -top-3 right-4 bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm select-none">You</span>
          {content}
        </div>
      ) : (
        // AI response container with improved styling
        <div className="w-full">
          <div className={`relative p-6 rounded-2xl mb-2 flex flex-col gap-2 transition-all duration-300 " +
            (isErrorMessage
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-zinc-800/80 shadow-xl border border-white/10')
          }`}>
            {/* AI chip */}
            <span className={`absolute -top-3 left-4 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm select-none ${isErrorMessage ? 'bg-white text-red-600 border border-red-600' : 'bg-white text-black'}`}>AI</span>
            {isErrorMessage && (
              <div className="flex items-center gap-2 mb-3 text-white">
                <AlertCircle size={18} className="text-white" />
                <span className="text-base font-semibold">Error</span>
              </div>
            )}
            <div className={isErrorMessage ? 'text-white font-medium text-base' : ''}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3 text-white leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2 text-white">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-2 text-white">{children}</ol>,
                  li: ({ children }) => <li className="text-white">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold my-4 text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold my-3 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-md font-semibold my-3 text-gray-200">{children}</h3>,
                  h4: ({ children }) => <h4 className="font-semibold my-2 text-gray-200">{children}</h4>,
                  hr: () => <hr className="my-4 border-zinc-700" />,
                  strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                  a: ({ href, children }) => {
                    const isPdf = href?.toLowerCase().endsWith('.pdf');
                    return (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white hover:text-gray-200 hover:underline inline-flex items-center gap-1"
                        onClick={(e) => {
                          if (isPdf && onPdfView && href) {
                            e.preventDefault();
                            onPdfView(href);
                          }
                        }}
                      >
                        {children}
                        {isPdf ? <FileText size={14} /> : <ExternalLink size={14} />}
                      </a>
                    );
                  },
                  code: ({ children }) => (
                    <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono text-white">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-white/50 pl-4 italic text-gray-400 my-3 bg-zinc-900/30 py-2">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {pdfLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FileText size={14} />
                  Available Papers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {pdfLinks.map((link, index) => {
                    const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (match) {
                      const [_, title, url] = match;
                      return (
                        <button
                          key={index}
                          onClick={() => onPdfView?.(url)}
                          className="px-5 py-2 rounded-full bg-black border border-white text-white font-semibold shadow-sm hover:bg-white hover:text-black hover:shadow-lg transition-all"
                        >
                          {title}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {papers && papers.length > 0 && (
              <RadixAccordion papers={papers} />
            )}
          </div>
          <MessageActions content={content}></MessageActions>
        </div>
      )}
    </div>
  );
};

export default Message;