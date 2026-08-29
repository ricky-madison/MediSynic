import React from 'react';
import { Users, CalendarClock, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import SectionCard from '@/components/layout/SectionCard';
import ClinicalDisclaimer from '@/components/layout/ClinicalDisclaimer';
import { useToast } from '@/components/ui/use-toast';

const CaregiverIntegration = () => {
  const { toast } = useToast();

  const notReady = () =>
    toast({
      title: 'Coming soon',
      description: 'Care circle sharing is not enabled in this demo build.',
      duration: 3000,
    });

  const modules = [
    {
      title: 'Medication oversight',
      icon: Users,
      description: 'Share the regimen and supportive-care schedule with a nominated caregiver.',
      action: 'Set up sharing',
    },
    {
      title: 'Clinical data access',
      icon: CalendarClock,
      description: 'Grant the care team read access to metabolic logs, toxicities and tumour markers.',
      action: 'Configure access',
    },
    {
      title: 'Escalation alerts',
      icon: Bell,
      description: 'Notify the caregiver when a CTCAE grade or CRS flag crosses the escalation threshold.',
      action: 'Set alert rules',
    },
  ];

  const benefits = [
    { icon: Bell, title: 'Symptom escalation', text: 'Caregivers are alerted to grade 3+ toxicity signals.' },
    { icon: CalendarClock, title: 'Cycle coordination', text: 'Track infusion dates, labs and clinic visits together.' },
    { icon: MessageSquare, title: 'Secure messaging', text: 'Communicate with the oncology team in one thread.' },
    { icon: Users, title: 'Shared care plan', text: 'Coordinate nutrition, hydration and adherence tasks.' },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Care circle"
        description="Coordinate surveillance with caregivers and the wider oncology team."
      />

      <div className="grid-cards">
        {modules.map((m) => (
          <SectionCard key={m.title} title={m.title} description={m.description} icon={m.icon}>
            <Button variant="outline" className="w-full" onClick={notReady}>
              {m.action}
            </Button>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="What caregivers can do" icon={Users}>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3">
              <div className="rounded-lg bg-muted p-2 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{b.title}</h3>
                <p className="text-caption">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <ClinicalDisclaimer />
    </PageContainer>
  );
};

export default CaregiverIntegration;
