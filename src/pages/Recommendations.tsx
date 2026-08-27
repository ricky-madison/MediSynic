import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOncology } from '@/context/OncologyContext';
import { generateOncoRecommendations, type OncoRecommendation } from '@/lib/oncology/recommendations';

const priorityClass: Record<OncoRecommendation['priority'], string> = {
  high: 'border-grade-4/40 bg-grade-4/10 text-grade-4',
  medium: 'border-grade-2/40 bg-grade-2/10 text-grade-2',
  low: 'border-grade-1/40 bg-grade-1/10 text-grade-1',
};

const Recommendations = () => {
  const { patient, metabolic, toxicities, oncyra } = useOncology();
  const recs = generateOncoRecommendations({ patient, metabolic, toxicities, variant: oncyra?.variant });
  const categories = ['All', ...Array.from(new Set(recs.map((r) => r.category)))];
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? recs : recs.filter((r) => r.category === filter);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Decision support"
        title="Personalised care actions"
        description="Every action is derived from your CTCAE grades, metabolic trend, regimen and TP53 profile, with the rule that produced it shown."
        actions={
          <Button variant="outline" asChild>
            <Link to="/metabolic">Log new data</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              filter === c ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <SectionCard title="Nothing to action" icon={Sparkles}>
          <p className="text-sm text-muted-foreground">
            No recommendations in this category. Keep logging metabolic values and toxicity grades to refine your plan.
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => (
            <SectionCard key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-section-title">{r.title}</h2>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {r.category}
                  </Badge>
                  <Badge variant="outline" className={priorityClass[r.priority]}>
                    {r.priority} priority
                  </Badge>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.detail}</p>
              <p className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-caption">Rule: {r.rationale}</p>
            </SectionCard>
          ))}
        </div>
      )}

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default Recommendations;
