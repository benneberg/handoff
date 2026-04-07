import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Hash } from 'lucide-react';
import { ParadoxViewer } from '@/components/ParadoxViewer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { MOCK_PARADOX_DECK } from '@shared/mock-data';
import { Toaster } from '@/components/ui/sonner';
export function HomePage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const nextCard = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % MOCK_PARADOX_DECK.length);
  }, []);
  const prevCard = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + MOCK_PARADOX_DECK.length) % MOCK_PARADOX_DECK.length);
  }, []);
  const shuffleCard = () => {
    const newIndex = Math.floor(Math.random() * MOCK_PARADOX_DECK.length);
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === 'ArrowLeft') prevCard();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);
  const currentCard = MOCK_PARADOX_DECK[index];
  return (
    <div className="min-h-screen bg-background transition-colors duration-500 overflow-hidden selection:bg-primary/10">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-stone-200/20 dark:bg-stone-800/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-stone-300/20 dark:bg-stone-900/10 blur-[100px]" />
      </div>
      <ThemeToggle />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        <div className="py-8 md:py-10 flex-shrink-0 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-display font-bold tracking-tight text-foreground">
              The Architect Paradox
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">
              Systems Design for the Human Soul
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Hash className="size-3" />
            <span>{index + 1} / {MOCK_PARADOX_DECK.length}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <ParadoxViewer card={currentCard} direction={direction} />
        </div>
        <div className="py-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevCard}
              className="rounded-full hover:bg-accent transition-all duration-300"
              aria-label="Previous Paradox"
            >
              <ChevronLeft className="size-6" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shuffleCard}
              className="px-6 rounded-full font-mono text-[10px] uppercase tracking-tighter border-muted-foreground/20 hover:border-foreground transition-colors"
            >
              <Shuffle className="size-3 mr-2" />
              Randomize
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextCard}
              className="rounded-full hover:bg-accent transition-all duration-300"
              aria-label="Next Paradox"
            >
              <ChevronRight className="size-6" />
            </Button>
          </div>
          <footer className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">
              Use arrow keys to navigate
            </p>
          </footer>
        </div>
      </main>
      <Toaster position="bottom-center" />
    </div>
  );
}