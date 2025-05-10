"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { X, Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [tone, setTone] = useState("neutral");
  const [user] = useAuthState(auth);

  // Ensure theme switching only happens after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          className="fixed left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-900/50 backdrop-blur-sm p-6 shadow-2xl focus:outline-none border border-zinc-800"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          {/* Close Button */}
          <DialogClose asChild>
            <button className="absolute right-4 top-4 text-gray-400 hover:text-white transition">
              <X size={22} strokeWidth={2.5} />
            </button>
          </DialogClose>

          <div className="flex flex-col items-center text-center space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                Settings
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Customize your Neuro experience.
              </DialogDescription>
            </div>

            {/* Profile */}
            <div className="w-full text-left space-y-1">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Profile</h3>
              <p className="text-sm font-medium text-white">{user?.email || "Loading..."}</p>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Appearance */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Appearance</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "system", icon: Monitor, label: "System" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => mounted && setTheme(value)}
                    className={`flex flex-col items-center gap-2 rounded-lg p-3 transition ${
                      theme === value
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Assistant Behavior */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Assistant Behavior</h3>
              <div className="grid grid-cols-3 gap-2">
                {["neutral", "formal", "friendly"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    className={`flex-1 rounded-lg px-4 py-3 text-sm transition ${
                      tone === value
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Privacy & Data */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Privacy & Data</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg bg-zinc-900/50 hover:bg-zinc-800 hover:scale-[1.02] transition text-white px-4 py-2 w-full border border-zinc-800"
                >
                  Clear Conversations
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg bg-zinc-900/50 hover:bg-zinc-800 hover:scale-[1.02] transition text-white px-4 py-2 w-full border border-zinc-800"
                >
                  Export Data
                </Button>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Support */}
            <div className="w-full text-center space-y-2 text-sm">
              <p className="text-gray-400">
                Visit our <a href="/docs" className="text-blue-400 hover:underline">Documentation</a> or{" "}
                <a href="mailto:support@neuro.com" className="text-blue-400 hover:underline">Contact Support</a>.
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Version 1.0.0</p>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}