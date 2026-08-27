# MediSynic → p53-Aware Oncology Surveillance Platform

Two things happen together: a full visual/layout unification pass, and a content pivot from diabetes management to precision-oncology monitoring. Delivered in phases so the app stays usable at every step.

## Phase 1 — Design system + layout unification (the "clean the mess" pass)

- One clinical design language: replace the current indigo/blue mix and hardcoded `text-gray-*`, `bg-white/90`, `from-blue-50` utilities with semantic tokens in `index.css` (surface, muted, primary, warning/toxicity severity scale, chart palette). Oncology-appropriate palette: deep teal/slate primary with an amber→red severity scale for CTCAE grades.
- One page shell component (`PageContainer`) used by every route: consistent max width, horizontal padding, top/bottom spacing, page title + subtitle + action slot. Every page gets converted to it.
- One card language: retire the three overlapping classes (`card-glass`, `glass-card`, `premium-card`) in favour of the shadcn `Card` with a single set of variants.
- Typography scale fixed (page title / section title / body / caption), consistent section gaps and grid gutters across dashboard, forms and content pages.
- Sidebar + navbar restructured into clinical groups: Overview, Patient, Toxicity, Therapy, Labs, Account.

## Phase 2 — Oncology reframing of existing modules (Tier 1 + Tier 2)

- Onboarding/assessment: replace diabetes questions with cancer indication, stage, treatment regimen, current chemo-cycle phase (premedication / infusion / nadir / recovery), steroid use.
- Glucose module → **Onco-Metabolic Monitor**: steroid-induced hyperglycemia, weight/muscle-mass trend with cachexia thresholds, hydration tied to nephrotoxicity risk.
- Health score → **ECOG Performance Status** (0–5) tracked over time.
- Symptom checker → **CTCAE v5.0 toxicity grading** (nausea, fatigue, neuropathy, mucositis, diarrhoea, neutropenia) with grade 1–5 selectors and trend history.
- Drug interaction checker → **Oncology DDI engine**: CYP3A4/CYP450 rules across TKIs, chemo agents and metabolic drugs (metformin, SGLT2i, insulin, statins), flagging QT prolongation, myelosuppression, nephrotoxicity.
- Recommendations → anti-cachexia high-protein nutrition, hydration protocols, preemptive supportive care, each with a stated rationale.
- New **Tumor Marker / Liquid Biopsy** module: log CA-19-9, CEA, PSA, CA-125, ctDNA, LDH with rise-rate alerts.

## Phase 3 — p53 / Oncyra layer

- **Oncyra Import**: paste or upload an Oncyra JSON variant export; parse TP53 variant + rescue-compound shortlist and store it on the patient profile.
- Mutation-aware risk panel: predicted metabolic phenotype (insulin resistance, β-cell stress, cardiac/renal risk) driven by the imported variant, surfaced on the dashboard and used to prioritise recommendations and DDI warnings.
- AI Pharmacist reasoning updated to account for p53 rescue compounds (rezatapopt, COTI-2) and their glucose-homeostasis effects.
- Cycle-phase-aware timeline view: metrics and toxicity grades plotted against premedication → infusion → nadir → recovery.

## Phase 4 — Gene therapy / CAR-T monitoring (Tier 3)

- **CRS dashboard**: CRP, ferritin, IL-6 entry with escalation thresholds (e.g. CRP > 100 mg/L → clinician prompt).
- **ICANS / ICE score** assessment (orientation, naming, commands, writing, attention) replacing the generic symptom flow for CAR-T patients.
- **Off-target tracker**: VAF over time plus lysis markers (LDH).
- Oncetra placeholder panel for ECG/HRV feed with a clearly marked "not yet connected" state.
- Structured JSON export of the longitudinal record.

## Naming

Keeping the MediSynic name and repositioning the tagline to "Precision oncology and gene-therapy surveillance". A rename to OncoTrak / PhaseGuard is a one-line change later if wanted.

## Technical notes

- Data stays client-side (local storage + context) for this MVP; the demo login continues to work. If you want real accounts, per-patient history and clinician sharing, that needs a backend, which we can add as a later phase.
- New shared modules: `src/lib/oncology/ctcae.ts` (grading catalogue), `src/lib/oncology/ddi.ts` (interaction rules), `src/lib/oncology/oncyra.ts` (JSON schema + parser), `src/lib/oncology/p53.ts` (variant → metabolic-risk mapping).
- Existing framework-agnostic utils (`healthCalculations`, `fdaApi`) are reused; `healthRecommendations` is rewritten against the oncology rule set.
- All clinical thresholds are constants in one file so they are auditable, with an on-screen "clinical decision support, not a medical device" disclaimer.

## Scope note

Phases 1 and 2 are the substantive MVP and where most of the work is. Phases 3 and 4 build on them. I will start at Phase 1 and work down unless you want a different order.
