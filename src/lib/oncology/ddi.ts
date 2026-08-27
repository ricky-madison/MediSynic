/**
 * Oncology drug–drug interaction engine.
 * Rule-based, CYP450-aware screening across oncology agents and the metabolic
 * drugs commonly co-prescribed to cancer patients. Decision support only.
 */

export type DdiSeverity = 'high' | 'moderate' | 'low';
export type DdiRisk =
  | 'QT prolongation'
  | 'Myelosuppression'
  | 'Nephrotoxicity'
  | 'Hepatotoxicity'
  | 'Hyperglycaemia'
  | 'Lactic acidosis'
  | 'Bleeding'
  | 'Neurotoxicity';

export interface DrugProfile {
  id: string;
  name: string;
  aliases: string[];
  class:
    | 'TKI'
    | 'Cytotoxic'
    | 'Immunotherapy'
    | 'Hormonal'
    | 'Corticosteroid'
    | 'Metabolic'
    | 'Supportive'
    | 'p53 rescue'
    | 'Cell therapy support';
  cyp: { substrate?: string[]; inhibitor?: string[]; inducer?: string[] };
  risks: DdiRisk[];
  metabolicNote?: string;
}

export const DRUGS: DrugProfile[] = [
  { id: 'imatinib', name: 'Imatinib', aliases: ['gleevec'], class: 'TKI', cyp: { substrate: ['CYP3A4'], inhibitor: ['CYP3A4', 'CYP2D6'] }, risks: ['Hepatotoxicity', 'Myelosuppression'], metabolicNote: 'May improve insulin sensitivity and lower fasting glucose.' },
  { id: 'nilotinib', name: 'Nilotinib', aliases: ['tasigna'], class: 'TKI', cyp: { substrate: ['CYP3A4'], inhibitor: ['CYP3A4'] }, risks: ['QT prolongation', 'Hyperglycaemia'], metabolicNote: 'Well-documented hyperglycaemia and dyslipidaemia signal.' },
  { id: 'osimertinib', name: 'Osimertinib', aliases: ['tagrisso'], class: 'TKI', cyp: { substrate: ['CYP3A4'] }, risks: ['QT prolongation'] },
  { id: 'sunitinib', name: 'Sunitinib', aliases: ['sutent'], class: 'TKI', cyp: { substrate: ['CYP3A4'] }, risks: ['QT prolongation', 'Hepatotoxicity'] },
  { id: 'capecitabine', name: 'Capecitabine', aliases: ['xeloda'], class: 'Cytotoxic', cyp: { inhibitor: ['CYP2C9'] }, risks: ['Myelosuppression', 'Bleeding'] },
  { id: 'cisplatin', name: 'Cisplatin', aliases: [], class: 'Cytotoxic', cyp: {}, risks: ['Nephrotoxicity', 'Neurotoxicity', 'Myelosuppression'] },
  { id: 'carboplatin', name: 'Carboplatin', aliases: [], class: 'Cytotoxic', cyp: {}, risks: ['Myelosuppression', 'Nephrotoxicity'] },
  { id: 'doxorubicin', name: 'Doxorubicin', aliases: ['adriamycin'], class: 'Cytotoxic', cyp: { substrate: ['CYP3A4'] }, risks: ['Myelosuppression', 'QT prolongation'] },
  { id: 'paclitaxel', name: 'Paclitaxel', aliases: ['taxol'], class: 'Cytotoxic', cyp: { substrate: ['CYP3A4', 'CYP2C8'] }, risks: ['Neurotoxicity', 'Myelosuppression'] },
  { id: 'pembrolizumab', name: 'Pembrolizumab', aliases: ['keytruda'], class: 'Immunotherapy', cyp: {}, risks: ['Hyperglycaemia'], metabolicNote: 'Rare autoimmune type-1 diabetes; monitor glucose each cycle.' },
  { id: 'dexamethasone', name: 'Dexamethasone', aliases: ['decadron'], class: 'Corticosteroid', cyp: { inducer: ['CYP3A4'] }, risks: ['Hyperglycaemia'], metabolicNote: 'Primary driver of steroid-induced hyperglycaemia during premedication.' },
  { id: 'prednisone', name: 'Prednisone', aliases: [], class: 'Corticosteroid', cyp: { inducer: ['CYP3A4'] }, risks: ['Hyperglycaemia'] },
  { id: 'metformin', name: 'Metformin', aliases: ['glucophage'], class: 'Metabolic', cyp: {}, risks: ['Lactic acidosis'], metabolicNote: 'Renally cleared; hold around nephrotoxic chemo and contrast.' },
  { id: 'empagliflozin', name: 'Empagliflozin (SGLT2i)', aliases: ['jardiance', 'sglt2'], class: 'Metabolic', cyp: {}, risks: ['Nephrotoxicity'], metabolicNote: 'Euglycaemic ketoacidosis risk when oral intake collapses.' },
  { id: 'insulin', name: 'Insulin', aliases: [], class: 'Metabolic', cyp: {}, risks: ['Hyperglycaemia'] },
  { id: 'atorvastatin', name: 'Atorvastatin', aliases: ['lipitor'], class: 'Metabolic', cyp: { substrate: ['CYP3A4'] }, risks: ['Hepatotoxicity'] },
  { id: 'ondansetron', name: 'Ondansetron', aliases: ['zofran'], class: 'Supportive', cyp: { substrate: ['CYP3A4'] }, risks: ['QT prolongation'] },
  { id: 'tocilizumab', name: 'Tocilizumab', aliases: ['actemra'], class: 'Cell therapy support', cyp: { inducer: ['CYP3A4'] }, risks: [], metabolicNote: 'First-line for grade ≥2 cytokine release syndrome.' },
  { id: 'rezatapopt', name: 'Rezatapopt (PC14586)', aliases: ['pc14586'], class: 'p53 rescue', cyp: { substrate: ['CYP3A4'] }, risks: ['Hyperglycaemia'], metabolicNote: 'p53 Y220C reactivator; restored p53 signalling can shift glucose uptake and insulin sensitivity.' },
  { id: 'coti2', name: 'COTI-2', aliases: ['coti'], class: 'p53 rescue', cyp: { substrate: ['CYP3A4'] }, risks: ['Hyperglycaemia'], metabolicNote: 'Thiosemicarbazone p53 reactivator with AKT/mTOR effects; monitor fasting glucose.' },
  { id: 'apr246', name: 'Eprenetapopt (APR-246)', aliases: ['apr-246', 'apr246'], class: 'p53 rescue', cyp: {}, risks: ['Neurotoxicity'], metabolicNote: 'Depletes glutathione; oxidative stress can worsen metabolic strain.' },
];

export interface DdiFinding {
  a: string;
  b: string;
  severity: DdiSeverity;
  mechanism: string;
  risks: DdiRisk[];
  action: string;
}

const findDrug = (input: string): DrugProfile | undefined => {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;
  return DRUGS.find(
    (d) => d.name.toLowerCase().includes(q) || d.id === q || d.aliases.some((a) => q.includes(a) || a.includes(q))
  );
};

export const resolveDrugs = (names: string[]): { matched: DrugProfile[]; unmatched: string[] } => {
  const matched: DrugProfile[] = [];
  const unmatched: string[] = [];
  names.forEach((n) => {
    const d = findDrug(n);
    if (d && !matched.some((m) => m.id === d.id)) matched.push(d);
    else if (!d && n.trim()) unmatched.push(n.trim());
  });
  return { matched, unmatched };
};

const overlap = (a?: string[], b?: string[]) => (a ?? []).filter((x) => (b ?? []).includes(x));

/** Screen a medication list for oncology-relevant interactions. */
export const screenInteractions = (drugs: DrugProfile[]): DdiFinding[] => {
  const findings: DdiFinding[] = [];

  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const a = drugs[i];
      const b = drugs[j];

      // CYP450 substrate vs inhibitor / inducer
      const pairs: Array<[DrugProfile, DrugProfile]> = [
        [a, b],
        [b, a],
      ];
      pairs.forEach(([x, y]) => {
        const inhibited = overlap(x.cyp.substrate, y.cyp.inhibitor);
        if (inhibited.length) {
          findings.push({
            a: x.name,
            b: y.name,
            severity: 'high',
            mechanism: `${y.name} inhibits ${inhibited.join('/')}, raising ${x.name} exposure.`,
            risks: x.risks,
            action: `Consider dose reduction of ${x.name} or an alternative agent; monitor for ${x.risks.join(', ').toLowerCase() || 'toxicity'}.`,
          });
        }
        const induced = overlap(x.cyp.substrate, y.cyp.inducer);
        if (induced.length) {
          findings.push({
            a: x.name,
            b: y.name,
            severity: 'moderate',
            mechanism: `${y.name} induces ${induced.join('/')}, lowering ${x.name} exposure.`,
            risks: [],
            action: `Watch for reduced efficacy of ${x.name}; therapeutic monitoring advised.`,
          });
        }
      });

      // Additive organ toxicity
      const sharedRisks = a.risks.filter((r) => b.risks.includes(r));
      sharedRisks.forEach((risk) => {
        findings.push({
          a: a.name,
          b: b.name,
          severity: risk === 'QT prolongation' || risk === 'Nephrotoxicity' ? 'high' : 'moderate',
          mechanism: `Additive ${risk.toLowerCase()} risk from combining ${a.name} and ${b.name}.`,
          risks: [risk],
          action:
            risk === 'QT prolongation'
              ? 'Baseline and on-treatment ECG; correct potassium and magnesium. Link Oncetra ECG feed for continuous QT surveillance.'
              : risk === 'Nephrotoxicity'
                ? 'Aggressive hydration, monitor creatinine and electrolytes; hold metformin around nephrotoxic cycles.'
                : `Monitor closely for ${risk.toLowerCase()}; consider staggered dosing.`,
        });
      });

      // Metabolic-specific rules
      if (
        (a.class === 'Corticosteroid' && b.class === 'Metabolic') ||
        (b.class === 'Corticosteroid' && a.class === 'Metabolic')
      ) {
        findings.push({
          a: a.name,
          b: b.name,
          severity: 'moderate',
          mechanism: 'Corticosteroids antagonise glucose-lowering therapy, producing cycle-timed hyperglycaemia.',
          risks: ['Hyperglycaemia'],
          action: 'Anticipate a glucose surge 4–8 h after steroid dosing; pre-plan a sliding-scale insulin bridge.',
        });
      }

      if ((a.id === 'metformin' && b.risks.includes('Nephrotoxicity')) || (b.id === 'metformin' && a.risks.includes('Nephrotoxicity'))) {
        findings.push({
          a: a.name,
          b: b.name,
          severity: 'high',
          mechanism: 'Reduced renal clearance of metformin during nephrotoxic therapy raises lactic acidosis risk.',
          risks: ['Lactic acidosis', 'Nephrotoxicity'],
          action: 'Hold metformin 48 h around the nephrotoxic agent and recheck eGFR before restarting.',
        });
      }

      if ((a.class === 'p53 rescue' || b.class === 'p53 rescue')) {
        const rescue = a.class === 'p53 rescue' ? a : b;
        const other = a.class === 'p53 rescue' ? b : a;
        if (other.class === 'Metabolic') {
          findings.push({
            a: rescue.name,
            b: other.name,
            severity: 'moderate',
            mechanism: `Restored p53 signalling from ${rescue.name} alters glycolysis and insulin sensitivity, changing the effect of ${other.name}.`,
            risks: ['Hyperglycaemia'],
            action: 'Increase glucose sampling during the first two cycles and titrate metabolic therapy against the observed trend.',
          });
        }
      }
    }
  }

  // De-duplicate identical findings
  const seen = new Set<string>();
  return findings.filter((f) => {
    const key = [f.a, f.b, f.mechanism].sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const severityWeight: Record<DdiSeverity, number> = { high: 3, moderate: 2, low: 1 };
