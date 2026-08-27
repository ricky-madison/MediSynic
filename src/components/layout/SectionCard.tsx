import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className,
  contentClassName,
}) => (
  <Card className={cn('border-border shadow-sm', className)}>
    {(title || actions) && (
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
        <div className="space-y-1">
          {title && (
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden />}
              {title}
            </CardTitle>
          )}
          {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </CardHeader>
    )}
    <CardContent className={cn(title ? 'pt-0' : 'pt-6', contentClassName)}>{children}</CardContent>
  </Card>
);

export default SectionCard;
