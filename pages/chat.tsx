
import Chat from "../components/chat/Chat";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function ChatPage() {
  const router = useRouter();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
    // Initialize selectedChatId from URL parameter when component mounts
    useEffect(() => {
      if (router.query.id && typeof router.query.id === "string") {
        setSelectedChatId(router.query.id);
      }
    }, [router.query.id]);
  
    
  

  return <Layout setSelectedChatId={setSelectedChatId} selectedChatId={selectedChatId}>
    <Chat chatId={selectedChatId} key={selectedChatId} />
  </Layout>;
}
