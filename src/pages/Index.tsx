import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Beaker,
  Brain,
  Dna,
  HeartPulse,
  Pill,
  ShieldCheck,
  Utensils,
} from 'lucide-react';

const pillars = [
  {
    icon: Activity,
    title: 'Onco-metabolic surveillance',
    body: 'Steroid-induced hyperglycaemia, cachexia and hydration tracked against auditable thresholds through every cycle phase.',
  },
  {
    icon: AlertCircle,
    title: 'CTCAE v5.0 toxicity grading',
    body: 'Patients grade side effects the way the clinic does, with escalation triggers per term and an ECOG performance trend.',
  },
  {
    icon: Pill,
    title: 'Oncology interaction engine',
    body: 'CYP450-aware screening across cytotoxics, TKIs, steroids, supportive care and p53 rescue compounds.',
  },
  {
    icon: Beaker,
    title: 'Markers & liquid biopsy',
    body: 'CEA, CA 19-9, CA 125, PSA, AFP, LDH and ctDNA VAF trended between scans with rise alerts.',
  },
  {
    icon: Dna,
    title: 'Mutation-aware from Oncyra',
    body: 'Import a TP53 rescue prediction and MediSynic reweights metabolic risk domains and surveillance intensity.',
  },
  {
    icon: Brain,
    title: 'CRS & ICANS monitoring',
    body: 'CRP, ferritin, IL-6 and the 10-point ICE assessment for CAR-T and gene-editing patients.',
  },
];

const tiers = [
  {
    tag: 'Tier 1',
    title: 'Onco-metabolic & cachexia',
    body: 'Chemotherapy-induced hyperglycaemia, high-protein anti-cachexia nutrition and nephrotoxicity-preventing hydration.',
    icon: Utensils,
  },
  {
    tag: 'Tier 2',
    title: 'Precision oncology companion',
    body: 'ECOG, CTCAE grading, oncology DDI screening and tumour-marker response tracking alongside Oncyra predictions.',
    icon: HeartPulse,
  },
  {
    tag: 'Tier 3',
    title: 'Gene therapy surveillance',
    body: 'CRS and ICANS dashboards, off-target signal tracking and an Oncetra ECG/HRV link for cardiac safety.',
    icon: Dna,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-grow">
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Precision oncology and gene-therapy surveillance
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Between-visit monitoring for patients on chemotherapy, immunotherapy and cell therapy
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                MediSynic turns the days between clinic appointments into structured clinical signal: CTCAE-graded
                toxicity, metabolic and cachexia trends, interaction screening and TP53 mutation-aware risk modelling.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}>
                  {isAuthenticated ? 'Open dashboard' : 'Start monitoring'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">How it works</Link>
                </Button>
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" /> HIPAA and GDPR-aligned data governance · decision
                support only
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <FadeIn>
            <h2 className="text-3xl font-semibold tracking-tight">Six surveillance modules, one record</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every module writes to the same longitudinal record, so a toxicity grade, a glucose reading and a marker
              rise are interpreted together.
            </p>
          </FadeIn>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <FadeIn key={p.title} delay={i * 60}>
                <article className="surface-card h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <p.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <FadeIn>
              <h2 className="text-3xl font-semibold tracking-tight">Built for the Oncyra and Oncetra ecosystem</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Oncyra predicts which compound rescues a mutant p53. Oncetra watches the heart. MediSynic is the
                longitudinal patient layer that connects prediction to lived response.
              </p>
            </FadeIn>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {tiers.map((t, i) => (
                <FadeIn key={t.tag} delay={i * 80}>
                  <article className="surface-card h-full p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.tag}</p>
                    <h3 className="mt-2 flex items-center gap-2 text-base font-semibold">
                      <t.icon className="h-4 w-4 text-primary" aria-hidden />
                      {t.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="surface-card flex flex-col items-start gap-5 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">See it with a demo patient</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Explore a stage IIIB NSCLC patient in cycle 3 nadir with steroid hyperglycaemia, grade 2 fatigue and a
                rising CEA.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Open demo account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <ClinicalDisclaimer className="mt-6" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
