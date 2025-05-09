import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { ModelType } from "../types";

interface ChatHeaderProps {
  models: ModelType[];
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
  apiStatus: "checking" | "connected" | "error";
  showModelInfo: string | null;
  setShowModelInfo: (modelName: string | null) => void;
}

export const ChatHeader = ({
  models,
  selectedModel,
  onModelSelect,
  apiStatus,
  showModelInfo,
  setShowModelInfo
}: ChatHeaderProps) => {
  return (
    <div className="p-4 bg-black/50 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
      <div className="flex items-center relative">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 text-l font-semibold focus:outline-none">
            {selectedModel.name}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border border-gray-700 rounded-md p-1 min-w-[200px]">
            {models.map((model) => (
              <div key={model.name} className="relative">
                <DropdownMenuItem
                  className={`px-3 py-2 cursor-pointer rounded ${
                    selectedModel.name === model.name ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    onModelSelect(model);
                    setShowModelInfo(model.name);
                    setTimeout(() => setShowModelInfo(null), 3000);
                  }}
                >
                  {model.name}
                </DropdownMenuItem>
                {showModelInfo === model.name && (
                  <div className="absolute left-full ml-2 top-0 bg-black text-white p-2 rounded shadow-md text-sm whitespace-nowrap z-10">
                    {model.description}
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
        {apiStatus === "checking" && (
          <span className="text-yellow-400 text-sm">Checking API connection...</span>
        )}
        {apiStatus === "connected" && (
          <span className="text-green-400 text-sm">API Connected ✓</span>
        )}
        {apiStatus === "error" && (
          <span className="text-red-400 text-sm">API Connection Error ✗</span>
        )}
      </div>
    </div>
  );
}; 