import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../../ui/dialog";

interface PdfViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
}

export const PdfViewer = ({ isOpen, onOpenChange, pdfUrl }: PdfViewerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 bg-gray-900">
        <DialogHeader className="p-4 border-b border-gray-700">
          <DialogTitle>Paper Viewer</DialogTitle>
        </DialogHeader>
        <div className="h-full w-full overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No PDF available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 