import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Hexagon, Diamond, Trash2, X, Loader2, Check, Send, RotateCcw, RotateCw, Eraser, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useEditorHistory } from '@/hooks/use-editor-history';
import { MarkdownPreviewModal } from '@/components/modals/MarkdownPreviewModal';
import { TransmitModal } from '@/components/modals/TransmitModal';
import type { SystemCard, CardTemplate } from '@shared/types';
const INITIAL_STATE: Partial<SystemCard> = {
  projectName: '',
  oneLiner: '',
  targetUser: '',
  problem: '',
  solution: '',
  coreWorkflow: '',
  mvpBuildOrder: '',
  differentiation: '',
  monetization: '',
  nextExpansion: '',
  whatWorks: [],
  whatDoesntWork: [],
  handoffReadiness: 5,
};
export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isNew = !id;
  const initializedRef = useRef(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [transmitOpen, setTransmitOpen] = useState(false);
  const { state: formData, push: setFormData, undo, redo, reset, canUndo, canRedo } = useEditorHistory(INITIAL_STATE);
  const { data: existingCard, isLoading: isCardLoading, isError: isLoadError } = useQuery({
    queryKey: ['card', id],
    queryFn: () => api<SystemCard>(`/api/cards/${id}`),
    enabled: !!id,
    retry: false,
  });
  useEffect(() => {
    if (initializedRef.current) return;
    if (!isNew && existingCard) {
      reset(existingCard);
      initializedRef.current = true;
    } else if (isNew) {
      const template = location.state?.template as CardTemplate | undefined;
      reset({
        ...INITIAL_STATE,
        ...(template?.preset || {})
      });
      initializedRef.current = true;
    }
  }, [existingCard, isNew, location.state?.template, reset]);
  const saveMutation = useMutation({
    mutationFn: (data: Partial<SystemCard>) => {
      const payload = { ...data, updatedAt: Date.now() };
      return isNew
        ? api<SystemCard>('/api/cards', { method: 'POST', body: JSON.stringify(payload) })
        : api<SystemCard>(`/api/cards/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success(isNew ? 'Architecture Initialized' : 'System State Updated');
      navigate('/');
    },
    onError: (err: Error) => toast.error(`Save failed: ${err.message}`),
  });
  const deleteMutation = useMutation({
    mutationFn: () => api(`/api/cards/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('System Purged');
      navigate('/');
    },
    onError: (err: Error) => toast.error(`Delete failed: ${err.message}`),
  });
  const handleChange = (field: keyof SystemCard, value: any) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleListAdd = (field: 'whatWorks' | 'whatDoesntWork', value: string) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...(formData[field] || []), value.trim()] });
  };
  const handleListRemove = (field: 'whatWorks' | 'whatDoesntWork', index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] || []).filter((_, i) => i !== index)
    });
  };

  const handleClear = () => {
    if (confirm('Reset editor to initial state?')) {
      reset(INITIAL_STATE);
    }
  };

  const hasValidProjectName = !!((formData.projectName || '').trim());
  if (id && isCardLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }
  if (id && isLoadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Failed to load system card</h2>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-background selection:bg-primary/10">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="rounded-full">
              <ArrowLeft className="size-4 mr-2" />
              Exit
            </Button>
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!canUndo} onClick={undo}>
                <RotateCcw className="size-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!canRedo} onClick={redo}>
                <RotateCw className="size-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleClear}>
                <Eraser className="size-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setTransmitOpen(true)}>
                <Send className="size-4 mr-2" /> Transmit
              </Button>
            )}
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setPreviewOpen(true)} disabled={!formData.projectName}>
              <Diamond className="size-4 mr-2" /> Preview
            </Button>
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending || !hasValidProjectName} className="rounded-full px-6">
              {saveMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Hexagon className="size-4 mr-2" />}
              Save
            </Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto space-y-20 pb-20">
          {/* Concept Definition */}
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                <Target className="size-5 text-muted-foreground" /> Concept Definition
              </h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Identity & Proposition</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">System Name</Label>
                <Input
                  className={`bg-secondary/30 border-none h-12 text-lg focus-visible:ring-primary ${!hasValidProjectName ? 'border-destructive ring-2 ring-destructive/50 focus-visible:ring-destructive' : ''}`}
                  placeholder="e.g. Graceful Degradation"
                  value={formData.projectName || ''}
                  onChange={e => handleChange('projectName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Target Subject</Label>
                <Input
                  className="bg-secondary/30 border-none h-12 text-lg focus-visible:ring-primary"
                  placeholder="e.g. Overachievers"
                  value={formData.targetUser || ''}
                  onChange={e => handleChange('targetUser', e.target.value)}
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Architectural One-Liner</Label>
                <Input
                  className="bg-secondary/30 border-none h-12 italic focus-visible:ring-primary"
                  placeholder="The core logic of this system in one sentence..."
                  value={formData.oneLiner || ''}
                  onChange={e => handleChange('oneLiner', e.target.value)}
                />
              </div>
            </div>
          </section>
          {/* Logic Engine */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                <Zap className="size-5 text-muted-foreground" /> Logic Engine
              </h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Architecture & Flow</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">The Human Condition (The Problem)</Label>
                <Textarea
                  className="min-h-[120px] bg-secondary/30 border-none text-lg resize-none focus-visible:ring-primary"
                  placeholder="Describe the human struggle..."
                  value={formData.problem || ''}
                  onChange={e => handleChange('problem', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">The System Architecture (The Solution)</Label>
                <Textarea
                  className="min-h-[120px] bg-secondary/30 border-none text-lg resize-none focus-visible:ring-primary"
                  placeholder="How does logic solve the problem?"
                  value={formData.solution || ''}
                  onChange={e => handleChange('solution', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Core Workflow Logic</Label>
                <Textarea
                  className="bg-secondary/30 border-none font-mono text-sm min-h-[100px] focus-visible:ring-primary"
                  placeholder="Input -> Reasoning -> Action -> Loop"
                  value={formData.coreWorkflow || ''}
                  onChange={e => handleChange('coreWorkflow', e.target.value)}
                />
              </div>
            </div>
          </section>
          {/* Strategic Context */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-muted-foreground" /> Strategic Context
              </h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Market & Growth Strategy</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">MVP Build Order</Label>
                <Textarea
                  className="bg-secondary/30 border-none min-h-[100px] focus-visible:ring-primary"
                  placeholder="1. Build X, 2. Test Y..."
                  value={formData.mvpBuildOrder || ''}
                  onChange={e => handleChange('mvpBuildOrder', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Differentiation</Label>
                <Textarea
                  className="bg-secondary/30 border-none min-h-[100px] focus-visible:ring-primary"
                  placeholder="Why is this system unique?"
                  value={formData.differentiation || ''}
                  onChange={e => handleChange('differentiation', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Sustainability / Monetization</Label>
                <Input
                  className="bg-secondary/30 border-none h-12 focus-visible:ring-primary"
                  placeholder="How does this scale or sustain?"
                  value={formData.monetization || ''}
                  onChange={e => handleChange('monetization', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Next Expansion</Label>
                <Input
                  className="bg-secondary/30 border-none h-12 focus-visible:ring-primary"
                  placeholder="Future V2 capabilities..."
                  value={formData.nextExpansion || ''}
                  onChange={e => handleChange('nextExpansion', e.target.value)}
                />
              </div>
            </div>
          </section>
          {/* Execution State */}
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground flex items-center gap-2">
                <Check className="size-5 text-muted-foreground" /> Execution State
              </h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Readiness & Validation</p>
            </div>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs uppercase font-mono text-muted-foreground">Readiness Score</Label>
                  <span className="font-mono text-sm font-bold">{formData.handoffReadiness || 1}/10</span>
                </div>
                <Slider
                  value={[formData.handoffReadiness || 1]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([val]) => handleChange('handoffReadiness', val)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-mono text-green-600 dark:text-green-400">✓ What Works Well</Label>
                  <Input
                    className="bg-secondary/30 border-none focus-visible:ring-green-500/50"
                    placeholder="Add operational success..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleListAdd('whatWorks', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {(formData.whatWorks || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-xs font-medium border border-green-500/20">
                        <Check className="size-3" />
                        {item}
                        <X className="size-3 cursor-pointer hover:text-destructive" onClick={() => handleListRemove('whatWorks', i)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs uppercase font-mono text-red-600 dark:text-red-400">✗ System Failures</Label>
                  <Input
                    className="bg-secondary/30 border-none focus-visible:ring-red-500/50"
                    placeholder="Add known bugs/limitations..."
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleListAdd('whatDoesntWork', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {(formData.whatDoesntWork || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-red-500/10 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-full text-xs font-medium border border-red-500/20">
                        <X className="size-3" />
                        {item}
                        <X className="size-3 cursor-pointer hover:text-foreground" onClick={() => handleListRemove('whatDoesntWork', i)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {!isNew && (
            <div className="pt-20">
              <div className="flex items-center justify-between p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                <div className="space-y-1">
                  <h3 className="font-bold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Irreversible system deletion.</p>
                </div>
                <Button variant="destructive" size="sm" className="rounded-full" onClick={() => {
                  if (confirm('Are you sure you want to delete this architecture?')) deleteMutation.mutate();
                }}>
                  <Trash2 className="size-4 mr-2" />
                  Purge Card
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      <MarkdownPreviewModal
        card={formData as SystemCard}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
      {formData && !isNew && (
        <TransmitModal
          card={formData as SystemCard}
          open={transmitOpen}
          onOpenChange={setTransmitOpen}
        />
      )}
    </div>
  );
}