import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, LogOut, Settings } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { logout } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

interface SidebarProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
}

const Sidebar = ({ onSelectChat, selectedChatId }: SidebarProps) => {
  const router = useRouter();
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user-specific chat history
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("userId", "==", user.uid), // Fetch only the logged-in user's chats
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "New Chat", // Fetch chat titles
        }))
      );
    });

    return () => unsubscribe();
  }, [user]);

  // Handle creating a new chat
  const createNewChat = async () => {
    if (!user || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const docRef = await addDoc(collection(db, "chats"), {
        title: "New Chat",
        userId: user.uid,
        timestamp: serverTimestamp(),
      });

      onSelectChat(docRef.id);
      
      // Use shallow routing to prevent full page refreshes
      console.log(docRef.id);
      await router.push(`/chat?id=${docRef.id}`, undefined, { shallow: false });
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout with safe navigation
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-72 h-screen bg-gray-900 text-gray-200 flex flex-col p-4 border-r border-gray-800">
      {/* New Chat Button */}
      <button
        className={`flex items-center gap-2 w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={createNewChat}
        disabled={isLoading}
      >
        <Plus size={18} /> {isLoading ? "Creating..." : "New Chat"}
      </button>

      {/* Chat History */}
      <div className="flex-grow mt-4 space-y-2 overflow-y-auto">
        {chats.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">No chats yet</p>
        )}
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg hover:bg-gray-700 transition ${
              selectedChatId === chat.id ? 'bg-blue-800/30 border-l-4 border-blue-500' : 'bg-gray-850'
            }`}
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
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;