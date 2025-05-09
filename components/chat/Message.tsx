import React from "react";
import ReactMarkdown from "react-markdown";
import SplitText from "../motion/SplitText";
import RadixAccordion from "../motion/Accordion";
import { AlertCircle, FileText, ExternalLink } from "lucide-react";

interface MessageProps {
  role: string;
  content: string;
  onPdfView?: (url: string) => void;
}

const Message: React.FC<MessageProps> = ({ role, content, onPdfView }) => {
  // Handle loading state specially
  if (role === "assistant" && content === "...") {
    return (
      <div className="w-full flex justify-start mb-6">
        <div className="w-full">
          <div className="bg-zinc-900/50 p-4 rounded-lg border-l-4 border-indigo-500/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-200"></div>
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
     content.includes("Rate limit"));

  // Check for PDF links in content
  const pdfLinks = content.match(/\[([^\]]+)\]\(([^)]+\.pdf)\)/g) || [];

  return (
    <div className={`w-full flex ${role === "user" ? "justify-end mb-4" : "justify-start mb-6"}`}>
      {role === "user" ? (
        // User message bubble
        <div className="max-w-[70%] bg-indigo-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
          {content}
        </div>
      ) : (
        // AI response container with improved styling
        <div className="w-full">
          <div className={`p-4 rounded-lg border-l-4 ${
            isErrorMessage 
              ? 'bg-red-900/20 border-red-500/50' 
              : 'bg-zinc-900/50 border-indigo-500/50 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300'
          }`}>
            {isErrorMessage && (
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Error</span>
              </div>
            )}
            
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 text-gray-300 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-300">{children}</li>,
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
                      className="text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
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
                  <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-200">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500/50 pl-4 italic text-gray-400 my-3 bg-zinc-900/30 py-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>

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
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-indigo-300 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                        >
                          <FileText size={12} />
                          {title}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            <RadixAccordion />
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;