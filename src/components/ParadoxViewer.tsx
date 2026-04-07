import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SystemCard } from '@shared/types';
import { cn } from '@/lib/utils';
interface ParadoxViewerProps {
  card: SystemCard;
  direction: number;
  isZenMode?: boolean;
}
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)'
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)'
  })
};
export function ParadoxViewer({ card, direction, isZenMode = false }: ParadoxViewerProps) {
  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto flex items-center justify-center",
      isZenMode ? "min-h-[600px]" : "min-h-[500px]"
    )}>
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
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            filter: { duration: 0.4 }
          }}
          className="w-full absolute"
        >
          <Card className={cn(
            "border-none shadow-soft backdrop-blur-xl overflow-hidden border border-border/40 rounded-3xl transition-colors duration-500",
            isZenMode ? "bg-card/95 shadow-2xl" : "bg-card/90"
          )}>
            <CardHeader className="pt-12 pb-6 text-center space-y-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                  Ref No. {card.id.slice(0, 8)}
                </span>
                <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-tighter px-2 py-0 border-primary/20">
                  Ready Level: {card.handoffReadiness}/10
                </Badge>
              </div>
              <CardTitle className={cn(
                "font-display font-bold tracking-tighter text-foreground leading-tight px-4",
                isZenMode ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"
              )}>
                {card.projectName}
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "px-8 pb-16 space-y-10",
              isZenMode ? "md:px-20" : "md:px-16"
            )}>
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
                <p className={cn(
                  "italic font-display text-foreground/80 leading-snug text-pretty text-center",
                  isZenMode ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                )}>
                  "{card.problem}"
                </p>
              </div>
              {card.oneLiner && (
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground font-mono italic opacity-60 text-pretty">
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