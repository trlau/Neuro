import { useState, useRef, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a test AI response." },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Neuro AI Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">Start a conversation...</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}>
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex">
        <input
          type="text"
          className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 bg-blue-600 hover:bg-blue-500 transition rounded-r-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
