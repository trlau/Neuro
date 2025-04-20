import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput(""); // Clear input immediately

    try {
      // Step 1: Get search keywords from user input
      const sourceResponse = await fetch("http://localhost:5000/api/source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
          model: "deepseek/deepseek-chat:free",
          content: userMessage
        }),
      });

      if (!sourceResponse.ok) {
        throw new Error("Failed to get search keywords");
      }

      const keywords = await sourceResponse.text();
      console.log("Search keywords:", keywords);
      
      // Step 2: Search for papers using the keywords
      const paperSearchResponse = await fetch(`http://localhost:5000/api/paper/search?query=${keywords}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!paperSearchResponse.ok) {
        throw new Error("Failed to search for papers");
      }

      const paperData = await paperSearchResponse.json();
      console.log("Paper search results:", paperData);
      
      // Show a temporary loading message
      setMessages((prev) => [...prev, { role: "assistant", content: "Researching..." }]);
      
      // Step 3: Format paper data to include in the AI prompt
      let enhancedInput = userMessage + "\n\n";
      
      if (paperData && paperData.length > 0) {
        enhancedInput += "Here are some relevant research papers that might help answer the question:\n\n";
        
        // Add up to 3 papers to the prompt
        const paperLimit = Math.min(paperData.length, 3);
        for (let i = 0; i < paperLimit; i++) {
          const paper = paperData[i];
          enhancedInput += `Paper ${i+1}: "${paper.Title || 'Untitled'}"\n`;
          if (paper.Abstract) {
            enhancedInput += `Abstract: ${paper.Abstract.substring(0, 200)}...\n`;
          }
          if (paper.Url) {
            enhancedInput += `URL: ${paper.Url}\n`;
          }
          enhancedInput += "\n";
        }
      }
      
      // Step 4: Send enhanced input to AI for generation
      const generateResponse = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Keep-Alive": "true",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          role: "user",
          model: "deepseek/deepseek-chat:free",
          content: enhancedInput
        }),
      });
    
      if (!generateResponse.body) throw new Error("Readable stream not supported!");
    
      // Replace the loading message with an empty message that will be filled
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "" };
        return updated;
      });
    
      const reader = generateResponse.body.getReader();
      const decoder = new TextDecoder();
      let newMessage = "";
    
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
    
        const chunk = decoder.decode(value, { stream: true });
        newMessage += chunk;
    
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
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: formattedMessage,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error in research process:", error);
      // Show error in chat
      setMessages((prev) => {
        const updated = [...prev];
        // Check if the last message is a loading message
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant" && 
            updated[updated.length - 1].content === "Researching...") {
          // Replace loading message with error
          updated[updated.length - 1] = {
            role: "assistant", 
            content: "I'm sorry, I encountered an error while researching. Please try again."
          };
        } else {
          // Add new error message
          updated.push({
            role: "assistant",
            content: "I'm sorry, I encountered an error while researching. Please try again."
          });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-semibold">Neuro AI Research Assistant</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-gray-500 text-center mt-10">Start a conversation with your research assistant...</p>}
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <MessageInput 
        input={input} 
        setInput={setInput} 
        sendMessage={sendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default Chat;