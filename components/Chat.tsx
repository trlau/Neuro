import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";

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
    setInput(""); // Clear input immediately
  
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
  
      if (!response.body) throw new Error("Readable stream not supported!");
  
      let assistantResponse = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantResponse]);
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let newMessage = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        newMessage += decoder.decode(value, { stream: true });
  
        // **Final Dynamic AI Response Formatting**
        let formattedMessage = newMessage
          .replace(/\n\s*\n/g, "\n\n") // Normalize line breaks
          .replace(/(\*\*)(.+?)(\*\*)/g, "\n$1$2$1\n") // Ensure bold headings are separated
          .replace(/(:)\s*\n\s*/g, "$1 ") // Prevent line breaks after colons
          .replace(/(###.*?)\n+/g, "\n\n---\n$1\n\n") // Ensure headings have separators before them
          .replace(/(\n- )/g, "\n\n- ") // Ensure bullet points have spacing
          .replace(/(\n\d+\.\s)/g, "\n\n$1") // Ensure numbered lists have spacing
          .replace(/^\s*[-•]\s*$/gm, "") // Remove stray bullet points
          .replace(/\n{3,}/g, "\n\n") // Prevent excessive blank lines
          .replace(/(\d+\.\s)(?=\d+\.)/g, "$1\n") // Fix numbering consistency (1. → 2.)
          .replace(/(Health Benefits|Nutritional Profile|Botanical Information):/g, "\n\n---\n**$1:**\n\n") // Ensure major section spacing with a line break
          .replace(/- (.+?):/g, "\n- **$1:**") // Ensure key points in bullets are bold
          .replace(/(\n\n)(?=-)/g, "\n") // Prevent excessive spacing before bullet points
          .replace(/(\n\n)(?=\d+\.)/g, "\n") // Prevent excessive spacing before numbered lists
          .trim();
  
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: formattedMessage,
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };  

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Neuro AI Chat</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-gray-500 text-center mt-10">Start a conversation...</p>}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <MessageInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
