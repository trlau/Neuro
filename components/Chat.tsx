import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";

const Chat = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000", {
          mode: "cors", // Add CORS mode explicitly
          headers: {
            "Accept": "application/json"
          }
        });
        
        if (response.ok) {
          console.log("API connection successful");
          setApiStatus("connected");
        } else {
          console.error("API returned error:", response.status);
          setApiStatus("error");
        }
      } catch (error) {
        console.error("API connection failed:", error);
        setApiStatus("error");
      }
    };
    
    checkApiConnection();
  }, []);

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
      console.log("Sending request to /api/source...");
      const sourceResponse = await fetch("http://localhost:5000/api/source", {
        method: "POST",
        mode: "cors", // Add CORS mode explicitly
        credentials: "omit", // Don't send cookies
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          role: "user",
          model: "deepseek/deepseek-chat:free",
          content: userMessage
        }),
      });

      if (!sourceResponse.ok) {
        console.error("Source API error:", sourceResponse.status, sourceResponse.statusText);
        throw new Error(`Failed to get search keywords: ${sourceResponse.status}`);
      }

      const keywords = await sourceResponse.text();
      console.log("Search keywords:", keywords);
      
      // Step 2: Search for papers using the keywords
      console.log("Sending request to /api/paper/search...");
      const paperSearchResponse = await fetch(`http://localhost:5000/api/paper/search?query=${keywords}`, {
        method: "GET",
        mode: "cors", // Add CORS mode explicitly
        credentials: "omit", // Don't send cookies
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!paperSearchResponse.ok) {
        console.error("Paper search API error:", paperSearchResponse.status);
        throw new Error(`Failed to search for papers: ${paperSearchResponse.status}`);
      }

      const paperData = await paperSearchResponse.json();
      console.log("Paper search results:", paperData);
      
      // Show a temporary loading message
      setMessages((prev) => [...prev, { role: "assistant", content: "Researching..." }]);
      
      // Step.3: Format paper data to include in the AI prompt
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
      console.log("Sending request to /api/generate...");
      const generateResponse = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        mode: "cors", // Add CORS mode explicitly
        credentials: "omit", // Don't send cookies
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          role: "user",
          model: "deepseek/deepseek-chat:free",
          content: enhancedInput
        }),
      });
    
      if (!generateResponse.body) throw new Error("Readable stream not supported!");
      
      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error("Generate API error:", generateResponse.status, errorText);
        throw new Error(`Failed to generate response: ${generateResponse.status}`);
      }
    
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
    
        // **Dynamic AI Response Formatting**
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
      
      // Show more specific error in chat
      let errorMessage = "I'm sorry, I encountered an error while researching. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
          errorMessage = "Connection error: Unable to reach the API server. Please check that the backend is running at http://localhost:5000.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "CORS error: The API server is not accepting requests from this origin. This is a configuration issue with the API.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit reached: The semantic scholar API has temporarily limited requests. Please wait a moment and try again.";
        }
      }
      
      setMessages((prev) => {
        const updated = [...prev];
        // Check if the last message is a loading message
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant" && 
            updated[updated.length - 1].content === "Researching...") {
          // Replace loading message with error
          updated[updated.length - 1] = {
            role: "assistant", 
            content: errorMessage
          };
        } else {
          // Add new error message
          updated.push({
            role: "assistant",
            content: errorMessage
          });
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Direct message to AI without research, for testing connection
  const sendDirectMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput(""); // Clear input immediately
    
    try {
      // Show a temporary loading message
      setMessages((prev) => [...prev, { role: "assistant", content: "Thinking..." }]);
      
      const generateResponse = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        mode: "cors", // Add CORS mode explicitly
        credentials: "omit", // Don't send cookies
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({
          role: "user",
          model: "deepseek/deepseek-chat:free",
          content: userMessage
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
    
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: newMessage.trim(),
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Error in direct message:", error);
      
      let errorMessage = "I'm sorry, I encountered an error. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
          errorMessage = "Connection error: Unable to reach the API server. Please check that the backend is running at http://localhost:5000.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "CORS error: The API server is not accepting requests from this origin. This is a configuration issue with the API.";
        }
      }
      
      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant" && 
            updated[updated.length - 1].content === "Thinking...") {
          updated[updated.length - 1] = {
            role: "assistant", 
            content: errorMessage
          };
        } else {
          updated.push({
            role: "assistant",
            content: errorMessage
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
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Neuro AI Research Assistant</h1>
        {apiStatus === "checking" && (
          <span className="text-yellow-400 text-sm">Checking API connection...</span>
        )}
        {apiStatus === "connected" && (
          <span className="text-green-400 text-sm">API Connected ✓</span>
        )}
        {apiStatus === "error" && (
          <span className="text-red-400 text-sm">API Connection Error ✗</span>
        )}
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
        // sendDirectMessage={sendDirectMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Chat;