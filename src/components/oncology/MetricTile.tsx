import React from 'react';
import { cn } from '@/lib/utils';

interface MetricTileProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: string;
  icon?: React.ElementType;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}

const toneRing = {
  default: 'text-primary bg-primary/10',
  warning: 'text-grade-2 bg-grade-2/15',
  danger: 'text-grade-4 bg-grade-4/15',
  success: 'text-success bg-success/10',
};

const MetricTile: React.FC<MetricTileProps> = ({ label, value, unit, hint, icon: Icon, tone = 'default' }) => (
  <div className="surface-card flex flex-col gap-3 p-5">
    <div className="flex items-start justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {Icon && (
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneRing[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-metric">{value}</span>
      {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
    </div>
    {hint && <p className="text-caption">{hint}</p>}
  </div>
);

export default MetricTile;
