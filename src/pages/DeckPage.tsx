import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Shuffle, Binary, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParadoxViewer } from '@/components/ParadoxViewer';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import type { SystemCard } from '@shared/types';
import { useHotkeys } from 'react-hotkeys-hook';
export function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api<{ items: SystemCard[] }>('/api/cards'),
  });
  const cards = useMemo(() => cardsData?.items ?? [], [cardsData?.items]);
  const deckOrder = useMemo(() => {
    if (shuffledOrder && shuffledOrder.length === cards.length) {
      return shuffledOrder;
    }
    return cards.map((_, i) => i);
  }, [cards, shuffledOrder]);
  const activeCard = useMemo(() => cards[deckOrder[currentIndex]], [cards, deckOrder, currentIndex]);
  // Handle Initial ID Routing or deep links
  useEffect(() => {
    if (id && cards.length > 0) {
      const cardIndex = cards.findIndex(c => c.id === id);
      if (cardIndex !== -1) {
        const orderIndex = deckOrder.indexOf(cardIndex);
        if (orderIndex !== -1 && orderIndex !== currentIndex) {
          setCurrentIndex(orderIndex);
        }
      }
    }
  }, [id, cards, deckOrder]);
  const toggleShuffle = useCallback(() => {
    if (shuffledOrder) {
      // Unshuffle: find current card's original index
      const originalIndex = deckOrder[currentIndex];
      setShuffledOrder(null);
      setCurrentIndex(originalIndex);
    } else {
      // Shuffle: create new permutation but keep user on same card
      const indices = cards.map((_, i) => i);
      const currentOriginalIndex = currentIndex; // Since shuffledOrder was null, deckOrder[currentIndex] === currentIndex
      const newOrder = [...indices].sort(() => Math.random() - 0.5);
      const newPosition = newOrder.indexOf(currentOriginalIndex);
      setShuffledOrder(newOrder);
      setCurrentIndex(newPosition);
    }
  }, [shuffledOrder, cards, currentIndex, deckOrder]);
  const paginate = useCallback((newDirection: number) => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex >= 0 && nextIndex < deckOrder.length) {
        setDirection(newDirection);
        return nextIndex;
      }
      return prev;
    });
  }, [deckOrder.length]);
  useHotkeys('arrowright', () => paginate(1), [paginate]);
  useHotkeys('arrowleft', () => paginate(-1), [paginate]);
  useHotkeys('escape', () => navigate('/'));
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Binary className="size-12 text-primary animate-pulse" />
      </div>
    );
  }
  if (cards.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background space-y-4">
        <p className="text-muted-foreground font-mono">No architecture found in system index.</p>
        <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }
  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col selection:bg-primary/10 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-stone-100 dark:bg-stone-900/50 blur-[150px] rounded-full opacity-50" />
      </div>
      <header className="p-6 md:p-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/')}>
            <X className="size-5" />
          </Button>
          <div className="h-4 w-px bg-border/40" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-left">Logic Stream</span>
            <span className="text-sm font-bold tracking-tight">{currentIndex + 1} / {cards.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full font-mono text-[10px] tracking-widest transition-all",
              shuffledOrder && "text-primary bg-primary/10"
            )}
            onClick={toggleShuffle}
          >
            <Shuffle className={cn("size-3 mr-2", shuffledOrder && "animate-pulse")} />
            {shuffledOrder ? 'UNSHUFFLE' : 'SHUFFLE DECK'}
          </Button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 relative z-10 overflow-hidden">
        <div className="w-full max-w-4xl relative h-full flex items-center justify-center">
          <ParadoxViewer
            card={activeCard}
            direction={direction}
            isZenMode
          />
        </div>
        <div className="hidden md:flex absolute inset-y-0 left-0 items-center px-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 transition-all disabled:opacity-0"
            disabled={currentIndex === 0}
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="size-8 text-muted-foreground" />
          </Button>
        </div>
        <div className="hidden md:flex absolute inset-y-0 right-0 items-center px-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 transition-all disabled:opacity-0"
            disabled={currentIndex === cards.length - 1}
            onClick={() => paginate(1)}
          >
            <ChevronRight className="size-8 text-muted-foreground" />
          </Button>
        </div>
      </main>
      <footer className="md:hidden p-8 flex items-center justify-between z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={currentIndex === 0}
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="font-mono text-xs opacity-50 uppercase tracking-widest">
          {Math.round(((currentIndex + 1) / cards.length) * 100)}% Consumed
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          disabled={currentIndex === cards.length - 1}
          onClick={() => paginate(1)}
        >
          <ChevronRight className="size-5" />
        </Button>
      </footer>
    </div>
  );
}