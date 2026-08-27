export type CyclePhase = 'premedication' | 'infusion' | 'nadir' | 'recovery';

export interface CyclePhaseMeta {
  id: CyclePhase;
  label: string;
  window: string;
  focus: string;
  watch: string[];
}

export const CYCLE_PHASES: CyclePhaseMeta[] = [
  {
    id: 'premedication',
    label: 'Premedication',
    window: 'Day −1 to 0',
    focus: 'Steroid load and baseline capture',
    watch: ['Dexamethasone-driven glucose spike', 'Baseline weight and ECOG', 'Hydration loading'],
  },
  {
    id: 'infusion',
    label: 'Infusion',
    window: 'Day 0 to 2',
    focus: 'Acute reactions and cardiac safety',
    watch: ['QT prolongation', 'Infusion reactions', 'Renal protection fluids'],
  },
  {
    id: 'nadir',
    label: 'Nadir',
    window: 'Day 7 to 14',
    focus: 'Myelosuppression and infection risk',
    watch: ['Neutropenic fever', 'Mucositis', 'HRV collapse (Oncetra)'],
  },
  {
    id: 'recovery',
    label: 'Recovery',
    window: 'Day 15 to 21',
    focus: 'Nutrition rebuild and functional status',
    watch: ['Muscle mass recovery', 'Protein intake', 'ECOG trend'],
  },
];

export const phaseMeta = (phase?: string) =>
  CYCLE_PHASES.find((p) => p.id === phase) ?? CYCLE_PHASES[0];

export const ECOG_SCALE = [
  { score: 0, label: 'Fully active', description: 'Able to carry on all pre-disease activity without restriction' },
  { score: 1, label: 'Restricted strenuous activity', description: 'Ambulatory, able to do light work' },
  { score: 2, label: 'Ambulatory, no work', description: 'Up and about >50% of waking hours; capable of all self-care' },
  { score: 3, label: 'Limited self-care', description: 'Confined to bed or chair >50% of waking hours' },
  { score: 4, label: 'Completely disabled', description: 'Totally confined to bed or chair; no self-care' },
  { score: 5, label: 'Deceased', description: '' },
];
