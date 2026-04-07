import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Hexagon, Diamond, Trash2, X, Loader2, Check, Send, RotateCcw, RotateCw, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useEditorHistory } from '@/hooks/use-editor-history';
import { MarkdownPreviewModal } from '@/components/modals/MarkdownPreviewModal';
import { TransmitModal } from '@/components/modals/TransmitModal';
import type { SystemCard, CardTemplate } from '@shared/types';
export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isNew = !id;
  const initializedRef = useRef(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [transmitOpen, setTransmitOpen] = useState(false);
  const { state: formData, push: setFormData, undo, redo, reset, canUndo, canRedo } = useEditorHistory({
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
  });
  const { data: existingCard, isLoading: isCardLoading } = useQuery({
    queryKey: ['card', id],
    queryFn: () => api<SystemCard>(`/api/cards/${id}`),
    enabled: !!id,
  });
  useEffect(() => {
    // Only initialize once to prevent reset-loops during typing
    if (initializedRef.current) return;
    if (existingCard) {
      reset(existingCard);
      initializedRef.current = true;
    } else if (isNew) {
      if (location.state?.template) {
        const template = location.state.template as CardTemplate;
        reset({
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
          ...template.preset 
        });
      }
      initializedRef.current = true;
    }
  }, [existingCard, isNew, location.state, reset]);
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
    onError: (err: Error) => toast.error(`Contention Detected: ${err.message}`),
  });
  const deleteMutation = useMutation({
    mutationFn: () => api(`/api/cards/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('System Purged');
      navigate('/');
    }
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
      reset({
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
      });
    }
  };
  if (id && isCardLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
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
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending || !formData.projectName} className="rounded-full px-6">
              {saveMutation.isPending ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Hexagon className="size-4 mr-2" />}
              {isNew ? 'Initialize' : 'Save'}
            </Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto space-y-20 pb-20">
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">Concept Definition</h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Identity & Proposition</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">System Name</Label>
                <Input
                  className="bg-secondary/30 border-none h-12 text-lg focus-visible:ring-primary"
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
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">Logic Engine</h2>
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-tighter">Architecture & Flow</p>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">The Human Condition (The Problem)</Label>
                <Textarea
                  className="min-h-[120px] bg-secondary/30 border-none text-lg resize-none"
                  placeholder="Describe the human struggle..."
                  value={formData.problem || ''}
                  onChange={e => handleChange('problem', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">The System Architecture (The Solution)</Label>
                <Textarea
                  className="min-h-[120px] bg-secondary/30 border-none text-lg resize-none"
                  placeholder="How does logic solve the problem?"
                  value={formData.solution || ''}
                  onChange={e => handleChange('solution', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-mono text-muted-foreground">Core Workflow Logic</Label>
                <Textarea
                  className="bg-secondary/30 border-none font-mono text-sm min-h-[100px]"
                  placeholder="Input -> Reasoning -> Action -> Loop"
                  value={formData.coreWorkflow || ''}
                  onChange={e => handleChange('coreWorkflow', e.target.value)}
                />
              </div>
            </div>
          </section>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">Execution State</h2>
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
                    className="bg-secondary/30 border-none" 
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
                    className="bg-secondary/30 border-none" 
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