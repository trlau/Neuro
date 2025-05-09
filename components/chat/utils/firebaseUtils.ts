import { doc, addDoc, setDoc, getDoc, collection, serverTimestamp, arrayUnion } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { User } from "firebase/auth";

// Set chat title
export const setChatTitle = async (chatId: string, newTitle: string) => {
  await setDoc(
    doc(db, "chats", chatId),
    { title: newTitle },
    { merge: true }
  );
};

// Load all messages for a chat
export const loadAllMessages = async (chatId: string | null, setMessages: any) => {
  if (!chatId) return;
  const docRef = doc(db, "chats", chatId);
  const docChats = await getDoc(docRef);
  if (docChats.exists() && docChats.data().chats) {
    const chats = docChats.data().chats as any[];
    chats.forEach((item) => {
      setMessages((prev: any) => [
        ...prev,
        { role: item.role, content: item.message }
      ]);
    });
  }
};

// Set chat message
export const setChatMessage = async (chatId: string, role: string, message: string) => {
  await setDoc(
    doc(db, "chats", chatId),
    {
      chats: arrayUnion({ role, message })
    },
    { merge: true }
  );
};

// Create new chat
export const createNewChat = async (userMessage: string, router: any) => {
  const current_user = auth.currentUser as User;
  const docRef = await addDoc(collection(db, "chats"), {
    title: userMessage,
    userId: current_user.uid,
    timestamp: serverTimestamp()
  });
  router.push(`chat?id=${docRef.id}`);
  return docRef.id;
}; 