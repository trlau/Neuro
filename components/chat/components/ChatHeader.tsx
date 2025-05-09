import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "../../../src/lib/utils";
import ModelSelector from "./ModelSelector";

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  isConnected: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedModel,
  onModelChange,
  isConnected,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      {/* Model Selector Dropdown */}
      <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm",
            isConnected
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          )}
        >
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 