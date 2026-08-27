import React, { useState } from 'react';
import { Pill, ShieldAlert, X } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useOncology } from '@/context/OncologyContext';
import { DRUGS, resolveDrugs, screenInteractions, severityWeight, type DdiSeverity } from '@/lib/oncology/ddi';

const severityClass: Record<DdiSeverity, string> = {
  high: 'border-grade-4/40 bg-grade-4/10 text-grade-4',
  moderate: 'border-grade-2/40 bg-grade-2/10 text-grade-2',
  low: 'border-grade-1/40 bg-grade-1/10 text-grade-1',
};

const MedicationSafety = () => {
  const { patient, updatePatient } = useOncology();
  const meds = patient.medications ?? [];
  const [entry, setEntry] = useState('');

  const { matched, unmatched } = resolveDrugs(meds);
  const findings = screenInteractions(matched).sort(
    (a, b) => severityWeight[b.severity] - severityWeight[a.severity]
  );

  const add = (name: string) => {
    const value = name.trim();
    if (!value) return;
    if (meds.some((m) => m.toLowerCase() === value.toLowerCase())) return;
    updatePatient({ medications: [...meds, value] });
    setEntry('');
  };

  const remove = (name: string) => updatePatient({ medications: meds.filter((m) => m !== name) });

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 2 · Precision oncology"
        title="Oncology interaction screening"
        description="CYP450-aware screening across cytotoxics, TKIs, steroids, supportive care, metabolic drugs and p53 rescue compounds."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Medication list" description="Add every agent, including supportive and metabolic drugs" icon={Pill}>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              add(entry);
            }}
          >
            <Input value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="e.g. Dexamethasone" />
            <Button type="submit">Add</Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {meds.map((m) => (
              <span key={m} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm">
                {m}
                <button type="button" onClick={() => remove(m)} aria-label={`Remove ${m}`} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {meds.length === 0 && <p className="text-sm text-muted-foreground">No medications added.</p>}
          </div>

          {unmatched.length > 0 && (
            <p className="mt-4 text-caption">
              Not in the knowledge base (not screened): {unmatched.join(', ')}
            </p>
          )}

          <div className="mt-5">
            <p className="text-caption mb-2">Quick add</p>
            <div className="flex flex-wrap gap-1.5">
              {DRUGS.slice(0, 12).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => add(d.name)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          title="Interaction findings"
          description={`${findings.length} interaction${findings.length === 1 ? '' : 's'} across ${matched.length} screened agents`}
          icon={ShieldAlert}
        >
          {findings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No interactions detected between the screened agents.</p>
          ) : (
            <ul className="space-y-3">
              {findings.map((f, i) => (
                <li key={`${f.a}-${f.b}-${i}`} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {f.a} <span className="text-muted-foreground">+</span> {f.b}
                    </p>
                    <Badge variant="outline" className={severityClass[f.severity]}>
                      {f.severity} severity
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.mechanism}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {f.risks.map((r) => (
                      <span key={r} className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs">
                        {r}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary">{f.action}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Metabolic notes for your agents" description="Why these drugs matter to glucose, kidneys and muscle">
        <ul className="grid gap-3 md:grid-cols-2">
          {matched
            .filter((d) => d.metabolicNote)
            .map((d) => (
              <li key={d.id} className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm font-semibold">
                  {d.name} <span className="text-caption">· {d.class}</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{d.metabolicNote}</p>
              </li>
            ))}
        </ul>
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default MedicationSafety;
