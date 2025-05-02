// File: components/chat/Chat.tsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { ChatHeader } from "./components/ChatHeader";
import { ChatActions } from "./components/ChatActions";
import { EmptyState } from "./components/EmptyState";
import { PdfViewer } from "./components/PdfViewer";
import { ModelType } from "./types";
import { useChat } from "./hooks/useChat";
import { useApi } from "./hooks/useApi";
import { generateCitations, exportSession } from "./utils/chatUtils";

const models: ModelType[] = [
  {
    name: "Deepseek v4",
    description: "High performance open-source model with research specialization",
    apiId: "deepseek/deepseek-chat:free",
  },
  {
    name: "ChatGPT 4",
    description: "OpenAI's advanced multimodal model",
    apiId: "deepseek/deepseek-chat:free",
  },
  {
    name: "Claude 3.7",
    description: "Anthropic's cutting-edge assistant with research capabilities",
    apiId: "deepseek/deepseek-chat:free",
  },
];

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

  const { apiStatus, processResearchQuery, handleOfflineMessage } = useApi();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedModel, setSelectedModel] = useState<ModelType>(models[0]);
  const [showModelInfo, setShowModelInfo] = useState<string | null>(null);
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
    } else {
      await setChatTitle(currentChatId, userMessage);
    }

    // Persist user message
    await setChatMessage(currentChatId, "user", userMessage);

    // Show loading indicator
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    try {
      // Run the research pipeline
      const raw = await processResearchQuery(
        selectedModel.apiId,
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

  const openPdfViewer = (url: string) => {
    setCurrentPdfUrl(url);
    setPdfViewerOpen(true);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
      <ChatHeader
        models={models}
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        apiStatus={apiStatus}
        showModelInfo={showModelInfo}
        setShowModelInfo={setShowModelInfo}
      />

      {messages.length > 0 && (
        <ChatActions
          onGenerateCitations={generateCitations}
          onExportSession={exportSession}
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
              <Message key={idx} role={msg.role} content={msg.content} />
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
        onOpenChange={setPdfViewerOpen}
        pdfUrl={currentPdfUrl}
      />
    </div>
  );
};

export default Chat;
