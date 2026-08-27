import React from 'react';
import { cn } from '@/lib/utils';
import { gradeStyles, type CtcaeGrade } from '@/lib/oncology/ctcae';

const GradeBadge: React.FC<{ grade: CtcaeGrade; label?: string; className?: string }> = ({
  grade,
  label,
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      gradeStyles(grade),
      className
    )}
  >
    {label ?? (grade === 0 ? 'No toxicity' : `Grade ${grade}`)}
  </span>
);

export default GradeBadge;
