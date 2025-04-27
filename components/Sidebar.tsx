"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth, logout } from "../lib/firebase";
import { LogOut, Settings, Search, Book, MessageSquarePlus, PanelLeftClose, FileText } from "lucide-react";
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
import { SettingsDialog } from "../components/SettingsDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
}

export default function Sidebar({ onSelectChat, selectedChatId }: SidebarProps) {
  const router = useRouter();
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "chats"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "New Chat",
        }))
      );
    });

    return () => unsubscribe();
  }, [user]);

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
      await router.push(`/chat?id=${docRef.id}`, undefined, { shallow: false });
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <TooltipProvider>
        <aside
          className={`flex h-screen flex-col bg-gray-900 border-r border-gray-800 p-4 text-gray-200 shadow-inner transition-all duration-300 ${
            collapsed ? "w-16" : "w-72"
          }`}
        >
        {/* Top: "Neuro" Logo */}
        <div className="flex items-center justify-center pb-6">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold tracking-tight text-white hover:text-blue-400 transition"
          >
            Neuro
          </button>
        </div>

        {/* Top Icon Buttons */}
        <div className="flex items-center justify-between pb-4">

            {/* Collapse Sidebar */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="rounded-md p-2 hover:bg-gray-800 transition"
                >
                  <PanelLeftClose size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Citation Generator */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => console.log("Citation Generator clicked")}
                  className="rounded-md p-2 hover:bg-gray-800 transition"
                >
                  <FileText size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>Citation Generator</p>
              </TooltipContent>
            </Tooltip>

            {/* Search */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => console.log("Search clicked")}
                  className="rounded-md p-2 hover:bg-gray-800 transition"
                >
                  <Search size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>Search Chats</p>
              </TooltipContent>
            </Tooltip>

            {/* New Chat */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={createNewChat}
                  disabled={isLoading}
                  className="rounded-md p-2 hover:bg-gray-800 transition"
                >
                  <MessageSquarePlus size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white px-3 py-2 rounded-md text-sm">
                <p>New Chat</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Chat List */}
          {!collapsed && (
            <nav className="flex-1 overflow-y-auto space-y-1">
              {chats.length === 0 ? (
                <div className="text-center text-sm text-gray-500 mt-10">
                  No chats yet
                </div>
              ) : (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition ${
                      selectedChatId === chat.id
                        ? "bg-blue-800/40 border-l-4 border-blue-500 font-semibold text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    {chat.title}
                  </button>
                ))
              )}
            </nav>
          )}

          {/* Bottom Buttons */}
          <div className="mt-6 border-t border-gray-800 pt-4 space-y-2">
            {!collapsed && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/docs")}
                  className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-left hover:bg-gray-800 transition"
                >
                  <Book size={18} /> User Guide
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setSettingsOpen(true)}
                  className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-left hover:bg-gray-800 transition"
                >
                <Settings size={18} /> Settings
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm text-left hover:bg-gray-800 transition"
              >
                <LogOut size={18} /> Logout
              </Button>
            </>
          )}
        </div>
        </aside>
      </TooltipProvider>

      {/* Proper SettingsDialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
