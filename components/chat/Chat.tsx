// File: components/chat/Chat.tsx
import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
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
import { generateCitations } from "./utils/chatUtils";

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

  // Send / persist flow
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await createNewChat(userMessage);
    } else {
      await setChatTitle(currentChatId, userMessage);
    }

    await setChatMessage(currentChatId, "user", userMessage);
    setMessages(prev => [...prev, { role: "assistant", content: "..." }]);

    try {
      const raw = await processResearchQuery(
        selectedModel.apiId,
        userMessage,
        setMessages,
        setInput,
        setIsLoading
      );
      await setChatMessage(currentChatId, "assistant", raw);
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: raw };
        return copy;
      });
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request."
        };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // PDF Viewer
  const openPdfViewer = (url: string) => {
    setCurrentPdfUrl(url);
    setPdfViewerOpen(true);
  };

  // PDF Exporter logic
  const handleExportPDF = () => {
    const pdf = new jsPDF();
    let y = 20;
    const pageHeight = pdf.internal.pageSize.height;
    messages.forEach(msg => {
      const prefix = msg.role === 'user' ? 'User: ' : 'Assistant: ';
      const text = prefix + msg.content;
      const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - 20);
      lines.forEach((line: string | string[]) => {
        if (y > pageHeight - 20) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 10, y);
        y += 10;
      });
      y += 5;
    });
    pdf.save('chat-session.pdf');
};

  const handleExportSession = (format: "pdf" | "md" | "txt") => {
    if (format === "pdf") handleExportPDF();
    // ignore other formats for now
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
          onGenerateCitations={() => generateCitations(messages)}
          onExportSession={handleExportSession}
        />
      )}

      {/* Container for export snapshot */}
      <div id="chat-export-container" className="flex-grow overflow-y-auto p-4">
        {isPreloaded && <div></div>}
        {messages.length === 0 && !isPreloaded ? (
          <EmptyState greeting={greeting} onStartResearch={startResearchTopic} />
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
