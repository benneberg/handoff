import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Download, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { generateCardMarkdown } from '@/lib/markdown-utils';
import type { SystemCard, CardTemplate } from '@shared/types';
export function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isNew = !id;
  const [formData, setFormData] = useState<Partial<SystemCard>>({
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
  const { data: existingCard } = useQuery({
    queryKey: ['card', id],
    queryFn: () => api<SystemCard>(`/api/cards/${id}`),
    enabled: !!id,
  });
  useEffect(() => {
    if (existingCard) {
      setFormData(existingCard);
    } else if (isNew && location.state?.template) {
      const template = location.state.template as CardTemplate;
      setFormData(prev => ({ ...prev, ...template.preset }));
    }
  }, [existingCard, isNew, location.state]);
  const saveMutation = useMutation({
    mutationFn: (data: Partial<SystemCard>) => {
      return isNew
        ? api<SystemCard>('/api/cards', { method: 'POST', body: JSON.stringify(data) })
        : api<SystemCard>(`/api/cards/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success(isNew ? 'Card created' : 'Card updated');
      navigate('/');
    },
    onError: (err: Error) => toast.error(`Error saving: ${err.message}`),
  });
  const deleteMutation = useMutation({
    mutationFn: () => api(`/api/cards/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Card deleted');
      navigate('/');
    }
  });
  const handleChange = (field: keyof SystemCard, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleListAdd = (field: 'whatWorks' | 'whatDoesntWork', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
  };
  const handleListRemove = (field: 'whatWorks' | 'whatDoesntWork', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };
  const handleExportMarkdown = () => {
    const md = generateCardMarkdown(formData as SystemCard);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.projectName || 'system-card'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="rounded-full">
            <ArrowLeft className="size-4 mr-2" />
            Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportMarkdown} disabled={!formData.projectName}>
              <Download className="size-4 mr-2" />
              Markdown
            </Button>
            <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              {isNew ? 'Create Card' : 'Save Changes'}
            </Button>
          </div>
        </header>
        <main className="space-y-16">
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">Concept Definition</h2>
              <p className="text-sm text-muted-foreground">The core identity and value proposition of the system.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. Graceful Degradation"
                  value={formData.projectName}
                  onChange={e => handleChange('projectName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetUser">Target User</Label>
                <Input
                  id="targetUser"
                  placeholder="e.g. Exhausted Overachievers"
                  value={formData.targetUser}
                  onChange={e => handleChange('targetUser', e.target.value)}
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="oneLiner">One Liner</Label>
                <Input
                  id="oneLiner"
                  placeholder="A short punchy description..."
                  value={formData.oneLiner}
                  onChange={e => handleChange('oneLiner', e.target.value)}
                />
              </div>
            </div>
          </section>
          <Separator />
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">Architecture</h2>
              <p className="text-sm text-muted-foreground">How the system logic addresses the problem space.</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem">The Problem (Human Condition)</Label>
                <Textarea
                  id="problem"
                  className="min-h-[100px]"
                  placeholder="What human struggle are we modeling?"
                  value={formData.problem}
                  onChange={e => handleChange('problem', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">The Solution (System Architecture)</Label>
                <Textarea
                  id="solution"
                  className="min-h-[100px]"
                  placeholder="How does technical architecture solve it?"
                  value={formData.solution}
                  onChange={e => handleChange('solution', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coreWorkflow">Core Workflow</Label>
                <Textarea
                  id="coreWorkflow"
                  placeholder="Step-by-step logic flow..."
                  value={formData.coreWorkflow}
                  onChange={e => handleChange('coreWorkflow', e.target.value)}
                />
              </div>
            </div>
          </section>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">Strategy & Growth</h2>
              <p className="text-sm text-muted-foreground">The edge and future roadmap of this architectural concept.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="differentiation">Differentiation</Label>
                <Textarea
                  id="differentiation"
                  placeholder="What makes this system unique compared to others?"
                  value={formData.differentiation}
                  onChange={e => handleChange('differentiation', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monetization">Monetization / Sustainability</Label>
                <Textarea
                  id="monetization"
                  placeholder="How does this system capture or maintain value?"
                  value={formData.monetization}
                  onChange={e => handleChange('monetization', e.target.value)}
                />
              </div>
              <div className="col-span-full space-y-2">
                <Label htmlFor="nextExpansion">Next Expansion</Label>
                <Textarea
                  id="nextExpansion"
                  placeholder="Where does the system go next?"
                  value={formData.nextExpansion}
                  onChange={e => handleChange('nextExpansion', e.target.value)}
                />
              </div>
            </div>
          </section>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold">Execution & Readiness</h2>
            </div>
            <div className="space-y-10">
              <div className="space-y-2">
                <Label htmlFor="mvpBuildOrder">MVP Build Order</Label>
                <Textarea
                  id="mvpBuildOrder"
                  placeholder="Step 1, Step 2, Step 3..."
                  value={formData.mvpBuildOrder}
                  onChange={e => handleChange('mvpBuildOrder', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Handoff Readiness</Label>
                  <span className="font-mono text-sm">{formData.handoffReadiness || 1}/10</span>
                </div>
                <Slider
                  value={[formData.handoffReadiness || 1]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={([val]) => handleChange('handoffReadiness', val)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label>What Works</Label>
                  <Input id="works-add" placeholder="Press Enter to add..." onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleListAdd('whatWorks', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }} />
                  <div className="flex flex-wrap gap-2">
                    {formData.whatWorks?.map((item, i) => (
                      <div key={i} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                        {item}
                        <X className="size-3 cursor-pointer hover:text-destructive" onClick={() => handleListRemove('whatWorks', i)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>What Doesn't Work</Label>
                  <Input id="fails-add" placeholder="Press Enter to add..." onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleListAdd('whatDoesntWork', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }} />
                  <div className="flex flex-wrap gap-2">
                    {formData.whatDoesntWork?.map((item, i) => (
                      <div key={i} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                        {item}
                        <X className="size-3 cursor-pointer hover:text-destructive" onClick={() => handleListRemove('whatDoesntWork', i)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {!isNew && (
            <div className="pt-12 border-t border-destructive/20">
              <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5">
                <div className="space-y-1">
                  <h3 className="font-bold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">This will permanently delete this system card.</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => {
                  if (confirm('Are you sure you want to delete this card?')) deleteMutation.mutate();
                }}>
                  <Trash2 className="size-4 mr-2" />
                  Delete Card
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}