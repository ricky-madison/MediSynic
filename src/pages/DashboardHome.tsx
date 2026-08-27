import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Beaker, Droplets, Dna, HeartPulse, Scale, TrendingUp } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import MetricTile from '@/components/oncology/MetricTile';
import GradeBadge from '@/components/oncology/GradeBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOncology } from '@/context/OncologyContext';
import { CTCAE_TERMS, worstGrade } from '@/lib/oncology/ctcae';
import { CYCLE_PHASES, ECOG_SCALE, phaseMeta } from '@/lib/oncology/cycle';
import { METABOLIC_THRESHOLDS, TUMOR_MARKER_REFERENCE, MARKER_RISE_ALERT_PCT } from '@/lib/oncology/thresholds';
import { profileForVariant, riskLevelClass } from '@/lib/oncology/p53';
import { generateOncoRecommendations, weightLossPct } from '@/lib/oncology/recommendations';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const DashboardHome = () => {
  const { patient, metabolic, toxicities, markers, oncyra } = useOncology();
  const p53 = profileForVariant(oncyra?.variant ?? null);
  const phase = phaseMeta(patient.cyclePhase);

  const latest = metabolic[metabolic.length - 1];
  const loss = weightLossPct(patient, metabolic);
  const recs = generateOncoRecommendations({ patient, metabolic, toxicities, variant: oncyra?.variant });
  const highPriority = recs.filter((r) => r.priority === 'high');
  const topGrade = worstGrade(toxicities.slice(0, 8));

  const chartData = metabolic.map((m) => ({
    date: m.date.slice(5),
    glucose: m.glucose ?? null,
    weight: m.weightKg ?? null,
  }));

  const markerAlerts = Object.keys(TUMOR_MARKER_REFERENCE)
    .map((key) => {
      const series = markers.filter((m) => m.marker === key).sort((a, b) => a.date.localeCompare(b.date));
      if (series.length < 2) return null;
      const prev = series[series.length - 2].value;
      const curr = series[series.length - 1].value;
      const change = ((curr - prev) / prev) * 100;
      if (change < MARKER_RISE_ALERT_PCT) return null;
      return { key, curr, change };
    })
    .filter(Boolean) as { key: string; curr: number; change: number }[];

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow={`Cycle ${patient.cycleNumber ?? 1} · ${phase.label}`}
        title={`Surveillance overview${patient.name ? ` — ${patient.name}` : ''}`}
        description={
          patient.indication
            ? `${patient.indication}${patient.stage ? `, stage ${patient.stage}` : ''} · ${patient.regimen ?? 'Regimen not set'}`
            : 'Complete the oncology intake to activate mutation-aware surveillance.'
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/oncyra">
                <Dna className="mr-2 h-4 w-4" /> Oncyra import
              </Link>
            </Button>
            <Button asChild>
              <Link to="/toxicity">Log toxicity</Link>
            </Button>
          </>
        }
      />

      {/* Cycle phase strip */}
      <SectionCard title="Chemotherapy cycle phase" description={phase.focus} icon={Activity}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CYCLE_PHASES.map((p) => {
            const active = p.id === patient.cyclePhase;
            return (
              <div
                key={p.id}
                className={`rounded-lg border p-4 transition-colors ${
                  active ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{p.label}</p>
                  <span className="text-caption">{p.window}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {p.watch.map((w) => (
                    <li key={w} className="text-caption">
                      · {w}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Key metrics */}
      <div className="grid-cards">
        <MetricTile
          label="Latest glucose"
          value={latest?.glucose ?? '—'}
          unit="mg/dL"
          icon={TrendingUp}
          tone={latest?.glucose && latest.glucose >= METABOLIC_THRESHOLDS.glucoseFastingHigh ? 'warning' : 'success'}
          hint={patient.onSteroids ? `${patient.steroidAgent ?? 'Steroid'} on board` : 'No steroid exposure logged'}
        />
        <MetricTile
          label="Weight change"
          value={`${loss > 0 ? '−' : '+'}${Math.abs(loss).toFixed(1)}`}
          unit="%"
          icon={Scale}
          tone={loss >= METABOLIC_THRESHOLDS.weightLossSeverePct ? 'danger' : loss >= METABOLIC_THRESHOLDS.weightLoss6MonthPct ? 'warning' : 'success'}
          hint={`Baseline ${patient.baselineWeightKg ?? '—'} kg · cachexia flag at ${METABOLIC_THRESHOLDS.weightLoss6MonthPct}%`}
        />
        <MetricTile
          label="ECOG status"
          value={patient.ecog ?? '—'}
          icon={HeartPulse}
          tone={(patient.ecog ?? 0) >= 2 ? 'warning' : 'success'}
          hint={ECOG_SCALE.find((e) => e.score === patient.ecog)?.label ?? 'Not recorded'}
        />
        <MetricTile
          label="Fluid intake"
          value={latest?.fluidMl ?? '—'}
          unit="mL"
          icon={Droplets}
          tone={(latest?.fluidMl ?? 0) < METABOLIC_THRESHOLDS.fluidIntakeMinMl ? 'warning' : 'success'}
          hint="Nephrotoxicity prevention target 2000 mL/day"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Onco-metabolic trend"
            description="Glucose and body weight across the current cycle"
            icon={TrendingUp}
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/metabolic">Open monitor</Link>
              </Button>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="glucose" name="Glucose (mg/dL)" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="weight" name="Weight (kg)" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard
            title="Priority actions"
            description="Generated from your toxicity grades, metabolic trend and TP53 profile"
            icon={AlertTriangle}
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/recommendations">See all {recs.length}</Link>
              </Button>
            }
          >
            {highPriority.length === 0 ? (
              <p className="text-sm text-muted-foreground">No high-priority actions right now. Keep logging daily.</p>
            ) : (
              <ul className="space-y-3">
                {highPriority.slice(0, 4).map((r) => (
                  <li key={r.id} className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <Badge variant="outline" className="shrink-0 border-grade-4/40 bg-grade-4/10 text-grade-4">
                        {r.category}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.detail}</p>
                    <p className="mt-2 text-caption">Why: {r.rationale}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="TP53 profile" description={p53.classification} icon={Dna}>
            <p className="text-sm font-semibold text-primary">{p53.variant}</p>
            <p className="mt-1 text-sm text-muted-foreground">{p53.summary}</p>
            {p53.risks.length > 0 && (
              <ul className="mt-4 space-y-2">
                {p53.risks.map((r) => (
                  <li key={r.domain} className="flex items-start gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${riskLevelClass(r.level)}`}>
                      {r.domain}
                    </span>
                    <span className="text-caption flex-1">{r.rationale}</span>
                  </li>
                ))}
              </ul>
            )}
            {!oncyra && (
              <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                <Link to="/oncyra">Import Oncyra export</Link>
              </Button>
            )}
          </SectionCard>

          <SectionCard title="Recent toxicity" description="CTCAE v5.0 grades" icon={AlertTriangle}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Worst recent grade</span>
              <GradeBadge grade={topGrade} />
            </div>
            <ul className="space-y-2">
              {toxicities.slice(0, 5).map((t) => {
                const term = CTCAE_TERMS.find((c) => c.id === t.termId);
                return (
                  <li key={t.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{term?.label ?? t.termId}</p>
                      <p className="text-caption">{t.date}</p>
                    </div>
                    <GradeBadge grade={t.grade} />
                  </li>
                );
              })}
              {toxicities.length === 0 && <p className="text-sm text-muted-foreground">Nothing logged yet.</p>}
            </ul>
          </SectionCard>

          <SectionCard title="Tumour marker alerts" description={`Rise ≥ ${MARKER_RISE_ALERT_PCT}% between results`} icon={Beaker}>
            {markerAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No significant marker rise detected.</p>
            ) : (
              <ul className="space-y-2">
                {markerAlerts.map((m) => (
                  <li key={m.key} className="flex items-center justify-between rounded-lg border border-grade-3/40 bg-grade-3/10 p-3">
                    <div>
                      <p className="text-sm font-medium">{TUMOR_MARKER_REFERENCE[m.key].label}</p>
                      <p className="text-caption">
                        {m.curr} {TUMOR_MARKER_REFERENCE[m.key].unit}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-grade-3">+{m.change.toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="ghost" size="sm" className="mt-3 w-full" asChild>
              <Link to="/markers">Open marker log</Link>
            </Button>
          </SectionCard>
        </div>
      </div>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default DashboardHome;
