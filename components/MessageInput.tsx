import React from "react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ input, setInput, sendMessage }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 flex">
      <textarea
        rows={1}
        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={sendMessage}
        className="ml-2 px-5 bg-blue-600 hover:bg-blue-500 transition rounded-lg text-white"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
