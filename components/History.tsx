import { useEffect, useState } from "react";
import { auth, getChatHistory, onAuthStateChanged } from "../lib/firebase";
import { User } from "firebase/auth"; // Import Firebase's User type

const History = ({ setMessages }: { setMessages: any }) => {
  const [user, setUser] = useState<User | null>(null); // Type the user state properly
  const [history, setHistory] = useState<{ id: string; message: string }[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => { // Explicitly type 'user'
      if (user) {
        setUser(user);
        const chatHistory = await getChatHistory(user.uid);
        setHistory(chatHistory);
      } else {
        setUser(null);
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-64 bg-gray-800 text-white p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No past chats</p>
      ) : (
        <ul>
          {history.map((chat) => (
            <li key={chat.id} className="cursor-pointer p-2 hover:bg-gray-700 rounded">
              {chat.message.substring(0, 20)}...
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
