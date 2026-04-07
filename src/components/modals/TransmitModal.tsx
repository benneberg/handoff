import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Share2, Twitter, MessageSquare, Globe, Terminal } from "lucide-react";
import { transmit } from "@/lib/transmit-utils";
import type { SystemCard, TransmitVenue } from "@shared/types";
interface TransmitModalProps {
  card: SystemCard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function TransmitModal({ card, open, onOpenChange }: TransmitModalProps) {
  const [venue, setVenue] = useState<TransmitVenue>('hn');
  const previewText = transmit(card, venue);
  const handleCopy = () => {
    navigator.clipboard.writeText(previewText);
    toast.success(`Formatted for ${venue.toUpperCase()} copied!`);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-5" />
            Transmitter Engine
          </DialogTitle>
          <DialogDescription>
            Optimize your architecture for specific social venues.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={venue} onValueChange={(v) => setVenue(v as TransmitVenue)} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full bg-secondary">
            <TabsTrigger value="hn" className="gap-2">
              <Globe className="size-3" /> HN
            </TabsTrigger>
            <TabsTrigger value="twitter" className="gap-2">
              <Twitter className="size-3" /> X/Thread
            </TabsTrigger>
            <TabsTrigger value="reddit" className="gap-2">
              <MessageSquare className="size-3" /> Reddit
            </TabsTrigger>
            <TabsTrigger value="generic" className="gap-2">
              <Terminal className="size-3" /> Raw
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <ScrollArea className="h-[300px] w-full rounded-md border bg-muted/30 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {previewText}
            </ScrollArea>
            <Button 
              size="sm" 
              className="absolute top-2 right-2 rounded-full"
              onClick={handleCopy}
            >
              <Copy className="size-3 mr-2" />
              Copy
            </Button>
          </div>
        </Tabs>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}