import Sidebar from "./Sidebar";
import { Chat } from "./../components/chat/Chat";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Layout = () => {
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Initialize selectedChatId from URL parameter when component mounts
  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      setSelectedChatId(router.query.id);
    }
  }, [router.query.id]);

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    router.push(`/chat?id=${id}`, undefined, { shallow: true });
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
      <Chat chatId={selectedChatId} key={selectedChatId} />
    </div>
  );
};

export default Layout;