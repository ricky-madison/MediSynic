import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CtcaeGrade, ToxicityEntry } from '@/lib/oncology/ctcae';
import type { CyclePhase } from '@/lib/oncology/cycle';
import type { OncyraImport } from '@/lib/oncology/oncyra';

export interface OncoPatient {
  name?: string;
  age?: number;
  sex?: string;
  indication?: string;
  stage?: string;
  regimen?: string;
  cyclePhase?: CyclePhase;
  cycleNumber?: number;
  onSteroids?: boolean;
  steroidAgent?: string;
  ecog?: number;
  baselineWeightKg?: number;
  heightCm?: number;
  cellTherapy?: boolean;
  medications?: string[];
}

export interface MetabolicLog {
  id: string;
  date: string;
  glucose?: number;
  hba1c?: number;
  weightKg?: number;
  fluidMl?: number;
  proteinG?: number;
  creatinine?: number;
  cyclePhase?: CyclePhase;
}

export interface MarkerLog {
  id: string;
  date: string;
  marker: string;
  value: number;
}

export interface CrsLog {
  id: string;
  date: string;
  crp?: number;
  ferritin?: number;
  il6?: number;
  ldh?: number;
  tempC?: number;
}

export interface IceLog {
  id: string;
  date: string;
  orientation: number;
  naming: number;
  commands: number;
  writing: number;
  attention: number;
}

interface OncologyState {
  patient: OncoPatient;
  oncyra: OncyraImport | null;
  toxicities: ToxicityEntry[];
  metabolic: MetabolicLog[];
  markers: MarkerLog[];
  crs: CrsLog[];
  ice: IceLog[];
}

interface OncologyContextValue extends OncologyState {
  updatePatient: (patch: Partial<OncoPatient>) => void;
  setOncyra: (data: OncyraImport | null) => void;
  addToxicity: (termId: string, grade: CtcaeGrade, note?: string) => void;
  addMetabolic: (log: Omit<MetabolicLog, 'id' | 'date'> & { date?: string }) => void;
  addMarker: (marker: string, value: number, date?: string) => void;
  addCrs: (log: Omit<CrsLog, 'id' | 'date'> & { date?: string }) => void;
  addIce: (log: Omit<IceLog, 'id' | 'date'> & { date?: string }) => void;
  exportRecord: () => string;
  resetOncologyData: () => void;
}

const STORAGE_KEY = 'medisynic_oncology_v1';

const emptyState: OncologyState = {
  patient: { cyclePhase: 'premedication', medications: [] },
  oncyra: null,
  toxicities: [],
  metabolic: [],
  markers: [],
  crs: [],
  ice: [],
};

const demoState: OncologyState = {
  patient: {
    name: 'John Doe',
    age: 61,
    sex: 'Male',
    indication: 'Non-small cell lung cancer',
    stage: 'IIIB',
    regimen: 'Carboplatin + paclitaxel + pembrolizumab',
    cyclePhase: 'nadir',
    cycleNumber: 3,
    onSteroids: true,
    steroidAgent: 'Dexamethasone',
    ecog: 1,
    baselineWeightKg: 82,
    heightCm: 178,
    cellTherapy: false,
    medications: ['Carboplatin', 'Paclitaxel', 'Pembrolizumab', 'Dexamethasone', 'Metformin', 'Ondansetron'],
  },
  oncyra: null,
  toxicities: [
    { id: 't1', termId: 'fatigue', grade: 2, date: daysAgo(1), cyclePhase: 'nadir' },
    { id: 't2', termId: 'neuropathy', grade: 1, date: daysAgo(3), cyclePhase: 'nadir' },
    { id: 't3', termId: 'nausea', grade: 2, date: daysAgo(5), cyclePhase: 'infusion' },
    { id: 't4', termId: 'hyperglycemia', grade: 2, date: daysAgo(6), cyclePhase: 'premedication' },
  ],
  metabolic: [
    { id: 'm1', date: daysAgo(14), glucose: 108, weightKg: 82, fluidMl: 2100, proteinG: 78, cyclePhase: 'premedication' },
    { id: 'm2', date: daysAgo(10), glucose: 168, weightKg: 81, fluidMl: 2400, proteinG: 70, cyclePhase: 'infusion' },
    { id: 'm3', date: daysAgo(7), glucose: 184, weightKg: 79.5, fluidMl: 1800, proteinG: 58, cyclePhase: 'nadir' },
    { id: 'm4', date: daysAgo(3), glucose: 176, weightKg: 78.4, fluidMl: 1600, proteinG: 54, cyclePhase: 'nadir' },
    { id: 'm5', date: daysAgo(1), glucose: 162, weightKg: 77.9, fluidMl: 2000, proteinG: 66, cyclePhase: 'nadir' },
  ],
  markers: [
    { id: 'k1', date: daysAgo(60), marker: 'cea', value: 8.2 },
    { id: 'k2', date: daysAgo(30), marker: 'cea', value: 9.6 },
    { id: 'k3', date: daysAgo(5), marker: 'cea', value: 13.1 },
    { id: 'k4', date: daysAgo(5), marker: 'ldh', value: 268 },
  ],
  crs: [],
  ice: [],
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);

const OncologyContext = createContext<OncologyContextValue | undefined>(undefined);

export const OncologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OncologyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...emptyState, ...JSON.parse(saved) };
    } catch {
      /* ignore */
    }
    return demoState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const updatePatient = useCallback((patch: Partial<OncoPatient>) => {
    setState((s) => ({ ...s, patient: { ...s.patient, ...patch } }));
  }, []);

  const setOncyra = useCallback((data: OncyraImport | null) => {
    setState((s) => ({
      ...s,
      oncyra: data,
      patient: data?.indication ? { ...s.patient, indication: s.patient.indication ?? data.indication } : s.patient,
    }));
  }, []);

  const addToxicity = useCallback((termId: string, grade: CtcaeGrade, note?: string) => {
    setState((s) => ({
      ...s,
      toxicities: [
        { id: uid(), termId, grade, note, date: today(), cyclePhase: s.patient.cyclePhase },
        ...s.toxicities,
      ],
    }));
  }, []);

  const addMetabolic = useCallback((log: Omit<MetabolicLog, 'id' | 'date'> & { date?: string }) => {
    setState((s) => ({
      ...s,
      metabolic: [...s.metabolic, { id: uid(), date: log.date ?? today(), cyclePhase: s.patient.cyclePhase, ...log }],
    }));
  }, []);

  const addMarker = useCallback((marker: string, value: number, date?: string) => {
    setState((s) => ({ ...s, markers: [...s.markers, { id: uid(), marker, value, date: date ?? today() }] }));
  }, []);

  const addCrs = useCallback((log: Omit<CrsLog, 'id' | 'date'> & { date?: string }) => {
    setState((s) => ({ ...s, crs: [...s.crs, { id: uid(), date: log.date ?? today(), ...log }] }));
  }, []);

  const addIce = useCallback((log: Omit<IceLog, 'id' | 'date'> & { date?: string }) => {
    setState((s) => ({ ...s, ice: [...s.ice, { id: uid(), date: log.date ?? today(), ...log }] }));
  }, []);

  const exportRecord = useCallback(
    () => JSON.stringify({ schema: 'medisynic.longitudinal.v1', exportedAt: new Date().toISOString(), ...state }, null, 2),
    [state]
  );

  const resetOncologyData = useCallback(() => setState(emptyState), []);

  const value = useMemo(
    () => ({
      ...state,
      updatePatient,
      setOncyra,
      addToxicity,
      addMetabolic,
      addMarker,
      addCrs,
      addIce,
      exportRecord,
      resetOncologyData,
    }),
    [state, updatePatient, setOncyra, addToxicity, addMetabolic, addMarker, addCrs, addIce, exportRecord, resetOncologyData]
  );

  return <OncologyContext.Provider value={value}>{children}</OncologyContext.Provider>;
};

export const useOncology = () => {
  const ctx = useContext(OncologyContext);
  if (!ctx) throw new Error('useOncology must be used within an OncologyProvider');
  return ctx;
};
