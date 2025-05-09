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
          className="px-5 py-2 rounded-full bg-white border-black text-black font-semibold shadow-sm hover:bg-black hover:text-white hover:border-white hover:shadow-lg focus:ring-2 focus:ring-black/40 transition-all"
        >
          <FileBadge size={16} className="mr-2" /> Generate Citations
        </Button>
      </div>
      <div className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-5 py-2 rounded-full bg-white border-black text-black font-semibold shadow-sm hover:bg-black hover:text-white hover:border-white hover:shadow-lg focus:ring-2 focus:ring-black/40 transition-all"
            >
              <Download size={16} className="mr-2" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-white border border-black rounded-xl shadow-lg mt-2"
          >
            <DropdownMenuItem
              onClick={() => onExportSession("pdf")}
              className="flex items-center text-sm text-black rounded-lg hover:bg-black hover:text-white hover:border-white cursor-pointer transition-all px-4 py-2"
            >
              <FileText size={16} className="mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExportSession("md")}
              className="flex items-center text-sm text-black rounded-lg hover:bg-black hover:text-white hover:border-white cursor-pointer transition-all px-4 py-2"
            >
              <FileDigit size={16} className="mr-2" />
              Export as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onExportSession("txt")}
              className="flex items-center text-sm text-black rounded-lg hover:bg-black hover:text-white hover:border-white cursor-pointer transition-all px-4 py-2"
            >
              <FileText size={16} className="mr-2" />
              Export as Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatActions; 