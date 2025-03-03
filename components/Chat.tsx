import { useState, useRef, useEffect } from "react";


const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    setMessages((prev) => [...prev, { role: "user", content: input }]);
  
    const requestBody = JSON.stringify({
      role: "user",
      model: "deepseek/deepseek-chat:free",
      content: input
    });
  
    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Keep-Alive": "true",
          "Accept": "text/event-stream",
        },
        body: requestBody,
      });
  
      if (!response.body) {
        throw new Error("Readable stream not supported!");
      }
  
      let assistantResponse = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantResponse]);
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let newMessage = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        // Decode and process streamed text
        const chunk = decoder.decode(value, { stream: true });
        newMessage += chunk;
  
        // Update the last assistant message dynamically
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: newMessage,
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  
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
