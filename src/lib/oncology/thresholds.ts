/**
 * Single auditable source of every clinical threshold used by MediSynic.
 * Values are conservative, literature-derived defaults for decision support
 * and must be tuned per protocol by the treating team.
 */

export const METABOLIC_THRESHOLDS = {
  /** Steroid-induced hyperglycemia (mg/dL) */
  glucoseFastingHigh: 126,
  glucoseRandomHigh: 200,
  glucoseCriticalHigh: 300,
  glucoseLow: 70,
  hba1cHigh: 6.5,
  /** Cachexia: % unintentional body-weight loss */
  weightLoss6MonthPct: 5,
  weightLossSeverePct: 10,
  /** Hydration for nephrotoxicity prevention (mL/day) */
  fluidIntakeMinMl: 2000,
  fluidIntakeCisplatinMl: 3000,
  creatinineHigh: 1.3,
} as const;

export const CRS_THRESHOLDS = {
  /** C-reactive protein, mg/L */
  crpEscalation: 100,
  crpWatch: 50,
  /** Ferritin, ng/mL */
  ferritinEscalation: 10000,
  ferritinWatch: 1000,
  /** IL-6, pg/mL */
  il6Escalation: 100,
  /** Lactate dehydrogenase, U/L */
  ldhHigh: 250,
  tempFeverC: 38,
} as const;

export const ICE_THRESHOLDS = {
  maxScore: 10,
  /** ICE score → ICANS grade boundaries */
  grade1Min: 7,
  grade2Min: 3,
  grade3Min: 1,
} as const;

export const TUMOR_MARKER_REFERENCE: Record<
  string,
  { label: string; unit: string; upperLimit: number; note: string }
> = {
  cea: { label: 'CEA', unit: 'ng/mL', upperLimit: 5, note: 'Colorectal, lung, breast' },
  ca199: { label: 'CA 19-9', unit: 'U/mL', upperLimit: 37, note: 'Pancreatic, biliary' },
  ca125: { label: 'CA 125', unit: 'U/mL', upperLimit: 35, note: 'Ovarian' },
  psa: { label: 'PSA', unit: 'ng/mL', upperLimit: 4, note: 'Prostate' },
  afp: { label: 'AFP', unit: 'ng/mL', upperLimit: 10, note: 'Hepatocellular, germ cell' },
  ctdna: { label: 'ctDNA (VAF)', unit: '%', upperLimit: 0.5, note: 'Molecular residual disease' },
  ldh: { label: 'LDH', unit: 'U/L', upperLimit: 250, note: 'Tumour burden / lysis' },
};

/** A rise of this proportion between consecutive results triggers an alert. */
export const MARKER_RISE_ALERT_PCT = 25;
