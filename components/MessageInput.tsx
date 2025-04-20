import React from "react";

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, sendMessage, isLoading = false }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      sendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Researching..." : "Ask a research question..."}
          disabled={isLoading}
          className="flex-grow p-2 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={`p-2 rounded-r ${isLoading || !input.trim() ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
        >
          {isLoading ? "Researching..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;