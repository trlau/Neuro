import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { User } from "firebase/auth";
import { MessageType } from "../types";
import { useApi } from "./useApi";
import { formatAiResponse, handleErrorMessage } from "../utils/chatUtils";
import { getSearchKeywords, searchPapers } from "../utils/apiEndpoints";

export const useChat = (initialChatId: string | null) => {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const { processResearchQuery } = useApi(initialChatId);
  let chatId = initialChatId;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState<string>("");
  const [isPreloaded, setIsPreloaded] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("");
  const [model, setModel] = useState<string>("deepseek/deepseek-chat:free");

  // Time-sensitive greeting
  useEffect(() => {
    const updateGreeting = () => {
      const h = new Date().getHours();
      if (h < 12) setGreeting("Good morning");
      else if (h < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");
    };
    updateGreeting();
    const iv = setInterval(updateGreeting, 60000);
    return () => clearInterval(iv);
  }, []);

  // Load existing messages on mount
  useEffect(() => {
    const loadAllMessages = async () => {
      if (!initialChatId) return setIsPreloaded(false);;
      const ref = doc(db, "chats", initialChatId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        // guard against missing or non-array chats
        const data = snap.data();
        const chatsArray = Array.isArray(data.chats) ? data.chats : [];
        setMessages(
          chatsArray.map((c) => ({
            role: c.role,
            content: c.message,
            references: c.references
          }))
        );
      }
      setIsPreloaded(false);
    };
    loadAllMessages();
  }, [initialChatId]);

  // Firestore helpers
  async function setChatTitle(id: string, title: string) {
    await setDoc(doc(db, "chats", id), { title }, { merge: true });
  }

  async function setChatMessage(
    id: string,
    role: string,
    message: string,
    references: any[] = []
  ) {

    await setDoc(
      doc(db, "chats", id),
      { chats: arrayUnion({ role, message, references }) },
      { merge: true }
    );
  }

  async function createNewChat(userMessage: string) {
    const current = user as User;
    const docRef = await addDoc(collection(db, "chats"), {
      title: userMessage,
      userId: current.uid,
      timestamp: serverTimestamp(),
    });
    router.push(`chat?id=${docRef.id}`);
    return docRef.id;
  }

  async function deleteChat(chatId : string) {
    const current = user as User;
    const docRef = await deleteDoc(doc(db, "chats", chatId))
  }

  // Quick-start topic setter
  const startResearchTopic = (topic: string) => {
    setInput(topic);
    document.querySelector("textarea")?.focus();
  };

  // Main send handler
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    if (!chatId) {
      chatId = await createNewChat(userMessage);
    }
    await setChatMessage(chatId, "user", userMessage);

    // Insert loading placeholder
    setMessages((prev) => [...prev, { role: "assistant", content: "..." }]);

    // 1) Get keywords
    const keywords = await getSearchKeywords(model, userMessage);

    let papers: any[] = [];
          try {
            papers = await searchPapers(keywords);
            
          } catch {
            console.warn("Paper search failed; continuing without papers.");
          }

    try {
      const raw = await processResearchQuery(
        model,
        userMessage,
        setMessages,
        setInput,
        setIsLoading,
        papers,
        keywords
      );
      const formatted = formatAiResponse(raw);

      await setChatMessage(chatId, "assistant", formatted);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: formatted };
        return copy;
      });
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
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

  // Enter key sends
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const handleClearChat = async () => {
    if (!chatId) return;
    try {
      await setDoc(doc(db, "chats", chatId), { chats: [] }, { merge: true });
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isPreloaded,
    isLoading,
    deleteChat,
    setIsLoading,
    greeting,
    setGreeting,
    chatId,
    model,
    setModel,
    setChatTitle,
    setChatMessage,
    createNewChat,
    startResearchTopic,
    handleSendMessage,
    handleKeyDown,
    handleClearChat,
  };
};
