"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, auth, logout } from "../lib/firebase";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, Settings, Search, Book, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, FileText, X, BrainCircuit, User } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { SettingsDialog } from "../components/SettingsDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useChat } from "./chat/hooks/useChat";

interface SidebarProps {
  onSelectChat: (id: string) => void;
  selectedChatId?: string | null;
}

function Button_ChatHistory({ chat, onSelectChat, selectedChatId }: any) {

  const router = useRouter();

  const buttonXVariants = {
    hovered: {size: 2},
    not_hovered: {size: 1}
  }

  const MotionXIcon = motion(X);

  const chatHook = useChat(chat.id);
  const [isHovered, setIsHovered] = useState(false);

  function handleDelete(chatId: string) {
    chatHook.deleteChat(chat.id);
    router.push("/chat");
  }

  return (
    <div
      className={`group w-full transition-all duration-200 ${
        selectedChatId === chat.id
          ? "bg-white/10 border-l-2 border-white/50"
          : "hover:bg-white/5"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onSelectChat(chat.id)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-200 hover:text-white transition-colors"
      >
        <span className="truncate pl-2 text-left flex-1">{chat.title}</span>
        <span
          className={`ml-2 flex items-center transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <button
            onClick={e => { e.stopPropagation(); handleDelete(chat.id); }}
            className="p-1.5 rounded-md hover:bg-white/10 flex items-center justify-center"
            tabIndex={-1}
            aria-label="Delete chat"
          >
            <X size={14} className="text-gray-400 group-hover:text-white" />
          </button>
        </span>
      </button>
    </div>
  );
}

export default function Sidebar({ onSelectChat, selectedChatId }: SidebarProps) {
  const router = useRouter();
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (user?.email) {
      const emailUsername = user.email.split('@')[0];
      const formattedName = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
      setUserName(formattedName);
    }
  }, [user]);

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
          className={`flex h-screen flex-col bg-black/50 backdrop-blur-md border-r border-white/10 transition-all duration-300 ${
            collapsed ? "w-16" : "w-72"
          }`}
        >
          {/* Top: Logo and New Chat */}
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <BrainCircuit size={24} className="text-white" />
                {!collapsed && <span className="text-lg font-semibold">Neuro</span>}
              </button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: collapsed ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                    {collapsed ? (
                      <PanelLeftOpen size={18} className="text-gray-400" />
                    ) : (
                      <PanelLeftClose size={18} className="text-gray-400" />
                    )}
                    </motion.div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                  {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                </TooltipContent>
              </Tooltip>
            </div>

            {!collapsed ? (
              <Button
                onClick={createNewChat}
                disabled={isLoading}
                className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <MessageSquarePlus size={18} />
                New Chat
              </Button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={createNewChat}
                    disabled={isLoading}
                    className="w-full justify-center p-2 bg-white/10 hover:bg-white/20 text-white border-0"
                  >
                    <MessageSquarePlus size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                  New Chat
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Chat List */}
          {!collapsed && (
            <div className="flex-1 overflow-y-auto px-2">
              <motion.nav 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <AnimatePresence>
                  {chats.length === 0 ? (
                    <div className="text-center text-sm text-gray-500 mt-10">
                      No chats yet
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <Button_ChatHistory 
                        key={chat.id} 
                        selectedChatId={selectedChatId} 
                        chat={chat} 
                        onSelectChat={onSelectChat}
                      />
                    ))
                  )}
                </AnimatePresence>
              </motion.nav>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10">
            {!collapsed ? (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/citation-generator")}
                  className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <FileText size={18} /> Citation Generator
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/docs")}
                  className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Book size={18} /> User Guide
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSettingsOpen(true)}
                  className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Settings size={18} /> Settings
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <LogOut size={18} /> Logout
                </Button>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 px-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400 truncate">{userName}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/citation-generator")}
                      className="p-2 hover:bg-white/10"
                    >
                      <FileText size={18} className="text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                    Citation Generator
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => router.push("/docs")}
                      className="p-2 hover:bg-white/10"
                    >
                      <Book size={18} className="text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                    User Guide
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setSettingsOpen(true)}
                      className="p-2 hover:bg-white/10"
                    >
                      <Settings size={18} className="text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                    Settings
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="p-2 hover:bg-white/10"
                    >
                      <LogOut size={18} className="text-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                    Logout
                  </TooltipContent>
                </Tooltip>
                <div className="mt-4 pt-4 border-t border-white/10 w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-center">
                        <User size={16} className="text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black/90 text-white px-3 py-2 rounded-md text-sm border border-white/10">
                      {userName}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
