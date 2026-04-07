import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Info, Target, Zap, ShieldCheck } from "lucide-react";
interface GuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function GuideModal({ open, onOpenChange }: GuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold flex items-center gap-2">
            <Info className="size-6 text-primary" />
            System Card Methodology
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
            Principles for Architectural Life Design
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 py-4">
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="size-4 text-primary" />
              What is a System Card?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A System Card is a technical abstraction applied to the human condition. It treats personal struggles, growth, and identity as software architectures that can be debugged, refactored, and scaled.
            </p>
          </section>
          <Separator />
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Core Principles
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-bold text-foreground">01.</span>
                <span>Maintain 100% logic integrity even when emotional resources are low.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">02.</span>
                <span>Optimistic Concurrency: Believe in eventual consistency between your values and actions.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">03.</span>
                <span>Graceful Degradation: Shut down non-critical background tasks during high-stress loads.</span>
              </li>
            </ul>
          </section>
          <Separator />
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              Product Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="font-bold mb-1">MVP First</p>
                <p className="text-muted-foreground">Don't over-engineer. Focus on the core survival loop first.</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="font-bold mb-1">Readiness Score</p>
                <p className="text-muted-foreground">Be honest about implementation. A 3/10 is a draft; 10/10 is instinct.</p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}