import DocsSidebar from "../components/DocsSidebar";
import DocsContent from "../components/DocsContent";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DocsSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <DocsContent />
      </div>
    </div>
  );
}
