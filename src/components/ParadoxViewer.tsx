import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SystemCard } from '@shared/types';
interface ParadoxViewerProps {
  card: SystemCard;
  direction: number;
}
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95
  })
};
export function ParadoxViewer({ card, direction }: ParadoxViewerProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto min-h-[500px] flex items-center justify-center">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={card.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 400, damping: 40 },
            opacity: { duration: 0.25 },
            scale: { duration: 0.25 }
          }}
          className="w-full absolute"
        >
          <Card className="border-none shadow-soft bg-card/90 backdrop-blur-md overflow-hidden border border-border/40 rounded-3xl">
            <CardHeader className="pt-12 pb-6 text-center space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                  Ref No. {card.id.slice(0, 8)}
                </span>
                <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-tighter px-2 py-0 border-primary/20">
                  Ready Level: {card.handoffReadiness}/10
                </Badge>
              </div>
              <CardTitle className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-foreground leading-tight px-4">
                {card.projectName}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 md:px-16 pb-16 space-y-10">
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest text-center">Logic Integration</p>
                <p className="text-lg md:text-xl text-foreground leading-relaxed text-pretty text-center font-medium">
                  {card.solution}
                </p>
              </div>
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative bg-card px-4">
                  <div className="size-2 rounded-full bg-primary/20 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest text-center">The Human Paradox</p>
                <p className="text-xl md:text-2xl italic font-display text-foreground/80 leading-snug text-pretty text-center">
                  "{card.problem}"
                </p>
              </div>
              {card.oneLiner && (
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground font-mono italic opacity-60">
                    // {card.oneLiner}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}