/**
 * TP53 variant → metabolic phenotype mapping.
 * p53 governs glycolysis (TIGAR, GLUT1/4 repression), oxidative phosphorylation
 * (SCO2), insulin signalling and β-cell survival, so loss- or gain-of-function
 * variants shift a patient's metabolic risk profile during therapy.
 */

export type P53Class = 'DNA-contact' | 'Structural' | 'Gain-of-function' | 'Truncating' | 'Wild-type' | 'Unknown';

export interface MetabolicRisk {
  domain: 'Glycaemic' | 'Cachexia' | 'Cardiac' | 'Renal' | 'Hepatic';
  level: 'low' | 'moderate' | 'high';
  rationale: string;
}

export interface P53Profile {
  variant: string;
  classification: P53Class;
  summary: string;
  risks: MetabolicRisk[];
  rescueCandidates: string[];
}

const KNOWN: Record<string, Omit<P53Profile, 'variant'>> = {
  Y220C: {
    classification: 'Structural',
    summary:
      'Destabilising pocket mutation with a druggable Y220C cleft. Partial refolding restores transactivation of metabolic targets (TIGAR, SCO2).',
    rescueCandidates: ['Rezatapopt (PC14586)', 'PK7088', 'Eprenetapopt (APR-246)'],
    risks: [
      { domain: 'Glycaemic', level: 'high', rationale: 'Loss of TIGAR-mediated glycolytic braking increases glucose flux; steroid co-exposure amplifies hyperglycaemia.' },
      { domain: 'Cachexia', level: 'moderate', rationale: 'Impaired SCO2-driven oxidative phosphorylation shifts muscle to catabolism.' },
      { domain: 'Cardiac', level: 'moderate', rationale: 'Mitochondrial inefficiency lowers cardiac reserve; monitor QT and HRV during infusion.' },
    ],
  },
  R175H: {
    classification: 'Gain-of-function',
    summary: 'Conformational gain-of-function variant that rewires SREBP lipid metabolism and promotes insulin resistance.',
    rescueCandidates: ['COTI-2', 'Eprenetapopt (APR-246)'],
    risks: [
      { domain: 'Glycaemic', level: 'high', rationale: 'GOF p53 drives the mevalonate/SREBP axis and hepatic insulin resistance.' },
      { domain: 'Hepatic', level: 'moderate', rationale: 'Lipogenic reprogramming raises steatosis and transaminase risk under chemotherapy.' },
      { domain: 'Cachexia', level: 'high', rationale: 'GOF variants correlate with accelerated adipose and muscle wasting.' },
    ],
  },
  R248Q: {
    classification: 'DNA-contact',
    summary: 'DNA-contact mutation with residual folding; GOF interactions accelerate glycolysis (Warburg shift).',
    rescueCandidates: ['COTI-2', 'Eprenetapopt (APR-246)'],
    risks: [
      { domain: 'Glycaemic', level: 'high', rationale: 'Strong Warburg phenotype with elevated lactate and glucose consumption.' },
      { domain: 'Renal', level: 'moderate', rationale: 'Lactate load plus platinum exposure compounds renal stress.' },
    ],
  },
  R273H: {
    classification: 'DNA-contact',
    summary: 'Frequent DNA-contact variant; loss of p53 target transactivation with modest GOF signalling.',
    rescueCandidates: ['COTI-2', 'Eprenetapopt (APR-246)'],
    risks: [
      { domain: 'Glycaemic', level: 'moderate', rationale: 'Reduced repression of GLUT1/GLUT4 raises basal glucose uptake.' },
      { domain: 'Cardiac', level: 'moderate', rationale: 'Reported cardiomyocyte stress sensitivity with anthracyclines.' },
    ],
  },
  R282W: {
    classification: 'Structural',
    summary: 'Structural variant with impaired tetramerisation and β-cell stress susceptibility.',
    rescueCandidates: ['Eprenetapopt (APR-246)'],
    risks: [
      { domain: 'Glycaemic', level: 'high', rationale: 'p53-mediated β-cell apoptosis risk under steroid and oxidative stress.' },
      { domain: 'Cachexia', level: 'moderate', rationale: 'Reduced anabolic recovery between cycles.' },
    ],
  },
  R213X: {
    classification: 'Truncating',
    summary: 'Nonsense variant producing null protein; no rescue-compound target, metabolic control relies on supportive care.',
    rescueCandidates: ['Read-through agents (investigational)'],
    risks: [
      { domain: 'Glycaemic', level: 'moderate', rationale: 'Complete loss of p53 metabolic braking; glycolysis unchecked.' },
      { domain: 'Cachexia', level: 'high', rationale: 'Null phenotype associated with pronounced wasting in advanced disease.' },
    ],
  },
};

const normalise = (v: string) => v.replace(/^p\.?/i, '').replace(/\s/g, '').toUpperCase();

export const profileForVariant = (variant?: string | null): P53Profile => {
  if (!variant) {
    return {
      variant: 'Not provided',
      classification: 'Unknown',
      summary: 'Import an Oncyra export or enter a TP53 variant to unlock mutation-aware metabolic risk modelling.',
      rescueCandidates: [],
      risks: [],
    };
  }
  const key = normalise(variant);
  const hit = Object.keys(KNOWN).find((k) => key.includes(k));
  if (hit) return { variant, ...KNOWN[hit] };

  return {
    variant,
    classification: 'Unknown',
    summary:
      'Variant is not in the curated metabolic knowledge base. Generic p53-loss monitoring applied: glycaemic and cachexia surveillance at moderate intensity.',
    rescueCandidates: [],
    risks: [
      { domain: 'Glycaemic', level: 'moderate', rationale: 'Assumed partial loss of p53 metabolic regulation.' },
      { domain: 'Cachexia', level: 'moderate', rationale: 'Default surveillance for treatment-associated wasting.' },
    ],
  };
};

export const riskLevelClass = (level: MetabolicRisk['level']) =>
  level === 'high'
    ? 'bg-grade-4/15 text-grade-4 border-grade-4/40'
    : level === 'moderate'
      ? 'bg-grade-2/15 text-grade-2 border-grade-2/40'
      : 'bg-grade-1/10 text-grade-1 border-grade-1/30';
