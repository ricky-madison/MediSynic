import React, { useState } from 'react';
import { Droplets, Scale, TrendingUp, Utensils } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import MetricTile from '@/components/oncology/MetricTile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useOncology } from '@/context/OncologyContext';
import { METABOLIC_THRESHOLDS } from '@/lib/oncology/thresholds';
import { weightLossPct } from '@/lib/oncology/recommendations';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const fields = [
  { key: 'glucose', label: 'Glucose', unit: 'mg/dL' },
  { key: 'weightKg', label: 'Weight', unit: 'kg' },
  { key: 'fluidMl', label: 'Fluid intake', unit: 'mL' },
  { key: 'proteinG', label: 'Protein intake', unit: 'g' },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL' },
  { key: 'hba1c', label: 'HbA1c', unit: '%' },
] as const;

const MetabolicMonitor = () => {
  const { patient, metabolic, addMetabolic } = useOncology();
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});

  const latest = metabolic[metabolic.length - 1];
  const loss = weightLossPct(patient, metabolic);
  const proteinTarget = patient.baselineWeightKg ? Math.round(patient.baselineWeightKg * 1.2) : undefined;
  const platinum = (patient.regimen ?? '').toLowerCase().includes('cisplatin');
  const fluidTarget = platinum ? METABOLIC_THRESHOLDS.fluidIntakeCisplatinMl : METABOLIC_THRESHOLDS.fluidIntakeMinMl;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, number> = {};
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '') payload[k] = Number(v);
    });
    if (Object.keys(payload).length === 0) {
      toast({ title: 'Nothing to save', description: 'Enter at least one value.', variant: 'destructive' });
      return;
    }
    addMetabolic(payload);
    setForm({});
    toast({ title: 'Entry logged', description: 'Your onco-metabolic record has been updated.' });
  };

  const chart = metabolic.map((m) => ({
    date: m.date.slice(5),
    glucose: m.glucose ?? null,
    protein: m.proteinG ?? null,
    fluid: m.fluidMl ?? null,
  }));

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 1 · Onco-metabolic"
        title="Hyperglycaemia & cachexia monitor"
        description="Track steroid-induced hyperglycaemia, muscle wasting and renal-protective hydration across each chemotherapy cycle."
      />

      <div className="grid-cards">
        <MetricTile
          label="Glucose"
          value={latest?.glucose ?? '—'}
          unit="mg/dL"
          icon={TrendingUp}
          tone={(latest?.glucose ?? 0) >= METABOLIC_THRESHOLDS.glucoseFastingHigh ? 'warning' : 'success'}
          hint={`Fasting flag at ${METABOLIC_THRESHOLDS.glucoseFastingHigh} mg/dL`}
        />
        <MetricTile
          label="Cachexia index"
          value={`${loss.toFixed(1)}%`}
          icon={Scale}
          tone={loss >= METABOLIC_THRESHOLDS.weightLossSeverePct ? 'danger' : loss >= METABOLIC_THRESHOLDS.weightLoss6MonthPct ? 'warning' : 'success'}
          hint="Unintentional weight loss from baseline"
        />
        <MetricTile
          label="Protein intake"
          value={latest?.proteinG ?? '—'}
          unit="g"
          icon={Utensils}
          tone={proteinTarget && (latest?.proteinG ?? 0) < proteinTarget ? 'warning' : 'success'}
          hint={proteinTarget ? `Anti-cachexia target ${proteinTarget} g/day` : 'Set baseline weight to compute target'}
        />
        <MetricTile
          label="Hydration"
          value={latest?.fluidMl ?? '—'}
          unit="mL"
          icon={Droplets}
          tone={(latest?.fluidMl ?? 0) < fluidTarget ? 'warning' : 'success'}
          hint={`Nephroprotection target ${fluidTarget} mL/day`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Metabolic trend" description="Glucose, protein and fluid intake" icon={TrendingUp}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="glucose" name="Glucose (mg/dL)" stroke="hsl(var(--chart-1))" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="protein" name="Protein (g)" stroke="hsl(var(--chart-3))" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Log today" description="All values are optional" icon={Scale}>
          <form className="space-y-4" onSubmit={submit}>
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>
                  {f.label} <span className="text-muted-foreground">({f.unit})</span>
                </Label>
                <Input
                  id={f.key}
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={form[f.key] ?? ''}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Save entry
            </Button>
          </form>
        </SectionCard>
      </div>

      <SectionCard title="Longitudinal record" description="Most recent entries first">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead className="text-right">Glucose</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Fluid</TableHead>
                <TableHead className="text-right">Protein</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...metabolic].reverse().map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.date}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{m.cyclePhase ?? '—'}</TableCell>
                  <TableCell className="text-right">{m.glucose ?? '—'}</TableCell>
                  <TableCell className="text-right">{m.weightKg ?? '—'}</TableCell>
                  <TableCell className="text-right">{m.fluidMl ?? '—'}</TableCell>
                  <TableCell className="text-right">{m.proteinG ?? '—'}</TableCell>
                </TableRow>
              ))}
              {metabolic.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No entries yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default MetabolicMonitor;
