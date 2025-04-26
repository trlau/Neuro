"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void; }) {
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [longResponses, setLongResponses] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your preferences for Neuro.
          </DialogDescription>
        </DialogHeader>

        {/* Preferences */}
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <Label>Dark Mode</Label>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Compact Mode</Label>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between">
            <Label>Prefer Longer Responses</Label>
            <Switch checked={longResponses} onCheckedChange={setLongResponses} />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
