import { useState } from "react";
import { useRouter } from "next/router";
import { Plus, LogOut, Settings } from "lucide-react";

const Sidebar = ({ onSelectChat }: { onSelectChat: (id: string) => void }) => {
  const router = useRouter();
  const [chats, setChats] = useState([
    { id: "1", title: "Chat with AI" },
    { id: "2", title: "Research Notes" },
  ]);

  return (
    <div className="w-72 h-screen bg-gray-900 text-gray-200 flex flex-col p-4 border-r border-gray-800">
      {/* New Chat Button */}
      <button
        className="flex items-center gap-2 w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        onClick={() => console.log("New chat")}
      >
        <Plus size={18} /> New Chat
      </button>

      {/* Chat History */}
      <div className="flex-grow mt-4 space-y-2 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className="w-full flex items-center px-4 py-3 text-left rounded-lg bg-gray-850 hover:bg-gray-700 transition"
          >
            {chat.title}
          </button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-4">
        <button
          className="flex items-center w-full px-4 py-3 gap-2 text-left rounded-lg hover:bg-gray-800 transition"
          onClick={() => console.log("Open Settings")}
        >
          <Settings size={18} /> Settings
        </button>

        <button
          className="flex items-center w-full px-4 py-3 gap-2 text-left rounded-lg hover:bg-gray-800 transition"
          onClick={() => router.push("/login")}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
