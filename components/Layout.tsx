import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useRouter } from "next/router";
import { useState } from "react";

const Layout = () => {
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    router.push(`/chat?id=${id}`);
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar onSelectChat={handleSelectChat} />
      <Chat />
    </div>
  );
};

export default Layout;
