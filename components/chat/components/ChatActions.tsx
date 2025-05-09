import React from "react";
import { FileBadge, Download, FileDigit, FileText } from "lucide-react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface ChatActionsProps {
  onGenerateCitations: () => void;
  onExportSession: (format: "pdf" | "md" | "txt") => void;
}

const ChatActions: React.FC<ChatActionsProps> = ({
  onGenerateCitations,
  onExportSession,
}) => {
  return (
    <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center backdrop-blur-sm">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateCitations}
          className="text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-indigo-300 hover:text-indigo-200"
        >
          <FileBadge size={14} className="mr-1" /> Generate Citations
        </Button>
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-indigo-300 hover:text-indigo-200"
            >
              <Download size={14} className="mr-1" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-zinc-900 border border-zinc-800"
          >
            <DropdownMenuItem
              onClick={() => onExportSession("pdf")}
              className="flex items-center text-sm text-gray-200 hover:bg-zinc-800/50 cursor-pointer"
            >
              <FileText size={14} className="mr-2 text-indigo-400" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExportSession("md")}
              className="flex items-center text-sm text-gray-200 hover:bg-zinc-800/50 cursor-pointer"
            >
              <FileDigit size={14} className="mr-2 text-indigo-400" />
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExportSession("txt")}
              className="flex items-center text-sm text-gray-200 hover:bg-zinc-800/50 cursor-pointer"
            >
              <FileText size={14} className="mr-2 text-indigo-400" />
              Export as Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatActions; 