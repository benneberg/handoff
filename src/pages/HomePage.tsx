import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, RefreshCw, Info, Binary, Download, Shuffle, ChevronRight, Sparkles, Play, Maximize2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuideModal } from '@/components/modals/GuideModal';
import { api } from '@/lib/api-client';
import type { SystemCard, CardTemplate } from '@shared/types';
import { cn } from '@/lib/utils';
export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my-cards');
  const [shuffledIds, setShuffledIds] = useState<string[] | null>(null);
  const { data: cardsData, isLoading, refetch } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api<{ items: SystemCard[] }>('/api/cards'),
  });
  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api<CardTemplate[]>('/api/templates'),
  });
  const cards = cardsData?.items ?? [];
  const displayCards = shuffledIds
    ? [...cards].sort((a, b) => shuffledIds.indexOf(a.id) - shuffledIds.indexOf(b.id))
    : cards;
  const filteredCards = displayCards.filter(c =>
    c.projectName.toLowerCase().includes(search.toLowerCase()) ||
    c.oneLiner.toLowerCase().includes(search.toLowerCase())
  );
  const handleShuffle = () => {
    const ids = cards.map(c => c.id);
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    setShuffledIds(shuffled);
  };
  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "syscards_all_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-stone-200 dark:bg-stone-800 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-stone-300 dark:bg-stone-900 blur-[100px]" />
      </div>
      <ThemeToggle />
      <GuideModal open={guideOpen} onOpenChange={setGuideOpen} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                <Binary className="size-6 text-primary group-hover:rotate-12 transition-transform" />
                <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">SYSCARDS</h1>
              </div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">
                System Design for the Human Condition
              </p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-border/50 backdrop-blur-sm">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => refetch()}>
                <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleShuffle} disabled={cards.length < 2}>
                <Shuffle className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setGuideOpen(true)}>
                <Info className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className={cn("rounded-full h-8 w-8", showSearch && "bg-accent")} onClick={() => setShowSearch(!showSearch)}>
                <Search className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleExportAll} disabled={cards.length === 0}>
                <Download className="size-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
              <Button onClick={() => navigate('/deck')} variant="outline" size="sm" className="rounded-full h-8 px-4 border-primary/20 hover:border-primary/50" disabled={cards.length === 0}>
                <Play className="size-3 mr-2" /> Play Deck
              </Button>
              <Button onClick={() => navigate('/new')} size="sm" className="rounded-full h-8 px-4 shadow-sm hover:scale-105 active:scale-95 transition-all">
                <Plus className="size-4 mr-1" /> New
              </Button>
            </div>
          </header>
          {showSearch && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 relative z-10">
              <Input
                autoFocus
                placeholder="Search architecture..."
                className="bg-secondary/50 border-none rounded-2xl h-14 text-lg px-6 shadow-soft focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 relative z-10">
            <div className="flex items-center justify-between border-b border-border/40">
              <TabsList className="bg-transparent h-auto p-0 space-x-8">
                <TabsTrigger value="my-cards" className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">
                  Cards <span className="ml-2 text-xs font-mono opacity-50">({cards.length})</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent shadow-none font-bold text-muted-foreground data-[state=active]:text-foreground transition-all">
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="my-cards" className="mt-0 focus-visible:outline-none">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-44 rounded-2xl bg-secondary/30 animate-pulse border border-border/20" />
                  ))}
                </div>
              ) : filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCards.map(card => (
                    <Card
                      key={card.id}
                      className="group cursor-pointer border-none shadow-soft bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:-translate-y-1 rounded-2xl border border-border/10 relative overflow-hidden"
                    >
                      <CardHeader className="pb-4" onClick={() => navigate(`/edit/${card.id}`)}>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="font-mono text-[10px] rounded-full px-2 py-0 border-primary/20">
                            {card.handoffReadiness}/10 READY
                          </Badge>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                        <CardTitle className="text-xl font-display font-bold truncate">
                          {card.projectName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed min-h-[2.5rem]">
                          {card.oneLiner}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                          <div className="flex items-center gap-1">
                            <span className="text-green-500/70 font-bold">✓</span> {card.whatWorks.length}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-red-500/70 font-bold">✗</span> {card.whatDoesntWork.length}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-auto h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/deck/${card.id}`);
                            }}
                          >
                            <Maximize2 className="size-3 text-primary" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 md:py-32 space-y-12 animate-in fade-in zoom-in-95 duration-700">
                  <div className="space-y-4">
                    <h2 className="text-9xl md:text-[12rem] font-display font-black tracking-tighter text-foreground/[0.03] dark:text-foreground/[0.05] leading-none select-none pointer-events-none">
                      Cards 0
                    </h2>
                    <div
                      className="flex items-center justify-center gap-3 group cursor-pointer active:scale-95 transition-all"
                      onClick={() => setActiveTab('templates')}
                    >
                      <span className="text-xl md:text-2xl font-display font-medium text-muted-foreground group-hover:text-foreground transition-colors underline decoration-border/40 underline-offset-8">
                        New Templates
                      </span>
                      <Search className="size-5 text-muted-foreground group-hover:text-primary animate-pulse transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      onClick={() => navigate('/new')}
                      variant="outline"
                      className="rounded-full px-10 h-12 hover:bg-primary hover:text-primary-foreground border-border/60 hover:border-primary transition-all font-bold shadow-sm"
                    >
                      Initialize System
                    </Button>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-50">
                      Empty Index Detected
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="templates" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map(template => (
                  <Card
                    key={template.id}
                    className="border-none shadow-soft bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer group rounded-2xl border border-border/20"
                    onClick={() => navigate('/new', { state: { template } })}
                  >
                    <CardHeader>
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center mb-4 border border-border/50 group-hover:scale-110 transition-transform">
                        <Sparkles className="size-5 text-primary/60" />
                      </div>
                      <CardTitle className="text-lg font-display font-bold text-foreground">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end pt-0">
                      <Button variant="ghost" size="sm" className="group-hover:text-primary rounded-full hover:bg-background/80">
                        Deploy Pattern
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}