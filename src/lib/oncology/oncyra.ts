/**
 * Oncyra JSON export schema + parser.
 * Oncyra ranks TP53 rescue candidates in silico; MediSynic consumes that export
 * to become mutation-aware.
 */

export interface OncyraCandidate {
  compound: string;
  score?: number;
  mechanism?: string;
  evidence?: string;
}

export interface OncyraImport {
  patientRef?: string;
  gene: string;
  variant: string;
  proteinChange?: string;
  indication?: string;
  candidates: OncyraCandidate[];
  generatedAt?: string;
}

export const ONCYRA_SAMPLE: OncyraImport = {
  patientRef: 'ONC-2291',
  gene: 'TP53',
  variant: 'p.Y220C',
  proteinChange: 'Y220C',
  indication: 'Non-small cell lung cancer',
  generatedAt: new Date().toISOString().slice(0, 10),
  candidates: [
    { compound: 'Rezatapopt (PC14586)', score: 0.92, mechanism: 'Y220C pocket binder, refolds mutant p53', evidence: 'PMID 37256980' },
    { compound: 'PK7088', score: 0.71, mechanism: 'Y220C stabiliser', evidence: 'PMID 24240635' },
    { compound: 'Eprenetapopt (APR-246)', score: 0.64, mechanism: 'Thiol-binding conformational reactivator', evidence: 'PMID 33900800' },
  ],
};

const pick = (obj: Record<string, unknown>, keys: string[]) => {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
};

export const parseOncyraJson = (raw: string): { data?: OncyraImport; error?: string } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: 'That is not valid JSON. Paste the full Oncyra export including the outer braces.' };
  }
  if (!parsed || typeof parsed !== 'object') return { error: 'Expected a JSON object at the top level.' };

  const obj = parsed as Record<string, any>;
  const gene = pick(obj, ['gene', 'target_gene', 'targetGene']) ?? 'TP53';
  const variant =
    pick(obj, ['variant', 'mutation', 'hgvsp', 'protein_change', 'proteinChange']) ??
    (Array.isArray(obj.variants) && obj.variants[0]
      ? pick(obj.variants[0], ['variant', 'mutation', 'protein_change', 'hgvsp'])
      : undefined);

  if (!variant) return { error: 'No variant found. The export needs a "variant" (e.g. "p.Y220C") field.' };

  const rawCandidates: any[] =
    obj.candidates ?? obj.rescue_candidates ?? obj.rescueCandidates ?? obj.ranked_compounds ?? obj.compounds ?? [];

  const candidates: OncyraCandidate[] = (Array.isArray(rawCandidates) ? rawCandidates : [])
    .map((c) =>
      typeof c === 'string'
        ? { compound: c }
        : {
            compound: pick(c, ['compound', 'name', 'drug', 'ligand']) ?? 'Unnamed compound',
            score: typeof c.score === 'number' ? c.score : typeof c.rank_score === 'number' ? c.rank_score : undefined,
            mechanism: pick(c, ['mechanism', 'moa', 'mode_of_action']),
            evidence: pick(c, ['evidence', 'pmid', 'reference']),
          }
    )
    .filter((c) => c.compound);

  return {
    data: {
      patientRef: pick(obj, ['patient_ref', 'patientRef', 'sample_id', 'sampleId']),
      gene,
      variant,
      proteinChange: variant.replace(/^p\.?/i, ''),
      indication: pick(obj, ['indication', 'cancer_type', 'cancerType', 'tumor_type']),
      candidates,
      generatedAt: pick(obj, ['generated_at', 'generatedAt', 'date']),
    },
  };
};
