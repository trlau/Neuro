import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Message from "./Message";
import MessageInput from "./MessageInput";
import ChatHeader from "./components/ChatHeader";
import ChatActions from "./components/ChatActions";
import { EmptyState } from "./components/EmptyState";
import PdfViewer from "./components/PdfViewer";
import { useChat } from "./hooks/useChat";
import { useApi } from "./hooks/useApi";
import { generateCitations, exportSession } from "./utils/chatUtils";
import { BrainCircuit } from "lucide-react";

const DEFAULT_MODEL = "deepseek/deepseek-chat:free";

export const Chat = ({ chatId: initialChatId }: { chatId: string | null }) => {
  const {
    messages,
    setMessages,
    isPreloaded,
    input,
    setInput,
    isLoading,
    setIsLoading,
    greeting,
    startResearchTopic,
    chatId,
    setChatTitle,
    setChatMessage,
    createNewChat,
  } = useChat(initialChatId);

  const { apiStatus, processResearchQuery, handleOfflineMessage } = useApi(chatId);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Create or title the chat
    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await createNewChat(userMessage);
    }

    // Persist user message
    await setChatMessage(currentChatId, "user", userMessage);

    // Show loading indicator
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      // Run the research pipeline
      const raw = await processResearchQuery(
        selectedModel,
        userMessage,
        setMessages,
        setInput,
        setIsLoading
      );

      // Persist and display assistant response
      await setChatMessage(currentChatId, "assistant", raw);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: raw };
        return copy;
      });
    } catch {
      // Show error in last slot
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error while processing your request.",
        };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSession = async (format: "pdf" | "md" | "txt") => {
    try {
      await exportSession(messages, format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleGenerateCitations = async () => {
    try {
      await generateCitations(messages);
    } catch (error) {
      console.error("Citation generation failed:", error);
    }
  };

  const openPdfViewer = (url: string) => {
    setCurrentPdfUrl(url);
    setPdfViewerOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white font-space-grotesk relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <ChatHeader
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isConnected={apiStatus === "connected"}
        />

        {messages.length > 0 && (
          <ChatActions
            onGenerateCitations={handleGenerateCitations}
            onExportSession={handleExportSession}
          />
        )}

        <div className="flex-grow overflow-y-auto p-4">
          {isPreloaded && <div></div>}
          {messages.length === 0 && !isPreloaded ? (
            <EmptyState
              greeting={greeting}
              onStartResearch={startResearchTopic}
            />
          ) : (
            <>
              {messages.map((msg, idx) => (
                <Message 
                  key={idx} 
                  role={msg.role} 
                  content={msg.content}
                  onPdfView={openPdfViewer}
                />
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        <MessageInput
          input={input}
          setInput={setInput}
          sendMessage={
            apiStatus === "connected"
              ? sendMessage
              : () => handleOfflineMessage(input, setMessages, setInput, setIsLoading)
          }
          isLoading={isLoading}
        />

        <PdfViewer
          isOpen={pdfViewerOpen}
          onClose={() => setPdfViewerOpen(false)}
          pdfUrl={currentPdfUrl}
        />
      </div>
    </div>
  );
};

export default Chat;
