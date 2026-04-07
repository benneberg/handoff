import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Copy, Download, FileText } from "lucide-react";
import { generateCardMarkdown } from "@/lib/markdown-utils";
import type { SystemCard } from "@shared/types";
interface MarkdownPreviewModalProps {
  card: SystemCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function MarkdownPreviewModal({ card, open, onOpenChange }: MarkdownPreviewModalProps) {
  const markdown = generateCardMarkdown(card);
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown copied to clipboard");
  };
  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.projectName || 'system-card'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Markdown Specification
          </DialogTitle>
          <DialogDescription>
            Technical output for documentation and handoff.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/30 p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {markdown}
        </ScrollArea>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="size-4 mr-2" />
            Copy Source
          </Button>
          <Button onClick={handleDownload}>
            <Download className="size-4 mr-2" />
            Download .md
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}