import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, RefreshCw, FileText, Layout, ChevronRight, Binary } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api-client';
import type { SystemCard, CardTemplate } from '@shared/types';
import { cn } from '@/lib/utils';
export function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: cardsData, isLoading, refetch } = useQuery({
    queryKey: ['cards'],
    queryFn: () => api<{ items: SystemCard[] }>('/api/cards'),
  });
  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api<CardTemplate[]>('/api/templates'),
  });
  const cards = cardsData?.items ?? [];
  const filteredCards = cards.filter(c => 
    c.projectName.toLowerCase().includes(search.toLowerCase()) || 
    c.oneLiner.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-stone-200 dark:bg-stone-800 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-stone-300 dark:bg-stone-900 blur-[100px]" />
      </div>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Binary className="size-6 text-primary" />
                <h1 className="text-3xl font-display font-bold tracking-tight">SYSCARDS</h1>
              </div>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">
                System Design for the Human Condition
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search architecture..." 
                  className="pl-9 bg-secondary/50 border-none rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button onClick={() => navigate('/new')} className="rounded-full shadow-lg">
                <Plus className="size-4 mr-2" />
                New Card
              </Button>
            </div>
          </header>
          <Tabs defaultValue="my-cards" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="bg-secondary/50 p-1 rounded-full border-none">
                <TabsTrigger value="my-cards" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  My Cards
                </TabsTrigger>
                <TabsTrigger value="templates" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Templates
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground">
                <RefreshCw className={cn("size-4 mr-2", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
            <TabsContent value="my-cards" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 rounded-xl bg-secondary/30 animate-pulse" />
                  ))}
                </div>
              ) : filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCards.map(card => (
                    <Card 
                      key={card.id} 
                      className="group cursor-pointer border-none shadow-soft bg-card/60 backdrop-blur-md hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      onClick={() => navigate(`/edit/${card.id}`)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="font-mono text-[10px] rounded-full px-2 py-0">
                            READINESS {card.handoffReadiness}/10
                          </Badge>
                          <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                        <CardTitle className="text-xl font-display font-bold truncate">
                          {card.projectName}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                          {card.oneLiner}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {card.whatWorks.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-[9px] uppercase tracking-tighter font-medium px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="inline-flex items-center justify-center size-12 rounded-full bg-secondary text-muted-foreground">
                    <FileText className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-medium">No cards found</p>
                    <p className="text-sm text-muted-foreground">Start by creating a new system card or browsing templates.</p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map(template => (
                  <Card 
                    key={template.id} 
                    className="border-none shadow-soft bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => navigate('/new', { state: { template } })}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Layout className="size-4" />
                        <span className="text-[10px] font-mono uppercase tracking-widest">Preset Architecture</span>
                      </div>
                      <CardTitle className="text-lg font-display font-bold">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end">
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Use Template
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