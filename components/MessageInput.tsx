import React from "react";

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  sendDirectMessage?: () => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  input, 
  setInput, 
  sendMessage, 
  sendDirectMessage, 
  isLoading = false 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      sendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Processing..." : "Ask a research question..."}
          disabled={isLoading}
          className="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`flex-1 p-2 rounded ${
              isLoading || !input.trim() ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {isLoading ? "Processing..." : "Research"}
          </button>
          
          {sendDirectMessage && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading && input.trim()) {
                  sendDirectMessage();
                }
              }}
              disabled={isLoading || !input.trim()}
              className={`flex-1 p-2 rounded ${
                isLoading || !input.trim() ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
              } text-white transition-colors`}
            >
              Direct
            </button>
          )}
        </div>
        
        {/* Debugging info */}
        <div className="text-xs text-gray-500 mt-1">
          If you see connection errors, make sure the API server is running at http://localhost:5000
        </div>
      </div>
    </form>
  );
};

export default MessageInput;