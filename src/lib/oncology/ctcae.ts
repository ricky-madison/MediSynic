/**
 * NCI-CTCAE v5.0 subset used for patient-reported toxicity grading.
 * Descriptions are abbreviated for patient comprehension.
 */

export type CtcaeGrade = 0 | 1 | 2 | 3 | 4 | 5;

export interface CtcaeTerm {
  id: string;
  label: string;
  category: 'Gastrointestinal' | 'Constitutional' | 'Neurologic' | 'Hematologic' | 'Dermatologic' | 'Metabolic';
  grades: Record<CtcaeGrade, string>;
  /** Grade at or above which the care team should be contacted */
  escalateAt: CtcaeGrade;
}

const none = 'No symptoms';

export const CTCAE_TERMS: CtcaeTerm[] = [
  {
    id: 'nausea',
    label: 'Nausea',
    category: 'Gastrointestinal',
    escalateAt: 3,
    grades: {
      0: none,
      1: 'Loss of appetite without change in eating habits',
      2: 'Oral intake decreased without significant weight loss or dehydration',
      3: 'Inadequate oral intake; tube feeding or hospitalisation indicated',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'vomiting',
    label: 'Vomiting',
    category: 'Gastrointestinal',
    escalateAt: 3,
    grades: {
      0: none,
      1: '1–2 episodes in 24 hours',
      2: '3–5 episodes in 24 hours',
      3: '≥6 episodes in 24 hours; IV fluids indicated',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'diarrhea',
    label: 'Diarrhoea',
    category: 'Gastrointestinal',
    escalateAt: 3,
    grades: {
      0: none,
      1: '<4 stools per day over baseline',
      2: '4–6 stools per day over baseline',
      3: '≥7 stools per day; hospitalisation indicated',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'mucositis',
    label: 'Oral mucositis',
    category: 'Gastrointestinal',
    escalateAt: 3,
    grades: {
      0: none,
      1: 'Asymptomatic or mild symptoms',
      2: 'Moderate pain; not interfering with oral intake',
      3: 'Severe pain; interfering with oral intake',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'fatigue',
    label: 'Fatigue',
    category: 'Constitutional',
    escalateAt: 3,
    grades: {
      0: none,
      1: 'Fatigue relieved by rest',
      2: 'Fatigue not relieved by rest; limiting instrumental daily activities',
      3: 'Fatigue not relieved by rest; limiting self-care',
      4: 'Not applicable',
      5: 'Not applicable',
    },
  },
  {
    id: 'anorexia',
    label: 'Appetite loss',
    category: 'Constitutional',
    escalateAt: 2,
    grades: {
      0: none,
      1: 'Loss of appetite without change in eating habits',
      2: 'Oral intake altered without significant weight loss; supplements indicated',
      3: 'Associated with significant weight loss; tube feeding indicated',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'neuropathy',
    label: 'Peripheral neuropathy',
    category: 'Neurologic',
    escalateAt: 2,
    grades: {
      0: none,
      1: 'Asymptomatic; clinical findings only',
      2: 'Moderate symptoms; limiting instrumental daily activities',
      3: 'Severe symptoms; limiting self-care',
      4: 'Life-threatening consequences',
      5: 'Death',
    },
  },
  {
    id: 'confusion',
    label: 'Confusion / encephalopathy',
    category: 'Neurologic',
    escalateAt: 1,
    grades: {
      0: none,
      1: 'Mild disorientation',
      2: 'Moderate disorientation; limiting instrumental daily activities',
      3: 'Severe disorientation; limiting self-care',
      4: 'Life-threatening consequences; urgent intervention',
      5: 'Death',
    },
  },
  {
    id: 'fever',
    label: 'Fever',
    category: 'Hematologic',
    escalateAt: 1,
    grades: {
      0: none,
      1: '38.0–39.0 °C',
      2: '>39.0–40.0 °C',
      3: '>40.0 °C for ≤24 h',
      4: '>40.0 °C for >24 h',
      5: 'Death',
    },
  },
  {
    id: 'palmar',
    label: 'Hand–foot syndrome',
    category: 'Dermatologic',
    escalateAt: 2,
    grades: {
      0: none,
      1: 'Painless erythema or numbness',
      2: 'Painful erythema; limiting instrumental daily activities',
      3: 'Severe skin changes with pain; limiting self-care',
      4: 'Not applicable',
      5: 'Not applicable',
    },
  },
  {
    id: 'hyperglycemia',
    label: 'Hyperglycaemia',
    category: 'Metabolic',
    escalateAt: 2,
    grades: {
      0: none,
      1: 'Fasting glucose 100–160 mg/dL',
      2: 'Fasting glucose 160–250 mg/dL; oral agent indicated',
      3: 'Glucose 250–500 mg/dL; insulin indicated; hospitalisation',
      4: '>500 mg/dL; life-threatening consequences',
      5: 'Death',
    },
  },
];

export const GRADE_LABELS: Record<CtcaeGrade, string> = {
  0: 'None',
  1: 'Grade 1 · Mild',
  2: 'Grade 2 · Moderate',
  3: 'Grade 3 · Severe',
  4: 'Grade 4 · Life-threatening',
  5: 'Grade 5 · Fatal',
};

/** Tailwind classes for the shared severity scale. */
export const gradeStyles = (grade: CtcaeGrade) =>
  [
    'bg-grade-0/10 text-grade-0 border-grade-0/30',
    'bg-grade-1/10 text-grade-1 border-grade-1/30',
    'bg-grade-2/15 text-grade-2 border-grade-2/40',
    'bg-grade-3/15 text-grade-3 border-grade-3/40',
    'bg-grade-4/15 text-grade-4 border-grade-4/40',
    'bg-grade-5/15 text-grade-5 border-grade-5/40',
  ][grade];

export interface ToxicityEntry {
  id: string;
  termId: string;
  grade: CtcaeGrade;
  date: string;
  cyclePhase?: string;
  note?: string;
}

export const worstGrade = (entries: ToxicityEntry[]): CtcaeGrade =>
  entries.reduce<CtcaeGrade>((max, e) => (e.grade > max ? e.grade : max), 0);
