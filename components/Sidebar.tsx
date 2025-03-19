import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, LogOut, Settings } from "lucide-react";
import { db, auth } from "../lib/firebase";
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

const Sidebar = ({ onSelectChat }: { onSelectChat: (id: string) => void }) => {
  const router = useRouter();
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [user] = useAuthState(auth);

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
    if (!user) return;

    const docRef = await addDoc(collection(db, "chats"), {
      title: "Untitled Chat",
      userId: user.uid,
      timestamp: serverTimestamp(),
    });

    onSelectChat(docRef.id);
    router.push("/chat");
  };

  return (
    <div className="w-72 h-screen bg-gray-900 text-gray-200 flex flex-col p-4 border-r border-gray-800">
      {/* New Chat Button */}
      <button
        className="flex items-center gap-2 w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        onClick={createNewChat}
      >
        <Plus size={18} /> New Chat
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
};

export default Sidebar;
