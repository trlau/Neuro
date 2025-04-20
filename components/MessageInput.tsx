import React from "react";

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  input, 
  setInput, 
  sendMessage, 
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
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Processing..." : "Ask a research question..."}
          disabled={isLoading}
          className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`px-4 py-2 rounded ${
            isLoading || !input.trim() ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;