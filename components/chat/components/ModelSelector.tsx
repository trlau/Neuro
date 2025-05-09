import React, { useState } from "react";
import { ChevronDown, Info, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { cn } from "../../../src/lib/utils";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  {
    id: "deepseek-v4",
    name: "Deepseek v4",
    description: "High performance open-source model with research specialization",
    capabilities: ["Advanced reasoning", "Research assistance", "Technical analysis"],
    available: true
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "OpenAI's advanced multimodal model",
    capabilities: ["Multimodal understanding", "Complex reasoning", "Creative tasks"],
    available: false
  },
  {
    id: "claude-3",
    name: "Claude 3",
    description: "Anthropic's cutting-edge assistant with research capabilities",
    capabilities: ["Deep analysis", "Research assistance", "Technical writing"],
    available: false
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
}) => {
  const [showInfo, setShowInfo] = useState<string | null>(null);
  const selectedModelInfo = models.find((model) => model.id === selectedModel);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-200 hover:text-white hover:bg-zinc-800/50"
          >
            <span className="font-medium">{selectedModelInfo?.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-72 bg-zinc-900 border border-zinc-800"
        >
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              className={cn(
                "flex flex-col items-start p-3",
                model.available ? "cursor-pointer hover:bg-zinc-800/50" : "cursor-not-allowed opacity-60",
                selectedModel === model.id && "bg-zinc-800/50"
              )}
              onClick={() => model.available && onModelChange(model.id)}
              disabled={!model.available}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-white">{model.name}</span>
                {!model.available && (
                  <span className="text-xs text-indigo-400 flex items-center gap-1">
                    <Lock size={12} />
                    Coming Soon
                  </span>
                )}
                <Info
                  className="h-4 w-4 text-gray-400 hover:text-white cursor-help"
                  onMouseEnter={() => setShowInfo(model.id)}
                  onMouseLeave={() => setShowInfo(null)}
                />
              </div>
              <span className="text-sm text-gray-400">{model.description}</span>
              {showInfo === model.id && (
                <div className="mt-2 w-full">
                  <div className="text-xs text-gray-500 mb-1">Capabilities:</div>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-zinc-800 text-indigo-300 rounded-full text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ModelSelector; 