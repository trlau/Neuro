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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes"; // <-- ADD this for real theme switching

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const [tone, setTone] = useState("neutral");
  const [user] = useAuthState(auth);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent
          className="fixed left-1/2 top-1/2 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-900 p-6 shadow-2xl focus:outline-none"
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

            <Separator className="bg-gray-700" />

            {/* Appearance */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Appearance</h3>
              <div className="flex gap-2">
                {["light", "dark", "system"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition ${
                      theme === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Assistant Behavior */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Assistant Behavior</h3>
              <div className="flex gap-2">
                {["neutral", "formal", "friendly"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setTone(value)}
                    className={`flex-1 rounded-md px-4 py-2 text-sm transition ${
                      tone === value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Privacy & Data */}
            <div className="w-full text-left space-y-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Privacy & Data</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md bg-gray-800 hover:bg-gray-700 hover:scale-[1.03] transition text-white px-4 py-2 w-full"
                >
                  Clear Conversations
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md bg-gray-800 hover:bg-gray-700 hover:scale-[1.03] transition text-white px-4 py-2 w-full"
                >
                  Export Data
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Support */}
            <div className="w-full text-center space-y-2 text-sm">
              <p className="text-gray-400">
                Visit our <a href="/docs" className="underline hover:text-white">Documentation</a> or{" "}
                <a href="mailto:support@neuro.com" className="underline hover:text-white">Contact Support</a>.
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Version 1.0.0</p>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
