import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { doc, addDoc, setDoc, getDoc, collection, serverTimestamp, arrayUnion } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import TypeWriter from "./motion/TypeWriter";
import { useRouter } from "next/router";
import LoadingThreeDotsJumping from "./motion/LoadingDots";
import {Cursor} from "motion-plus-react"
type ChatProps = {
  chatId: string | null;
};

const Chat = ({ chatId }: ChatProps) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "error">("checking");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    loadAllMessages();

    
  }, [])

  
  // Check API connectivity on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000", {
          method: "GET",
          mode: "cors",
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

  async function setChatTitle(chatId: string, newTitle : string) {
    await setDoc(doc(db, "chats", chatId), {
      title: newTitle
    }, {merge: true})
  }

  async function loadAllMessages() {
    if (chatId) {
      const docRef = doc(db, "chats", chatId);
      const docChats = await getDoc(docRef);

      if (docChats.exists() && docChats.data()["chats"] != null) {
        const chats = docChats.data()["chats"] as string[];
        chats.map((item : any) => {
          setMessages((prev) => [...prev, { role: item["role"], content: item["message"] }]);
        })
      }
    }

    setIsPreloaded(true);
    
  }
  async function setChatMessage(chatId: string, role: string, message: string) {
    await setDoc(doc(db, "chats", chatId), {
      chats: arrayUnion({
        "role": role,
        "message": message
      })
    }, {merge: true})
  }

  async function createNewChat(userMessage : string) {
    const current_user = user as User;
    const docRef = await addDoc(collection(db, "chats"), {
      title: userMessage,
      userId: current_user.uid,
      timestamp: serverTimestamp(),
    });
    router.push(`chat?id=${docRef.id}`);
    return docRef.id;
  }
        
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = input;
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    if (!chatId) {
      chatId = await createNewChat(userMessage)
    }
    else {
      await setChatTitle(chatId as string, userMessage);
    }

    await setChatMessage(chatId as string, "user", userMessage);
    
    setInput(""); // Clear input immediately

    try {
      // Show a temporary loading message immediately
      setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);
      
      
      // Step 1: Get search keywords from user input
      console.log("Sending request to /api/source...");
      const sourceResponse = await fetch("http://localhost:5000/api/source", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          role: "user",
          //model: "microsoft/mai-ds-r1:free",
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
      
      // Step 2: Search for papers using the keywords (if keywords were returned)
      let paperData = [];
      if (keywords && keywords.trim()) {
        console.log("Sending request to /api/paper/search...");
        try {
          const encodedQuery = encodeURIComponent(keywords.trim());
          const paperSearchResponse = await fetch(`http://localhost:5000/api/paper/search?query=${encodedQuery}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Accept": "application/json"
            },
          });

          if (!paperSearchResponse.ok) {
            console.warn("Paper search API error:", paperSearchResponse.status);
            // Continue without paper data instead of throwing
          } else {
            paperData = await paperSearchResponse.json();
            console.log("Paper search results:", paperData);
          }
        } catch (searchError) {
          console.warn("Paper search failed, continuing without papers:", searchError);
          // Continue without paper data
        }
      }
      
      // Step 3: Format paper data to include in the AI prompt
      let enhancedInput = userMessage + "\n\n";
      
      if (paperData && paperData.length > 0) {
        enhancedInput += "Here are some relevant research papers that might help answer the question:\n\n";
        
        // Add up to 3 papers to the prompt
        const paperLimit = Math.min(paperData.length, 3);
        for (let i = 0; i < paperLimit; i++) {
          const paper = paperData[i];
          enhancedInput += `Paper ${i+1}: \'${paper.title || 'Untitled'}\'\n`;
          if (paper.abstract) {
            enhancedInput += `Abstract: ${paper.abstract.substring(0, 200)}...\n`;
          }
          if (paper.url || paper.openAccessPDF.url) {
            enhancedInput += `URL: ${paper.url || paper.openAccessPDF.url}\n`;
          }
          enhancedInput += "\n";
        }
      }
      
      // Step 4: Send enhanced input to AI for generation
      console.log("Sending request to /api/generate...");
      const generateResponse = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        mode: "cors",
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
    
        // Improved AI Response Formatting
        // This is more robust to handle various response formats
        let formattedMessage = newMessage
          // Basic cleaning
          .replace(/\s*\n\s*\n\s*\n+/g, "\n\n") // Normalize excessive line breaks
          
          // Headers formatting
          .replace(/^(#+)\s+(.+)$/gm, "\n\n$1 $2\n") // Add spacing around headers
          
          // List formatting
          .replace(/^(\s*[-•])\s+/gm, "\n$1 ") // Clean up bullet points
          .replace(/^(\s*\d+\.)\s+/gm, "\n$1 ") // Clean up numbered lists
          
          // Bold formatting
          .replace(/\*\*([^*\n]+)\*\*/g, "**$1**") // Ensure bold text is preserved
          
          // Section formatting
          .replace(/\n(.*?:)\s*\n/g, "\n\n**$1**\n\n") // Format section titles with colons
          
          // Final cleanup
          .replace(/\n{3,}/g, "\n\n") // Prevent excessive blank lines
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
      await setChatMessage(chatId as string, "assistant", newMessage);
    } catch (error) {
      console.error("Error in research process:", error);
      
      // Show more specific error in chat
      let errorMessage = "I'm sorry, I encountered an error while researching. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
          errorMessage = "Connection error: Unable to reach the API server. Please make sure the backend is running.";
        } else if (error.message.includes("CORS")) {
          errorMessage = "CORS error: The API server is not accepting requests from this origin.";
        } else if (error.message.includes("429")) {
          errorMessage = "Rate limit reached: The semantic scholar API has temporarily limited requests. Please wait a moment and try again.";
        }
      }
      
      setMessages((prev) => {
        const updated = [...prev];
        // Check if the last message is a loading message
        if (updated.length > 0 && updated[updated.length - 1].role === "assistant" && 
            updated[updated.length - 1].content === "...") {
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

  // Fallback message for offline mode
  const handleOfflineMessage = () => {
    setIsLoading(true);
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    
    // Pre-defined response for COVID-19 question when API is unavailable
    setTimeout(() => {
      // Basic fallback for common queries when API is down
      const query = input.toLowerCase();
      let response = "I'm sorry, I can't connect to the research database right now. Please check your API connection and try again.";
      
      // Simple offline responses to common queries
      if (query.includes("covid") || query.includes("covid-19") || query.includes("coronavirus")) {
        response = `COVID-19, or Coronavirus Disease 2019, is an infectious disease caused by the SARS-CoV-2 virus. Key features include:

1. Transmission: Primarily spreads through respiratory droplets when an infected person coughs, sneezes, or breathes. Can also spread via aerosols in poorly ventilated spaces.

2. Symptoms: Common symptoms include fever, cough, fatigue, loss of taste or smell, and shortness of breath. Severity ranges from asymptomatic to severe illness.

3. Prevention: Vaccination is most effective in preventing severe illness. Other measures include masks, good hand hygiene, and physical distancing.

4. Treatment: Mild cases often require only supportive care, while severe cases may need hospitalization and specialized treatments.

Note: This is offline information. For the latest updates, please check with reputable sources like the WHO or CDC once your connection is restored.`;
      }
      
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setInput("");
      setIsLoading(false);
    }, 1000);
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
        <div className="flex justify-center">
        {messages.length === 0 && isPreloaded && <p className="text-gray-500 text-center w-fit mt-10"><TypeWriter text="Start a conversation with your research assistant..."/></p>}
        </div>
        
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <MessageInput 
        input={input} 
        setInput={setInput} 
        sendMessage={apiStatus === "connected" ? sendMessage : handleOfflineMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Chat;