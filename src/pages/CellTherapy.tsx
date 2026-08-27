import React, { useState } from 'react';
import { Activity, Brain, HeartPulse, Thermometer } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import MetricTile from '@/components/oncology/MetricTile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOncology } from '@/context/OncologyContext';
import { CRS_THRESHOLDS, ICE_THRESHOLDS } from '@/lib/oncology/thresholds';

const iceItems = [
  { key: 'orientation', label: 'Orientation (year, month, city, hospital)', max: 4 },
  { key: 'naming', label: 'Naming three objects', max: 3 },
  { key: 'commands', label: 'Following simple commands', max: 1 },
  { key: 'writing', label: 'Writing a standard sentence', max: 1 },
  { key: 'attention', label: 'Attention (count back from 100 by 10)', max: 1 },
] as const;

const icansGrade = (score: number) => {
  if (score >= ICE_THRESHOLDS.grade1Min) return { grade: 0, label: 'No ICANS' };
  if (score >= ICE_THRESHOLDS.grade2Min + 4) return { grade: 1, label: 'ICANS grade 1' };
  if (score >= ICE_THRESHOLDS.grade2Min) return { grade: 2, label: 'ICANS grade 2' };
  if (score >= ICE_THRESHOLDS.grade3Min) return { grade: 3, label: 'ICANS grade 3' };
  return { grade: 4, label: 'ICANS grade 4 — urgent' };
};

const CellTherapy = () => {
  const { crs, ice, addCrs, addIce } = useOncology();
  const { toast } = useToast();
  const [labs, setLabs] = useState<Record<string, string>>({});
  const [iceForm, setIceForm] = useState<Record<string, number>>({
    orientation: 4,
    naming: 3,
    commands: 1,
    writing: 1,
    attention: 1,
  });

  const latestCrs = crs[crs.length - 1];
  const latestIce = ice[ice.length - 1];
  const iceScore = Object.values(iceForm).reduce((a, b) => a + b, 0);
  const grading = icansGrade(iceScore);

  const crsFlags = [
    latestCrs?.crp !== undefined && latestCrs.crp >= CRS_THRESHOLDS.crpEscalation && 'CRP at escalation threshold',
    latestCrs?.ferritin !== undefined && latestCrs.ferritin >= CRS_THRESHOLDS.ferritinWatch && 'Ferritin rising',
    latestCrs?.il6 !== undefined && latestCrs.il6 >= CRS_THRESHOLDS.il6Escalation && 'IL-6 above escalation threshold',
    latestCrs?.tempC !== undefined && latestCrs.tempC >= CRS_THRESHOLDS.tempFeverC && 'Fever present',
  ].filter(Boolean) as string[];

  const saveLabs = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, number> = {};
    Object.entries(labs).forEach(([k, v]) => {
      if (v !== '') payload[k] = Number(v);
    });
    if (!Object.keys(payload).length) return;
    addCrs(payload);
    setLabs({});
    toast({ title: 'Cytokine panel logged' });
  };

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 3 · Cell & gene therapy"
        title="CRS and ICANS surveillance"
        description="Post-infusion monitoring for CAR-T and gene-editing patients: cytokine release markers, ICE neuro-assessment and off-target signals."
      />

      <div className="grid-cards">
        <MetricTile label="CRP" value={latestCrs?.crp ?? '—'} unit="mg/L" icon={Activity} tone={(latestCrs?.crp ?? 0) >= CRS_THRESHOLDS.crpWatch ? 'warning' : 'success'} hint={`Escalate ≥ ${CRS_THRESHOLDS.crpEscalation}`} />
        <MetricTile label="Ferritin" value={latestCrs?.ferritin ?? '—'} unit="ng/mL" icon={Activity} tone={(latestCrs?.ferritin ?? 0) >= CRS_THRESHOLDS.ferritinWatch ? 'warning' : 'success'} hint={`Watch ≥ ${CRS_THRESHOLDS.ferritinWatch}`} />
        <MetricTile label="IL-6" value={latestCrs?.il6 ?? '—'} unit="pg/mL" icon={Thermometer} tone={(latestCrs?.il6 ?? 0) >= CRS_THRESHOLDS.il6Escalation ? 'danger' : 'success'} hint={`Escalate ≥ ${CRS_THRESHOLDS.il6Escalation}`} />
        <MetricTile label="Latest ICE score" value={latestIce ? Object.values({ ...latestIce, id: 0, date: 0 }).length && latestIce.orientation + latestIce.naming + latestIce.commands + latestIce.writing + latestIce.attention : '—'} unit={`/ ${ICE_THRESHOLDS.maxScore}`} icon={Brain} hint="10 = normal neurocognition" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Cytokine release panel" description="Log labs drawn after infusion" icon={Activity}>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={saveLabs}>
            {[
              { key: 'crp', label: 'CRP (mg/L)' },
              { key: 'ferritin', label: 'Ferritin (ng/mL)' },
              { key: 'il6', label: 'IL-6 (pg/mL)' },
              { key: 'ldh', label: 'LDH (U/L)' },
              { key: 'tempC', label: 'Temperature (°C)' },
            ].map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} type="number" step="any" value={labs[f.key] ?? ''} onChange={(e) => setLabs((s) => ({ ...s, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full">Save panel</Button>
            </div>
          </form>

          {crsFlags.length > 0 && (
            <ul className="mt-4 space-y-2">
              {crsFlags.map((f) => (
                <li key={f} className="rounded-lg border border-grade-3/40 bg-grade-3/10 p-3 text-sm font-medium text-grade-3">
                  {f} — discuss tocilizumab eligibility with your team.
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="ICE assessment" description="Immune effector cell-associated encephalopathy score" icon={Brain}>
          <div className="space-y-3">
            {iceItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <p className="text-sm">{item.label}</p>
                <Input
                  type="number"
                  min={0}
                  max={item.max}
                  value={iceForm[item.key]}
                  onChange={(e) =>
                    setIceForm((s) => ({ ...s, [item.key]: Math.max(0, Math.min(item.max, Number(e.target.value) || 0)) }))
                  }
                  className="w-20"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-semibold">ICE score {iceScore} / {ICE_THRESHOLDS.maxScore}</p>
              <p className="text-caption">{grading.label}</p>
            </div>
            <Button
              onClick={() => {
                addIce(iceForm as never);
                toast({ title: `ICE score ${iceScore} saved`, description: grading.label });
              }}
            >
              Save assessment
            </Button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Oncetra ECG & HRV link" description="Continuous cardiac monitoring from the Oncetra device" icon={HeartPulse}>
        <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
          <p className="text-sm text-muted-foreground">
            Oncetra streams ECG and heart-rate-variability data for QT surveillance during infusion and nadir phases.
            Connect a device to overlay cardiac signals on this timeline.
          </p>
          <Button variant="outline" disabled>
            Connect Oncetra device (coming soon)
          </Button>
        </div>
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default CellTherapy;
