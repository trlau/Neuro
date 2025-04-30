// File: components/chat/hooks/useApi.ts
import { useState, useEffect } from "react";
import { ApiStatus, MessageType } from "../types";
import {
  getSearchKeywords,
  searchPapers,
  generateResponse,
  formatPaperData,
} from "../utils/apiEndpoints";
import { formatAiResponse, handleErrorMessage } from "../utils/chatUtils";

export const useApi = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const [isApiOnline, setIsApiOnline] = useState(true);
  const [lastApiCheck, setLastApiCheck] = useState<Date | null>(null);

  // Initial connectivity check against root endpoint
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000", {
          method: "GET",
          mode: "cors",
          headers: { Accept: "application/json" },
        });
        setApiStatus(response.ok ? "connected" : "error");
        setIsApiOnline(response.ok);
        setLastApiCheck(new Date());
      } catch {
        setApiStatus("error");
        setIsApiOnline(false);
        setLastApiCheck(new Date());
      }
    };
    checkApiConnection();
  }, []);

  // Periodic heartbeat — also against /
  useEffect(() => {
    const checkHeartbeat = async () => {
      try {
        const response = await fetch("http://localhost:5000", {
          method: "GET",
          mode: "cors",
          headers: { Accept: "application/json" },
        });
        setIsApiOnline(response.ok);
        setLastApiCheck(new Date());
      } catch (e) {
        console.error("Heartbeat error:", e);
        setIsApiOnline(false);
        setLastApiCheck(new Date());
      }
    };

    checkHeartbeat();
    const iv = setInterval(checkHeartbeat, 30000);
    return () => clearInterval(iv);
  }, []);

  /**
   * Runs the full research pipeline:
   *  1) getSearchKeywords
   *  2) searchPapers
   *  3) formatPaperData
   *  4) generateResponse (streaming)
   *
   * Returns the final concatenated response string.
   */
  const processResearchQuery = async (
    model: string,
    userMessage: string,
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<string> => {
    let result = "";
    try {
      if (!isApiOnline) {
        throw new Error("API is currently offline. Please try again later.");
      }

      // 1) Get keywords
      const keywords = await getSearchKeywords(model, userMessage);

      // 2) Search papers (graceful fallback)
      let papers: any[] = [];
      try {
        papers = await searchPapers(keywords);
      } catch {
        console.warn("Paper search failed; continuing without papers.");
      }

      // 3) Build enhanced prompt
      const enhancedInput = formatPaperData(userMessage, papers);

      // 4) Stream the AI response
      const stream = await generateResponse(model, enhancedInput);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Initialize an empty assistant-message slot
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Read chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });

        // Update UI as we stream
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: formatAiResponse(result),
          };
          return copy;
        });
      }

      // Return the full assembled text
      return result;
    } catch (error: any) {
      console.error("API Error:", error);
      // Show the error message in chat
      setMessages((prev) => handleErrorMessage(prev, error));
      throw error;
    } finally {
      // always reset input/loading
      setInput("");
      setIsLoading(false);
    }
  };

  // Offline fallback
  const handleOfflineMessage = (
    userInput: string,
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "I'm currently offline. Your message will be processed when I'm back online.",
      },
    ]);
    setInput("");
    setIsLoading(false);
  };

  return {
    apiStatus,
    setApiStatus,
    isApiOnline,
    lastApiCheck,
    processResearchQuery,
    handleOfflineMessage,
  };
};
