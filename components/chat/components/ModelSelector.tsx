import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ModelType } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

type ModelSelectorProps = {
  models: ModelType[];
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
};

export const ModelSelector = ({
  models,
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) => {
  const [showModelInfo, setShowModelInfo] = useState<string | null>(null);

  return (
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
  );
}; 