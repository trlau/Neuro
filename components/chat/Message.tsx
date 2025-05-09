import React from "react";
import ReactMarkdown from "react-markdown";
import SplitText from "../motion/SplitText";
import RadixAccordion from "../motion/Accordion";

interface MessageProps {
  role: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  // Handle loading state specially
  if (role === "assistant" && content === "...") {
    return (
      <div className="w-full flex justify-start mb-6">
        <div className="w-full">
          <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-blue-500/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
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

  return (
    <div className={`w-full flex ${role === "user" ? "justify-end mb-4" : "justify-start mb-6"}`}>
      {role === "user" ? (
        // User message bubble
        <div className="max-w-[70%] bg-blue-500 text-white p-3 rounded-lg shadow-md">
          {content}
        </div>
      ) : (
        // AI response container with improved styling
        <div className="w-full">
          <div className={`p-4 rounded-lg border-l-4 ${
            isErrorMessage ? 'bg-red-900/20 border-red-500/50' : 'bg-black/40 border-white/50 backdrop-blur-sm shadow-xl'
          }`}>
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
                hr: () => <hr className="my-4 border-gray-700" />,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-3">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
              
            </ReactMarkdown>
            <RadixAccordion></RadixAccordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;