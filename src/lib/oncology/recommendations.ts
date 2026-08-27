import type { MetabolicLog, OncoPatient } from '@/context/OncologyContext';
import type { ToxicityEntry } from '@/lib/oncology/ctcae';
import { CTCAE_TERMS } from '@/lib/oncology/ctcae';
import { METABOLIC_THRESHOLDS } from '@/lib/oncology/thresholds';
import { profileForVariant } from '@/lib/oncology/p53';

export interface OncoRecommendation {
  id: string;
  title: string;
  detail: string;
  category: 'Nutrition' | 'Hydration' | 'Glycaemic' | 'Toxicity' | 'Functional' | 'Mutation-aware' | 'Escalation';
  priority: 'high' | 'medium' | 'low';
  rationale: string;
}

interface Inputs {
  patient: OncoPatient;
  metabolic: MetabolicLog[];
  toxicities: ToxicityEntry[];
  variant?: string | null;
}

const last = <T,>(arr: T[]) => (arr.length ? arr[arr.length - 1] : undefined);

export const weightLossPct = (patient: OncoPatient, metabolic: MetabolicLog[]) => {
  const baseline = patient.baselineWeightKg ?? metabolic.find((m) => m.weightKg)?.weightKg;
  const current = [...metabolic].reverse().find((m) => m.weightKg)?.weightKg;
  if (!baseline || !current) return 0;
  return ((baseline - current) / baseline) * 100;
};

export const generateOncoRecommendations = ({ patient, metabolic, toxicities, variant }: Inputs): OncoRecommendation[] => {
  const recs: OncoRecommendation[] = [];
  const latest = last(metabolic);
  const loss = weightLossPct(patient, metabolic);
  const p53 = profileForVariant(variant);

  // --- Glycaemic ---
  if (latest?.glucose && latest.glucose >= METABOLIC_THRESHOLDS.glucoseCriticalHigh) {
    recs.push({
      id: 'glucose-critical',
      title: 'Contact your care team about severe hyperglycaemia',
      detail: `Latest glucose is ${latest.glucose} mg/dL. Insulin adjustment is likely required today.`,
      category: 'Escalation',
      priority: 'high',
      rationale: `Above the ${METABOLIC_THRESHOLDS.glucoseCriticalHigh} mg/dL escalation threshold.`,
    });
  } else if (latest?.glucose && latest.glucose >= METABOLIC_THRESHOLDS.glucoseFastingHigh) {
    recs.push({
      id: 'glucose-steroid',
      title: patient.onSteroids ? 'Anticipate the steroid glucose curve' : 'Tighten glucose sampling',
      detail: patient.onSteroids
        ? `${patient.steroidAgent ?? 'Corticosteroid'} peaks 4–8 hours after dosing. Sample glucose pre-lunch and pre-dinner and pair carbohydrate with protein.`
        : 'Check fasting and post-prandial glucose daily for the next cycle.',
      category: 'Glycaemic',
      priority: 'high',
      rationale: `Latest reading ${latest.glucose} mg/dL exceeds ${METABOLIC_THRESHOLDS.glucoseFastingHigh} mg/dL.`,
    });
  }

  // --- Cachexia / nutrition ---
  if (loss >= METABOLIC_THRESHOLDS.weightLossSeverePct) {
    recs.push({
      id: 'cachexia-severe',
      title: 'Refractory cachexia risk — request a dietitian review',
      detail: `You have lost ${loss.toFixed(1)}% of baseline weight. Target 1.5 g protein per kg body weight per day plus resistance exercise as tolerated.`,
      category: 'Nutrition',
      priority: 'high',
      rationale: `≥${METABOLIC_THRESHOLDS.weightLossSeverePct}% unintentional loss defines severe cachexia.`,
    });
  } else if (loss >= METABOLIC_THRESHOLDS.weightLoss6MonthPct) {
    recs.push({
      id: 'cachexia-early',
      title: 'Start the anti-cachexia protein protocol',
      detail: 'Add 25–30 g of high-biological-value protein at breakfast and after any activity; consider omega-3 supplementation with your team.',
      category: 'Nutrition',
      priority: 'medium',
      rationale: `${loss.toFixed(1)}% weight loss crosses the ${METABOLIC_THRESHOLDS.weightLoss6MonthPct}% cachexia threshold.`,
    });
  }

  if (latest?.proteinG !== undefined && patient.baselineWeightKg) {
    const target = Math.round(patient.baselineWeightKg * 1.2);
    if (latest.proteinG < target) {
      recs.push({
        id: 'protein-gap',
        title: `Protein intake is ${target - latest.proteinG} g below target`,
        detail: `Aim for ${target} g per day (1.2 g/kg) to protect lean mass during treatment.`,
        category: 'Nutrition',
        priority: 'medium',
        rationale: 'ESPEN guidance for oncology patients is 1.2–1.5 g/kg/day.',
      });
    }
  }

  // --- Hydration / nephrotoxicity ---
  const platinum = (patient.regimen ?? '').toLowerCase().includes('cisplatin');
  const fluidTarget = platinum ? METABOLIC_THRESHOLDS.fluidIntakeCisplatinMl : METABOLIC_THRESHOLDS.fluidIntakeMinMl;
  if (latest?.fluidMl !== undefined && latest.fluidMl < fluidTarget) {
    recs.push({
      id: 'hydration',
      title: 'Increase fluid intake for renal protection',
      detail: `You logged ${latest.fluidMl} mL. Target ${fluidTarget} mL/day${platinum ? ' on a platinum regimen' : ''}, spread evenly across the day.`,
      category: 'Hydration',
      priority: platinum ? 'high' : 'medium',
      rationale: 'Adequate hydration reduces platinum-induced tubular injury and contrast nephropathy risk.',
    });
  }

  // --- Toxicity-driven ---
  const recent = toxicities.slice(0, 12);
  recent.forEach((entry) => {
    const term = CTCAE_TERMS.find((t) => t.id === entry.termId);
    if (!term || entry.grade < term.escalateAt) return;
    recs.push({
      id: `tox-${entry.id}`,
      title: `${term.label} at grade ${entry.grade} needs action`,
      detail:
        entry.grade >= term.escalateAt + 1
          ? 'Contact your oncology team today — dose modification or supportive therapy is indicated.'
          : 'Preemptive supportive care is indicated before the next cycle (anti-emetics, mouth care or neuroprotective measures as appropriate).',
      category: entry.grade >= 3 ? 'Escalation' : 'Toxicity',
      priority: entry.grade >= 3 ? 'high' : 'medium',
      rationale: `CTCAE v5.0 ${term.label} grade ${entry.grade}: ${term.grades[entry.grade]}`,
    });
  });

  // --- Functional status ---
  if (patient.ecog !== undefined && patient.ecog >= 2) {
    recs.push({
      id: 'ecog',
      title: 'Functional decline detected (ECOG ' + patient.ecog + ')',
      detail: 'Ask about a supervised exercise-oncology referral and reassess treatment intensity with your oncologist.',
      category: 'Functional',
      priority: 'medium',
      rationale: 'ECOG ≥2 predicts higher regimen toxicity and reduced treatment tolerance.',
    });
  }

  // --- Mutation-aware ---
  p53.risks
    .filter((r) => r.level === 'high')
    .forEach((r, i) => {
      recs.push({
        id: `p53-${i}`,
        title: `${r.domain} surveillance intensified for ${p53.variant}`,
        detail: r.rationale,
        category: 'Mutation-aware',
        priority: 'medium',
        rationale: `${p53.classification} TP53 variant — ${p53.summary}`,
      });
    });

  const order = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => order[a.priority] - order[b.priority]);
};
