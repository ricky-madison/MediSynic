import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOncology, type OncoPatient } from '@/context/OncologyContext';
import { CYCLE_PHASES, ECOG_SCALE, type CyclePhase } from '@/lib/oncology/cycle';

const Form = () => {
  const { patient, updatePatient } = useOncology();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<OncoPatient>(patient);

  const set = (patch: Partial<OncoPatient>) => setDraft((d) => ({ ...d, ...patch }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(draft);
    toast({ title: 'Oncology profile saved', description: 'Surveillance thresholds have been recalculated.' });
    navigate('/dashboard');
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Onboarding"
        title="Oncology intake"
        description="Diagnosis, regimen and cycle position drive every threshold, recommendation and interaction check in MediSynic."
      />

      <form onSubmit={submit} className="space-y-6">
        <SectionCard title="Patient" icon={ClipboardList}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={draft.name ?? ''} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" value={draft.age ?? ''} onChange={(e) => set({ age: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Baseline weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="any"
                value={draft.baselineWeightKg ?? ''}
                onChange={(e) => set({ baselineWeightKg: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={draft.heightCm ?? ''} onChange={(e) => set({ heightCm: Number(e.target.value) })} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Diagnosis & regimen">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="indication">Primary indication</Label>
              <Input id="indication" value={draft.indication ?? ''} onChange={(e) => set({ indication: e.target.value })} placeholder="e.g. Non-small cell lung cancer" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stage">Stage</Label>
              <Input id="stage" value={draft.stage ?? ''} onChange={(e) => set({ stage: e.target.value })} placeholder="e.g. IIIB" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="regimen">Current regimen</Label>
              <Input id="regimen" value={draft.regimen ?? ''} onChange={(e) => set({ regimen: e.target.value })} placeholder="e.g. Carboplatin + paclitaxel" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cycle">Cycle number</Label>
              <Input id="cycle" type="number" min={1} value={draft.cycleNumber ?? ''} onChange={(e) => set({ cycleNumber: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label>Cycle phase</Label>
              <Select value={draft.cyclePhase ?? 'premedication'} onValueChange={(v) => set({ cyclePhase: v as CyclePhase })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CYCLE_PHASES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label} · {p.window}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Functional status & steroids">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>ECOG performance status</Label>
              <Select value={String(draft.ecog ?? 0)} onValueChange={(v) => set({ ecog: Number(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ECOG_SCALE.filter((e) => e.score < 5).map((e) => (
                    <SelectItem key={e.score} value={String(e.score)}>
                      {e.score} · {e.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="steroid">Steroid agent</Label>
              <Input id="steroid" value={draft.steroidAgent ?? ''} onChange={(e) => set({ steroidAgent: e.target.value })} placeholder="e.g. Dexamethasone" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Currently on corticosteroids</p>
                <p className="text-caption">Activates the steroid hyperglycaemia curve in recommendations</p>
              </div>
              <Switch checked={!!draft.onSteroids} onCheckedChange={(v) => set({ onSteroids: v })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">Cell or gene therapy patient</p>
                <p className="text-caption">Enables CRS and ICANS surveillance modules</p>
              </div>
              <Switch checked={!!draft.cellTherapy} onCheckedChange={(v) => set({ cellTherapy: v })} />
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit">Save profile</Button>
        </div>
      </form>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default Form;
