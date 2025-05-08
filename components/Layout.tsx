import Sidebar from "./Sidebar";
import { Chat } from "./../components/chat/Chat";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ChatHeader } from "./chat/components/ChatHeader";

const Layout = ({children, setSelectedChatId, selectedChatId} : {children?: any, setSelectedChatId: (id: string) => void, selectedChatId: string | null}) => {
  const router = useRouter();
  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    router.push(`/chat?id=${id}`, undefined, { shallow: true });
  };
  return (
    <div className="flex h-screen w-screen">
      <Sidebar onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
      {children}
    </div>
  );
};

export default Layout;