import { useState } from "react";

const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700 flex">
      <input
        type="text"
        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="px-5 bg-blue-600 hover:bg-blue-500 transition rounded-r-lg text-white"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
