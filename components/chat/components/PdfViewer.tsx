import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { FileText, X } from "lucide-react";
import { Button } from "../../ui/button";

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, onClose, pdfUrl }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-zinc-900 border border-zinc-800">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800">
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-indigo-400" />
            PDF Viewer
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800/50"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-lg">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FileText className="h-12 w-12 mb-4 text-indigo-400/50" />
              <p>No PDF document available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer; 