import { FileBadge, Download } from "lucide-react";
import { Button } from "../../ui/button";

interface ChatActionsProps {
  onGenerateCitations: () => void;
  onExportSession: (format: "pdf" | "md" | "txt") => void;
}

export const ChatActions = ({
  onGenerateCitations,
  onExportSession
}: ChatActionsProps) => (
  <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
    <Button
      variant="outline"
      size="sm"
      onClick={onGenerateCitations}
      className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
    >
      <FileBadge size={14} className="mr-1" /> Generate Citations
    </Button>

    <Button
      variant="outline"
      size="sm"
      onClick={() => onExportSession("pdf")}
      className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600"
    >
      <Download size={14} className="mr-1" /> Export PDF
    </Button>
  </div>
);