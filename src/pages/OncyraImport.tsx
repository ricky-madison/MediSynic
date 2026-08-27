import React, { useState } from 'react';
import { Dna, Download, Upload } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useOncology } from '@/context/OncologyContext';
import { ONCYRA_SAMPLE, parseOncyraJson } from '@/lib/oncology/oncyra';
import { profileForVariant, riskLevelClass } from '@/lib/oncology/p53';

const OncyraImportPage = () => {
  const { oncyra, setOncyra, exportRecord } = useOncology();
  const { toast } = useToast();
  const [raw, setRaw] = useState('');
  const [error, setError] = useState<string | null>(null);

  const profile = profileForVariant(oncyra?.variant ?? null);

  const handleImport = (text: string) => {
    const { data, error: err } = parseOncyraJson(text);
    if (err || !data) {
      setError(err ?? 'Unknown parsing error.');
      return;
    }
    setError(null);
    setOncyra(data);
    toast({ title: `Imported ${data.gene} ${data.variant}`, description: `${data.candidates.length} rescue candidates linked.` });
  };

  const downloadRecord = () => {
    const blob = new Blob([exportRecord()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medisynic-longitudinal-record.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Tier 3 · Ecosystem"
        title="Oncyra mutation import"
        description="Bring your Oncyra TP53 rescue prediction into MediSynic so surveillance, nutrition and interaction screening become mutation-aware."
        actions={
          <Button variant="outline" onClick={downloadRecord}>
            <Download className="mr-2 h-4 w-4" /> Export record
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Paste Oncyra export" description="Accepts the Oncyra JSON export or any compatible variant payload" icon={Upload}>
          <Textarea
            rows={12}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder='{ "gene": "TP53", "variant": "p.Y220C", "candidates": [...] }'
            className="font-mono text-xs"
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => handleImport(raw)}>Import</Button>
            <Button
              variant="outline"
              onClick={() => {
                const sample = JSON.stringify(ONCYRA_SAMPLE, null, 2);
                setRaw(sample);
                handleImport(sample);
              }}
            >
              Load sample (Y220C)
            </Button>
            {oncyra && (
              <Button variant="ghost" onClick={() => setOncyra(null)}>
                Clear
              </Button>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Mutation-aware profile" description={profile.classification} icon={Dna}>
          <p className="text-lg font-semibold text-primary">{profile.variant}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.summary}</p>

          {profile.risks.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">Metabolic risk domains</p>
              {profile.risks.map((r) => (
                <div key={r.domain} className="rounded-lg border border-border p-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${riskLevelClass(r.level)}`}>
                    {r.domain} · {r.level}
                  </span>
                  <p className="mt-1.5 text-sm text-muted-foreground">{r.rationale}</p>
                </div>
              ))}
            </div>
          )}

          {oncyra && oncyra.candidates.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold">Oncyra rescue candidates</p>
              <ul className="mt-2 space-y-2">
                {oncyra.candidates.map((c) => (
                  <li key={c.compound} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{c.compound}</p>
                      {c.score !== undefined && (
                        <span className="text-sm font-semibold text-primary">{(c.score * 100).toFixed(0)}%</span>
                      )}
                    </div>
                    {c.mechanism && <p className="text-caption">{c.mechanism}</p>}
                    {c.evidence && <p className="text-caption">Evidence: {c.evidence}</p>}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-caption">
                Screened for interactions on the medication page when added to your list.
              </p>
            </div>
          )}
        </SectionCard>
      </div>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default OncyraImportPage;
