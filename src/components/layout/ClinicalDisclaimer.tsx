import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const ClinicalDisclaimer: React.FC<{ className?: string }> = ({ className }) => (
  <p
    className={cn(
      'flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground',
      className
    )}
  >
    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden />
    <span>
      Clinical decision support only. MediSynic is not a medical device and does not replace the
      judgement of your oncology care team. Always confirm dosing, thresholds and escalation with a
      clinician.
    </span>
  </p>
);

export default ClinicalDisclaimer;
