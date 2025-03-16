import React from "react";
import ReactMarkdown from "react-markdown";

interface MessageProps {
  role: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  return (
    <div className={`w-full flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      {role === "user" ? (
        // User message bubble
        <div className="max-w-[70%] bg-blue-500 text-white p-3 rounded-lg shadow-md">
          {content}
        </div>
      ) : (
        // AI response container (full width, properly spaced)
        <div className="w-full mt-3 px-4">
          <div className="bg-transparent p-4 border-l-4 border-gray-500/30">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 text-gray-300 leading-relaxed">{children}</p>, // Improve readability
                ul: ({ children }) => <ul className="list-disc list-inside space-y-3">{children}</ul>, // Better bullet spacing
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-3">{children}</ol>, // Better number list spacing
                li: ({ children }) => <li className="ml-5 text-gray-300">{children}</li>,
                h3: ({ children }) => <h3 className="mt-6 mb-3 text-lg font-semibold text-gray-200">{children}</h3>, // Properly spaced section titles
                hr: () => <hr className="my-5 border-gray-500/30" />, // Ensure `<hr>` is visible
                strong: ({ children }) => <strong className="text-white">{children}</strong>, // Fix bold rendering
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
