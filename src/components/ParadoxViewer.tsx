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
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)'
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
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)'
  })
};
export function ParadoxViewer({ card, direction, isZenMode = false }: ParadoxViewerProps) {
  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto flex items-center justify-center",
      isZenMode ? "h-[650px] md:h-[600px]" : "h-[500px]"
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
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            filter: { duration: 0.3 }
          }}
          className="w-full absolute inset-x-0"
        >
          <Card className={cn(
            "border-none shadow-soft backdrop-blur-xl overflow-hidden border border-border/40 rounded-3xl transition-colors duration-500 mx-auto",
            isZenMode ? "bg-card/95 shadow-2xl ring-1 ring-border/10" : "bg-card/90"
          )}>
            <CardHeader className={cn(
              "text-center space-y-4",
              isZenMode ? "pt-10 md:pt-14 pb-4 md:pb-6" : "pt-8 pb-4"
            )}>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
                  Ref No. {card.id.slice(0, 8)}
                </span>
                <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-tighter px-2 py-0 border-primary/20">
                  Ready Level: {card.handoffReadiness}/10
                </Badge>
              </div>
              <CardTitle className={cn(
                "font-display font-bold tracking-tighter text-foreground leading-tight px-4 text-pretty",
                isZenMode ? "text-3xl md:text-5xl lg:text-6xl" : "text-2xl md:text-4xl"
              )}>
                {card.projectName}
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "px-6 pb-12 md:pb-16 space-y-8 md:space-y-10",
              isZenMode ? "md:px-20" : "md:px-12"
            )}>
              <div className="space-y-3">
                <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest text-center">Logic Integration</p>
                <p className="text-base md:text-lg lg:text-xl text-foreground leading-relaxed text-pretty text-center font-medium max-w-lg mx-auto">
                  {card.solution}
                </p>
              </div>
              <div className="relative py-2 flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 flex items-center">
                  <span className="w-full border-t border-border/20" />
                </div>
                <div className="relative bg-card px-4">
                  <div className="size-1.5 rounded-full bg-primary/30 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[9px] md:text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest text-center">The Human Paradox</p>
                <p className={cn(
                  "italic font-display text-foreground/80 leading-snug text-pretty text-center max-w-lg mx-auto",
                  isZenMode ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl"
                )}>
                  "{card.problem}"
                </p>
              </div>
              {card.oneLiner && (
                <div className="pt-2 md:pt-4 text-center">
                  <p className="text-[10px] md:text-xs text-muted-foreground font-mono italic opacity-60 text-pretty max-w-md mx-auto">
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