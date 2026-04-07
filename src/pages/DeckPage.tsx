import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle, Binary, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParadoxViewer } from '@/components/ParadoxViewer';
import { api } from '@/lib/api-client';
import type { SystemCard } from '@shared/types';
import { useHotkeys } from 'react-hotkeys-hook';
export function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const { data: cardsData, isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api<{ items: SystemCard[] }>('/api/cards'),
  });
  const cards = cardsData?.items ?? [];
  // Handle shuffling logic
  const deckOrder = useMemo(() => {
    const indices = cards.map((_, i) => i);
    if (isShuffled) {
      return [...indices].sort(() => Math.random() - 0.5);
    }
    return indices;
  }, [cards.length, isShuffled]);
  // If a specific ID is provided, find its index in the current order
  useEffect(() => {
    if (id && cards.length > 0) {
      const targetIndexInCards = cards.findIndex(c => c.id === id);
      const targetIndexInOrder = deckOrder.indexOf(targetIndexInCards);
      if (targetIndexInOrder !== -1) {
        setCurrentIndex(targetIndexInOrder);
      }
    }
  }, [id, cards, deckOrder]);
  const paginate = (newDirection: number) => {
    if (currentIndex + newDirection >= 0 && currentIndex + newDirection < deckOrder.length) {
      setDirection(newDirection);
      setCurrentIndex(currentIndex + newDirection);
    }
  };
  useHotkeys('arrowright', () => paginate(1));
  useHotkeys('arrowleft', () => paginate(-1));
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
  const activeCardIndex = deckOrder[currentIndex];
  const activeCard = cards[activeCardIndex];
  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col selection:bg-primary/10 relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-stone-100 dark:bg-stone-900/50 blur-[150px] rounded-full opacity-50" />
      </div>
      {/* Zen Header */}
      <header className="p-6 md:p-10 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/')}>
            <X className="size-5" />
          </Button>
          <div className="h-4 w-px bg-border/40" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Logic Stream</span>
            <span className="text-sm font-bold tracking-tight">{currentIndex + 1} / {cards.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("rounded-full font-mono text-[10px] tracking-widest", isShuffled && "text-primary bg-primary/5")}
            onClick={() => setIsShuffled(!isShuffled)}
          >
            <Shuffle className={cn("size-3 mr-2", isShuffled && "animate-pulse")} />
            {isShuffled ? 'UNSHUFFLE' : 'SHUFFLE DECK'}
          </Button>
        </div>
      </header>
      {/* Main Content Stage */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-4xl">
          <ParadoxViewer 
            card={activeCard} 
            direction={direction} 
            isZenMode 
          />
        </div>
        {/* Navigation Overlays (Desktop) */}
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
      {/* Mobile Footer Nav */}
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
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}