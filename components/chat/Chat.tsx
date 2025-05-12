"use client";

import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import ChatHeader from "./components/ChatHeader";
import ChatActions from "./components/ChatActions";
import { EmptyState } from "./components/EmptyState";
import PdfViewer from "./components/PdfViewer";
import { useChat } from "./hooks/useChat";
import { useApi } from "./hooks/useApi";
import { generateCitations, exportSession } from "./utils/chatUtils";
import ReferencesSection from "./components/ReferencesSection";
import { getSearchKeywords, searchPapers } from "./utils/apiEndpoints";
import { parseReferences } from "./utils/parseReferences";

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
  const [papers, setPapers] = useState([] as any[]);

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

    // 1) Get keywords
    const keywords = await getSearchKeywords(selectedModel, userMessage);

    let papers: any[] = [];
    try {
      papers = await searchPapers(keywords);

      setPapers(papers);
    } catch {
      console.warn("Paper search failed; continuing without papers.");
    }

    try {
      // Run the research pipeline
      const raw = await processResearchQuery(
        selectedModel,
        userMessage,
        setMessages,
        setInput,
        setIsLoading,
        papers,
        keywords
      );

      // Persist and display assistant response
      await setChatMessage(currentChatId, "assistant", raw, papers);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: raw, references: papers };
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
      // Find the latest assistant message with references
      const lastAssistantMsg = [...messages].reverse().find(
        msg => msg.role === "assistant" && msg.references && msg.references.length > 0
      );
      if (!lastAssistantMsg) {
        alert("No references found in the conversation.");
        return;
      }
      // Extract the Search Results section (table content)
      const searchResultsMatch = lastAssistantMsg.content.match(/Search Results[\s\S]*?\n([\s\S]*?)(?:\n\s*\n|$)/i);
      const searchResultsText = searchResultsMatch ? searchResultsMatch[1].trim() : "";
      const papers = lastAssistantMsg.references || [];
      if (!papers || papers.length === 0) {
        alert("No references found in the conversation.");
        return;
      }
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("References", 10, 20);
      const lines = papers.map((paper, idx) => `${idx + 1}. ${paper.title}`);
      const splitLines = doc.splitTextToSize(lines.join("\n"), 180);
      doc.text(splitLines, 10, 30);
      doc.save("citations.pdf");
    } catch (error) {
      console.error("Citation generation failed:", error);
      alert("Failed to generate citations. Please try again.");
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
                <React.Fragment key={idx}>
                  <Message
                    role={msg.role}
                    content={msg.content}
                    onPdfView={openPdfViewer}
                    papers={msg.references || papers}
                  />
                  {/* {msg.role === "assistant" && <ReferencesSection papers={papers} />} */}
                </React.Fragment>
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
