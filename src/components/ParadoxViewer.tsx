import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="relative w-full max-w-2xl mx-auto min-h-[450px] flex items-center justify-center">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={card.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          className="w-full absolute"
        >
          <Card className="border-none shadow-soft bg-card/80 backdrop-blur-sm overflow-hidden border border-border/40">
            <CardHeader className="pt-10 pb-4 text-center">
              <div className="text-2xs uppercase tracking-widest text-muted-foreground mb-2">System Architecture</div>
              <CardTitle className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
                {card.projectName}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 md:px-12 pb-12 space-y-8">
              <div className="space-y-2">
                <p className="text-sm font-mono text-muted-foreground/70 uppercase">Logic</p>
                <p className="text-lg text-foreground leading-relaxed text-pretty">
                  {card.solution}
                </p>
              </div>
              <div className="h-px w-12 bg-border mx-auto" />
              <div className="space-y-2">
                <p className="text-sm font-mono text-muted-foreground/70 uppercase">The Human Paradox</p>
                <p className="text-xl italic font-display text-foreground leading-snug text-pretty">
                  {card.problem}
                </p>
              </div>
              <div className="pt-4 text-center">
                <span className="text-xs font-medium text-muted-foreground">
                  Readiness Level: {card.handoffReadiness}/10
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}