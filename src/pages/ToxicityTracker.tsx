import React, { useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import GradeBadge from '@/components/oncology/GradeBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useOncology } from '@/context/OncologyContext';
import { CTCAE_TERMS, GRADE_LABELS, worstGrade, type CtcaeGrade } from '@/lib/oncology/ctcae';
import { ECOG_SCALE } from '@/lib/oncology/cycle';

const ToxicityTracker = () => {
  const { toxicities, addToxicity, patient, updatePatient } = useOncology();
  const { toast } = useToast();
  const [termId, setTermId] = useState(CTCAE_TERMS[0].id);
  const [grade, setGrade] = useState<CtcaeGrade>(1);
  const [note, setNote] = useState('');

  const term = CTCAE_TERMS.find((t) => t.id === termId)!;
  const escalate = grade >= term.escalateAt;

  const byCategory = useMemo(() => {
    const map = new Map<string, typeof CTCAE_TERMS>();
    CTCAE_TERMS.forEach((t) => {
      map.set(t.category, [...(map.get(t.category) ?? []), t]);
    });
    return [...map.entries()];
  }, []);

  const submit = () => {
    addToxicity(termId, grade, note || undefined);
    setNote('');
    toast({
      title: `${term.label} logged at grade ${grade}`,
      description: escalate ? 'This grade meets the escalation threshold — contact your care team.' : 'Recorded in your toxicity timeline.',
      variant: escalate ? 'destructive' : 'default',
    });
  };

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 2 · Precision oncology"
        title="CTCAE v5.0 toxicity grading"
        description="Grade treatment side effects the way your oncology team does, so escalation happens before the next cycle."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Grade a side effect" icon={ClipboardList}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Toxicity term</Label>
              <Select value={termId} onValueChange={(v) => setTermId(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {byCategory.map(([cat, terms]) => (
                    <React.Fragment key={cat}>
                      <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {cat}
                      </div>
                      {terms.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Grade</Label>
              <Select value={String(grade)} onValueChange={(v) => setGrade(Number(v) as CtcaeGrade)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {([0, 1, 2, 3, 4] as CtcaeGrade[]).map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      {GRADE_LABELS[g]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{term.label}</p>
              <GradeBadge grade={grade} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{term.grades[grade]}</p>
            {escalate && (
              <p className="mt-3 flex items-start gap-2 text-sm font-medium text-grade-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Escalation threshold for {term.label} is grade {term.escalateAt}. Contact your oncology team.
              </p>
            )}
          </div>

          <div className="mt-4 space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Timing, triggers, what helped…" />
          </div>

          <Button className="mt-4" onClick={submit}>
            Log toxicity
          </Button>
        </SectionCard>

        <SectionCard title="Performance status" description="ECOG replaces a generic wellness score" icon={AlertTriangle}>
          <div className="space-y-2">
            {ECOG_SCALE.filter((e) => e.score < 5).map((e) => (
              <button
                key={e.score}
                type="button"
                onClick={() => updatePatient({ ecog: e.score })}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  patient.ecog === e.score ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <p className="text-sm font-semibold">
                  ECOG {e.score} · {e.label}
                </p>
                <p className="text-caption">{e.description}</p>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Toxicity timeline"
        description={`Worst recent grade: ${worstGrade(toxicities.slice(0, 10))}`}
      >
        {toxicities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing logged yet.</p>
        ) : (
          <ul className="space-y-3">
            {toxicities.map((t) => {
              const meta = CTCAE_TERMS.find((c) => c.id === t.termId);
              return (
                <li key={t.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{meta?.label ?? t.termId}</p>
                      <span className="text-caption capitalize">{t.cyclePhase ?? ''}</span>
                    </div>
                    <p className="text-caption">{t.date}</p>
                    {t.note && <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>}
                  </div>
                  <GradeBadge grade={t.grade} />
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default ToxicityTracker;
